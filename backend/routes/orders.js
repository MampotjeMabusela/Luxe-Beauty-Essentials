const express = require('express');
const { Op } = require('sequelize');
const { Order, OrderItem, Product, Address, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { generateOrderNumber } = require('../utils/orderNumber');
const { calculateOrderTotals } = require('../utils/shipping');
const { Coupon } = require('../models');
const { sendEmail, orderConfirmationEmail } = require('../services/email');

const router = express.Router();

router.use(authenticateToken);

async function applyCoupon(code, subtotal) {
  if (!code) return { discount: 0, coupon: null };
  const coupon = await Coupon.findOne({
    where: {
      code: code.toUpperCase(),
      is_active: true,
    },
  });
  if (!coupon) throw new Error('Invalid coupon code');
  const result = coupon.calculateDiscount(subtotal);
  if (!result.valid) throw new Error(result.error);
  return { discount: result.discount, coupon };
}

router.post('/', async (req, res) => {
  const { sequelize } = require('../models');
  const transaction = await sequelize.transaction();
  try {
    const {
      items,
      payment_method,
      shipping_address_id,
      shipping_address,
      coupon_code,
      notes,
    } = req.body;

    if (!items?.length) {
      await transaction.rollback();
      return res.status(400).json({ error: 'No items in order' });
    }

    let subtotal = 0;
    const lineItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!product || product.stock_quantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `${product?.name || 'Product'} is out of stock`,
        });
      }
      const unitPrice = parseFloat(product.price);
      const qty = parseInt(item.quantity, 10);
      const lineSubtotal = unitPrice * qty;
      subtotal += lineSubtotal;
      lineItems.push({ product, quantity: qty, unitPrice, lineSubtotal });
    }

    let discount = 0;
    let coupon = null;
    if (coupon_code) {
      const couponResult = await applyCoupon(coupon_code, subtotal);
      discount = couponResult.discount;
      coupon = couponResult.coupon;
      subtotal -= discount;
    }

    let city = shipping_address?.city;
    let addressId = shipping_address_id;

    if (shipping_address && !addressId) {
      const addr = await Address.create(
        { ...shipping_address, user_id: req.user.id, type: 'shipping' },
        { transaction }
      );
      addressId = addr.id;
      city = addr.city;
    } else if (addressId) {
      const addr = await Address.findByPk(addressId);
      city = addr?.city;
    }

    const totals = calculateOrderTotals(subtotal, city || '');

    const order = await Order.create(
      {
        order_number: generateOrderNumber(),
        user_id: req.user.id,
        status: 'pending',
        total_amount: totals.total,
        shipping_amount: totals.shipping,
        tax_amount: totals.vatAmount,
        discount_amount: discount,
        coupon_code: coupon?.code,
        shipping_address_id: addressId,
        shipping_city: city,
        shipping_zone: totals.shippingZone,
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'pending',
        notes,
      },
      { transaction }
    );

    for (const line of lineItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          product_id: line.product.id,
          quantity: line.quantity,
          unit_price: line.unitPrice,
          subtotal: line.lineSubtotal,
        },
        { transaction }
      );
      line.product.stock_quantity -= line.quantity;
      await line.product.save({ transaction });
    }

    if (coupon) {
      coupon.uses_count += 1;
      await coupon.save({ transaction });
    }

    await transaction.commit();

    const user = await User.findByPk(req.user.id);
    await sendEmail({
      to: user.email,
      subject: `Order Confirmation — ${order.order_number}`,
      html: orderConfirmationEmail(order, user),
    });

    res.status(201).json({
      order: {
        id: order.id,
        order_number: order.order_number,
        total: order.total_amount,
        shipping: order.shipping_amount,
        tax: order.tax_amount,
        discount: order.discount_amount,
        status: order.status,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
      },
      totals,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image_urls'] }],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: Address, as: 'shippingAddress' },
      ],
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/tracking', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      attributes: ['id', 'order_number', 'status', 'tracking_number', 'created_at', 'updated_at'],
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({
      order_number: order.order_number,
      status: order.status,
      tracking_number: order.tracking_number,
      timeline: [
        { status: 'pending', label: 'Order placed', at: order.created_at },
        { status: 'processing', label: 'Processing', active: ['processing', 'shipped', 'delivered'].includes(order.status) },
        { status: 'shipped', label: 'Shipped', active: ['shipped', 'delivered'].includes(order.status) },
        { status: 'delivered', label: 'Delivered', active: order.status === 'delivered' },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/return', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id, status: 'delivered' },
    });
    if (!order) {
      return res.status(400).json({ error: 'Only delivered orders can be returned' });
    }
    order.status = 'return_requested';
    order.notes = (order.notes || '') + `\nReturn: ${req.body.reason || 'Customer request'}`;
    await order.save();
    res.json({ message: 'Return request submitted', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
