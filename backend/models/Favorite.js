'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Favorite = sequelize.define('Favorite', {
  user_id:    { type: DataTypes.INTEGER, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, primaryKey: true },
}, { tableName: 'favorites', timestamps: false });
module.exports = Favorite;
