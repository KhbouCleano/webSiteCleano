'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = sequelize.define('Order', {
  id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER },
  total:   { type: DataTypes.DECIMAL(10,2) },
  status:  { type: DataTypes.STRING, defaultValue: 'pending' },
}, { tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: false });
module.exports = Order;
