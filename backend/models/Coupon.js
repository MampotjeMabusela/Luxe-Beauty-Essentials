const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define(
  'Coupon',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    min_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    max_uses: DataTypes.INTEGER,
    uses_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    valid_from: DataTypes.DATE,
    valid_until: DataTypes.DATE,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Coupon.prototype.calculateDiscount = function (subtotal) {
  const amount = parseFloat(subtotal);
  const min = parseFloat(this.min_purchase || 0);
  if (amount < min) {
    return { valid: false, error: `Minimum purchase of R${min} required` };
  }
  let discount =
    this.discount_type === 'percentage'
      ? (amount * parseFloat(this.discount_value)) / 100
      : parseFloat(this.discount_value);
  discount = Math.min(discount, amount);
  return { valid: true, discount: Math.round(discount * 100) / 100 };
};

module.exports = Coupon;
