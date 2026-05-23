const express = require('express');
const { Product } = require('../models');
const { Coupon } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

router.post('/validate', async (req, res) => {
  try {
    const { items = [], coupon_code } = req.body;
    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product || !product.is_active) {
        return res.status(400).json({
          error: `Product ${item.product_id} is unavailable`,
        });
      }
      const qty = Math.min(
        Math.max(1, parseInt(item.quantity, 10) || 1),
        product.stock_quantity
      );
      if (qty < 1) {
        return res.status(400).json({ error: `${product.name} is out of stock` });
      }

      const price = parseFloat(product.price);
      const lineTotal = price * qty;
      subtotal += lineTotal;

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        quantity: qty,
        unit_price: price,
        subtotal: lineTotal,
        stock_quantity: product.stock_quantity,
        image_urls: product.image_urls,
        category: product.category,
      });
    }

    let discount = 0;
    let coupon = null;
    if (coupon_code) {
      const now = new Date();
      coupon = await Coupon.findOne({
        where: {
          code: coupon_code.toUpperCase(),
          is_active: true,
          [Op.and]: [
            { [Op.or]: [{ valid_from: null }, { valid_from: { [Op.lte]: now } }] },
            { [Op.or]: [{ valid_until: null }, { valid_until: { [Op.gte]: now } }] },
          ],
        },
      });
      if (!coupon) {
        return res.status(400).json({ error: 'Invalid coupon code' });
      }
      const result = coupon.calculateDiscount(subtotal);
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }
      discount = result.discount;
    }

    subtotal = Math.round((subtotal - discount) * 100) / 100;

    res.json({
      items: validatedItems,
      subtotal,
      discount,
      coupon: coupon ? { code: coupon.code, discount_type: coupon.discount_type } : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
