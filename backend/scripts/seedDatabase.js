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
    price_on_inquiry: true,
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
    price_on_inquiry: true,
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
    price_on_inquiry: true,
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
