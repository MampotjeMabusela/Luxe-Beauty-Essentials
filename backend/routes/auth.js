const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Address } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const passwordRules = body('password')
  .isLength({ min: 8 })
  .matches(/[A-Z]/)
  .withMessage('Password must include uppercase')
  .matches(/[0-9]/)
  .withMessage('Password must include a number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must include a special character');

function generateTokens(user) {
  const payload = { id: user.id, email: user.email, is_admin: user.is_admin };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  });
  return { accessToken, refreshToken };
}

function userResponse(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    is_admin: user.is_admin,
    email_verified: user.email_verified,
  };
}

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    passwordRules,
    body('first_name').optional().trim(),
    body('last_name').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, first_name, last_name, phone } = req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = await User.create({
        email,
        password_hash: password,
        first_name,
        last_name,
        phone,
      });

      const tokens = generateTokens(user);
      res.status(201).json({
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: userResponse(user),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.scope('withPassword').findOne({ where: { email } });
      if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const tokens = generateTokens(user);
      res.json({
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: userResponse(user),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = generateTokens(user);
    res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    try {
      const user = await User.scope('withPassword').findOne({
        where: { email: req.body.email },
      });
      if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.reset_token = resetToken;
        user.reset_token_expires = new Date(Date.now() + 3600000);
        await user.save();
        // In production: send email with reset link
        if (process.env.NODE_ENV === 'development') {
          return res.json({
            message: 'If the email exists, a reset link was sent',
            dev_reset_token: resetToken,
          });
        }
      }
      res.json({ message: 'If the email exists, a reset link was sent' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  '/reset-password',
  [body('token').notEmpty(), passwordRules],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.scope('withPassword').findOne({
        where: { reset_token: req.body.token },
      });
      if (!user || !user.reset_token_expires || user.reset_token_expires < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      user.password_hash = req.body.password;
      user.reset_token = null;
      user.reset_token_expires = null;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Address, as: 'addresses' }],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: userResponse(user), addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/addresses', authenticateToken, async (req, res) => {
  try {
    const address = await Address.create({ ...req.body, user_id: req.user.id });
    if (req.body.is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id, id: { [Op.ne]: address.id } } }
      );
    }
    res.status(201).json({ address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
