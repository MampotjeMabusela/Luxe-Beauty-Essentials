const sequelize = require('../config/database');
const User = require('./User');
const Address = require('./Address');
const Product = require('./Product');
const ProductReview = require('./ProductReview');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Coupon = require('./Coupon');

User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Product.hasMany(ProductReview, { foreignKey: 'product_id', as: 'reviews' });
ProductReview.belongsTo(Product, { foreignKey: 'product_id' });
ProductReview.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Order.belongsTo(Address, { foreignKey: 'shipping_address_id', as: 'shippingAddress' });

module.exports = {
  sequelize,
  User,
  Address,
  Product,
  ProductReview,
  Order,
  OrderItem,
  Coupon,
};
