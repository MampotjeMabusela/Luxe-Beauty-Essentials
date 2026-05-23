const express = require('express');
const { Order, User } = require('../models');
const PaystackService = require('../services/payment');
const { authenticateToken } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/paystack/initialize', authenticateToken, paymentLimiter, async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.payment_status === 'completed') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    const user = await User.findByPk(req.user.id);
    const data = await PaystackService.initializePayment(
      user.email,
      order.total_amount,
      { order_id: order.id, order_number: order.order_number }
    );

    order.payment_reference = data.reference;
    await order.save();

    res.json({
      authorization_url: data.authorization_url,
      access_code: data.access_code,
      reference: data.reference,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/paystack/verify', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.body;
    const data = await PaystackService.verifyPayment(reference);
    const orderId = data.metadata?.order_id;

    if (data.status === 'success' && orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        order.payment_status = 'completed';
        order.payment_reference = reference;
        order.status = 'processing';
        await order.save();
      }
    }

    res.json({ status: data.status, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/eft/initialize', authenticateToken, async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const reference = `${order.order_number}-EFT`;
    order.payment_method = 'eft';
    order.payment_reference = reference;
    await order.save();

    res.json({
      reference,
      amount: order.total_amount,
      bank: process.env.EFT_BANK_NAME || 'Standard Bank',
      account_name: process.env.EFT_ACCOUNT_NAME || 'Luxe Beauty & Essentials',
      account_number: process.env.EFT_ACCOUNT_NUMBER || '1234567890',
      branch_code: process.env.EFT_BRANCH_CODE || '051001',
      instructions: 'Use the reference exactly when making your EFT payment.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    let payload = req.body;

    if (Buffer.isBuffer(payload)) {
      payload = JSON.parse(payload.toString());
    }

    if (
      process.env.PAYSTACK_SECRET_KEY &&
      signature &&
      !PaystackService.verifyWebhookSignature(payload, signature)
    ) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = payload;

    if (event === 'charge.success') {
      const orderId = data.metadata?.order_id;
      if (orderId) {
        const order = await Order.findByPk(orderId);
        if (order) {
          order.payment_status = 'completed';
          order.payment_reference = data.reference;
          order.status = 'processing';
          await order.save();
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/receipt/:order_id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.order_id, user_id: req.user.id },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({
      receipt: {
        order_number: order.order_number,
        date: order.created_at,
        total: order.total_amount,
        payment_status: order.payment_status,
        payment_reference: order.payment_reference,
        business: 'Luxe Beauty & Essentials',
        vat_note: 'Prices include 15% VAT where applicable',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
