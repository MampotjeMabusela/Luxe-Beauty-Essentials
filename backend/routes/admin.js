const express = require('express');
const { Op } = require('sequelize');
const {
  Order,
  OrderItem,
  Product,
  User,
  Coupon,
} = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken, isAdmin);

router.get('/dashboard', async (req, res) => {
  try {
    const [orderCount, productCount, userCount, revenue] = await Promise.all([
      Order.count(),
      Product.count({ where: { is_active: true } }),
      User.count(),
      Order.sum('total_amount', {
        where: { payment_status: 'completed' },
      }),
    ]);

    const lowStock = await Product.findAll({
      where: { stock_quantity: { [Op.lte]: 10 }, is_active: true },
      limit: 10,
      order: [['stock_quantity', 'ASC']],
    });

    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['email', 'first_name'] }],
    });

    res.json({
      stats: {
        orders: orderCount,
        products: productCount,
        customers: userCount,
        revenue: revenue || 0,
      },
      lowStock,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const completed = await Order.findAll({
      where: { payment_status: 'completed' },
      attributes: ['total_amount', 'created_at', 'payment_method'],
      order: [['created_at', 'DESC']],
      limit: 100,
    });

    const byMethod = {};
    completed.forEach((o) => {
      const m = o.payment_method || 'unknown';
      byMethod[m] = (byMethod[m] || 0) + parseFloat(o.total_amount);
    });

    res.json({
      recentSales: completed,
      revenueByPaymentMethod: byMethod,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['email', 'first_name', 'last_name'] },
      ],
      order: [['created_at', 'DESC']],
      limit: 100,
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, tracking_number } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status) order.status = status;
    if (tracking_number) order.tracking_number = tracking_number;
    await order.save();

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update(req.body);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.is_active = false;
    await product.save();
    res.json({ message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['created_at', 'DESC']] });
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase(),
    });
    res.status(201).json({ coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
