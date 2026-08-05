'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = sequelize.define('Category', {
  id:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  slug:  { type: DataTypes.STRING(50), unique: true },
  label: { type: DataTypes.STRING(100) },
  sub:   { type: DataTypes.STRING(200) },
}, { tableName: 'categories', timestamps: false });
module.exports = Category;
