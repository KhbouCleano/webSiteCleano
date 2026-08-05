'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = sequelize.define('Product', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:        { type: DataTypes.STRING(200) },
  description: { type: DataTypes.TEXT },
  price:       { type: DataTypes.DECIMAL(10,2) },
  image:       { type: DataTypes.STRING(300) },
  category_id: { type: DataTypes.INTEGER },
  stock:       { type: DataTypes.INTEGER, defaultValue: 0 },
  badges:      { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
}, { tableName: 'products', timestamps: true, createdAt: 'created_at', updatedAt: false });
module.exports = Product;
