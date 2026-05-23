const express = require('express');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { Product, ProductReview, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

function buildWhere(query) {
  const { category, search, min_price, max_price, in_stock } = query;
  const where = { is_active: true };

  if (category) where.category = category;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (min_price || max_price) {
    where.price = {};
    if (min_price) where.price[Op.gte] = min_price;
    if (max_price) where.price[Op.lte] = max_price;
  }
  if (in_stock === 'true') {
    where.stock_quantity = { [Op.gt]: 0 };
  }

  return where;
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'created_at';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    const { count, rows } = await Product.findAndCountAll({
      where: buildWhere(req.query),
      limit,
      offset,
      order: [[sort, order]],
    });

    res.json({
      products: rows,
      total: count,
      pages: Math.ceil(count / limit),
      current_page: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  req.query.search = req.query.q || req.query.search;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Product.findAndCountAll({
      where: buildWhere(req.query),
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
    res.json({ products: rows, total: count, query: req.query.q });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { category: req.params.category, is_active: true },
      order: [['created_at', 'DESC']],
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await ProductReview.findAll({
      where: { product_id: req.params.id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  '/:id/reviews',
  authenticateToken,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('review_text').optional().trim().isLength({ max: 2000 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const review = await ProductReview.create({
        product_id: product.id,
        user_id: req.user.id,
        rating: req.body.rating,
        review_text: req.body.review_text,
        image_urls: req.body.image_urls || [],
      });

      const allReviews = await ProductReview.findAll({
        where: { product_id: product.id },
        attributes: ['rating'],
      });
      const avg =
        allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
      product.rating = Math.round(avg * 10) / 10;
      product.review_count = allReviews.length;
      await product.save();

      res.status(201).json({ review });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product || !product.is_active) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
