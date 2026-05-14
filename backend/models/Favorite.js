// models/Favorite.js
const db = require('../config/db');

const Favorite = {
  async findByUser(userId) {
    const { rows } = await db.query(`
      SELECT p.id, p.name, p.slug, p.price, p.price_promo, p.main_image,
             p.stock_quantity, p.is_new, c.name AS category_name
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `, [userId]);
    return rows;
  },

  async add(userId, productId) {
    await db.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, productId]
    );
  },

  async remove(userId, productId) {
    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
  },

  async exists(userId, productId) {
    const { rows } = await db.query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    return rows.length > 0;
  },
};

module.exports = Favorite;
