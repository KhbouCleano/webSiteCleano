'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cart = sequelize.define('Cart', {
  id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:    { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  quantity:   { type: DataTypes.INTEGER, defaultValue: 1 },
}, { tableName: 'cart_items', timestamps: false });
module.exports = Cart;
