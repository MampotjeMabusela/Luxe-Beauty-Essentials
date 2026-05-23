const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'return_requested'
      ),
      defaultValue: 'pending',
    },
    total_amount: DataTypes.DECIMAL(12, 2),
    shipping_amount: DataTypes.DECIMAL(10, 2),
    tax_amount: DataTypes.DECIMAL(10, 2),
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    coupon_code: DataTypes.STRING,
    shipping_address_id: DataTypes.INTEGER,
    shipping_city: DataTypes.STRING,
    shipping_zone: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    payment_reference: DataTypes.STRING,
    tracking_number: DataTypes.STRING,
    notes: DataTypes.TEXT,
  },
  {
    timestamps: true,
    underscored: true,
  }
);

module.exports = Order;
