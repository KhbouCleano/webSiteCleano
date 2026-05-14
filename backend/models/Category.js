// models/Category.js
const db = require('../config/db');

const Category = {
  async findAll() {
    const { rows } = await db.query(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.sort_order
    `);
    return rows;
  },

  async findBySlug(slug) {
    const { rows } = await db.query('SELECT * FROM categories WHERE slug = $1 AND is_active = TRUE', [slug]);
    return rows[0] || null;
  },

  async create({ name, slug, description, parent_id, sort_order, image_url }) {
    const { rows } = await db.query(`
      INSERT INTO categories (name, slug, description, parent_id, sort_order, image_url)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [name, slug, description || null, parent_id || null, sort_order || 0, image_url || null]);
    return rows[0];
  },
};

module.exports = Category;
