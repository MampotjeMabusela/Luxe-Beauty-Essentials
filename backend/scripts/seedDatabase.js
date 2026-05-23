require('dotenv').config();
const { sequelize, User, Product, Coupon } = require('../models');

const products = [
  {
    name: 'Brazilian Virgin Hair 18"',
    description:
      'Premium unprocessed Brazilian virgin hair. Silky texture, natural movement, perfect for sew-ins and wigs.',
    category: 'hair',
    price: 1299,
    original_price: 1499,
    stock_quantity: 50,
    sku: 'HAIR-BRZ-18',
    image_urls: [
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80',
    ],
    rating: 4.8,
    review_count: 243,
  },
  {
    name: 'Peruvian Body Wave 20"',
    description: 'Luxurious Peruvian body wave bundles. Holds curls beautifully.',
    category: 'hair',
    price: 1149,
    stock_quantity: 35,
    sku: 'HAIR-PER-20',
    image_urls: [
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2d11?w=600&q=80',
    ],
    rating: 4.7,
    review_count: 189,
  },
  {
    name: 'Lace Front Wig — Straight',
    description: 'HD lace front wig, pre-plucked hairline, 150% density.',
    category: 'hair',
    price: 2499,
    stock_quantity: 15,
    sku: 'HAIR-LACE-ST',
    image_urls: [
      'https://images.unsplash.com/photo-1595476108016-b3d0f5f1f5e5?w=600&q=80',
    ],
    rating: 4.9,
    review_count: 98,
  },
  {
    name: 'Premium Acha Powder 500g',
    description: 'Organic fonio (acha) powder. Gluten-free superfood for smoothies and baking.',
    category: 'acha',
    price: 149,
    stock_quantity: 200,
    sku: 'ACHA-PWD-500',
    image_urls: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    ],
    rating: 4.9,
    review_count: 342,
  },
  {
    name: 'Acha Grain 1kg',
    description: 'Whole grain acha — cook like couscous or rice. Nutrient-rich.',
    category: 'acha',
    price: 89,
    stock_quantity: 150,
    sku: 'ACHA-GRN-1K',
    image_urls: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    ],
    rating: 4.8,
    review_count: 156,
  },
  {
    name: 'Acha Breakfast Cereal 400g',
    description: 'Ready-to-eat acha cereal with honey. Perfect morning boost.',
    category: 'acha',
    price: 69,
    stock_quantity: 8,
    sku: 'ACHA-CEL-400',
    image_urls: [
      'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&q=80',
    ],
    rating: 4.6,
    review_count: 87,
  },
  {
    name: 'Ultra Soft Toilet Paper 48 Roll',
    description: 'Premium 3-ply toilet paper. 48 rolls — best value for families.',
    category: 'toilet_paper',
    price: 299,
    original_price: 349,
    stock_quantity: 500,
    sku: 'TP-SOFT-48',
    image_urls: [
      'https://images.unsplash.com/photo-1584438784894-9fccd6d2a4e8?w=600&q=80',
    ],
    rating: 4.8,
    review_count: 512,
  },
  {
    name: 'Eco Toilet Paper 24 Roll',
    description: 'Recycled, eco-friendly 2-ply. Gentle on skin and planet.',
    category: 'toilet_paper',
    price: 179,
    stock_quantity: 300,
    sku: 'TP-ECO-24',
    image_urls: [
      'https://images.unsplash.com/photo-1600857062241-7e9c8b8c8c8c?w=600&q=80',
    ],
    rating: 4.5,
    review_count: 201,
  },
  {
    name: 'Family Pack Toilet Paper 72 Roll',
    description: 'Bulk pack for large households. Ultra absorbent 3-ply.',
    category: 'toilet_paper',
    price: 449,
    stock_quantity: 120,
    sku: 'TP-FAM-72',
    image_urls: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
    ],
    rating: 4.9,
    review_count: 278,
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    await User.create({
      email: 'admin@luxebeauty.co.za',
      password_hash: 'Admin@123!',
      first_name: 'Admin',
      last_name: 'Luxe',
      phone: '+27821234567',
      is_admin: true,
      email_verified: true,
    });

    await User.create({
      email: 'customer@example.com',
      password_hash: 'Customer@123!',
      first_name: 'Thandi',
      last_name: 'Mokoena',
      phone: '+27839876543',
      email_verified: true,
    });

    await Product.bulkCreate(products);

    await Coupon.create({
      code: 'LUXE10',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase: 200,
      max_uses: 1000,
      is_active: true,
    });

    await Coupon.create({
      code: 'FREESHIP',
      discount_type: 'fixed',
      discount_value: 79,
      min_purchase: 500,
      max_uses: 500,
      is_active: true,
    });

    console.log('Database seeded successfully!');
    console.log('Admin: admin@luxebeauty.co.za / Admin@123!');
    console.log('Customer: customer@example.com / Customer@123!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
