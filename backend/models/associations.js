'use strict';
const User     = require('./User');
const Product  = require('./Product');
const Category = require('./Category');
const Order    = require('./Order');
const Cart     = require('./Cart');
const Favorite = require('./Favorite');

const defineAssociations = () => {
  Category.hasMany(Product,   { foreignKey: 'category_id', as: 'products' });
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

  User.hasMany(Order,   { foreignKey: 'user_id', as: 'orders' });
  Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasMany(Cart,      { foreignKey: 'user_id',    as: 'cartItems' });
  Cart.belongsTo(User,    { foreignKey: 'user_id',    as: 'user' });
  Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  User.belongsToMany(Product, { through: Favorite, foreignKey: 'user_id',    as: 'favorites' });
  Product.belongsToMany(User, { through: Favorite, foreignKey: 'product_id', as: 'favoritedBy' });
};

module.exports = { defineAssociations, User, Product, Category, Order, Cart, Favorite };
