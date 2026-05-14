// models/Product.js
const db = require('../config/db');

const Product = {
  // ── Liste avec filtres ────────────────────────────────────
  async findAll({ category, search, minPrice, maxPrice, isNew, isFeatured, sort = 'created_at', order = 'DESC', limit = 12, offset = 0 } = {}) {
    const conditions = ['p.is_active = TRUE'];
    const params = [];

    if (category) {
      params.push(category);
      conditions.push(`c.slug = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length} OR p.short_description ILIKE $${params.length})`);
    }
    if (minPrice !== undefined) { params.push(minPrice); conditions.push(`p.price >= $${params.length}`); }
    if (maxPrice !== undefined) { params.push(maxPrice); conditions.push(`p.price <= $${params.length}`); }
    if (isNew === true)      conditions.push('p.is_new = TRUE');
    if (isFeatured === true) conditions.push('p.is_featured = TRUE');

    const WHERE = conditions.join(' AND ');
    const ALLOWED_SORT = { price: 'p.price', name: 'p.name', created_at: 'p.created_at', stock: 'p.stock_quantity' };
    const ORDER_COL = ALLOWED_SORT[sort] || 'p.created_at';
    const ORDER_DIR = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    params.push(limit, offset);

    const { rows: products } = await db.query(`
      SELECT p.id, p.sku, p.name, p.slug, p.short_description,
             p.price, p.price_promo, p.stock_quantity,
             p.is_new, p.is_featured, p.usage_tags, p.main_image, p.images,
             c.name AS category_name, c.slug AS category_slug,
             COALESCE(AVG(r.rating), 0)::numeric(3,1) AS avg_rating,
             COUNT(DISTINCT r.id) AS review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = TRUE
      WHERE ${WHERE}
      GROUP BY p.id, c.name, c.slug
      ORDER BY ${ORDER_COL} ${ORDER_DIR}
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const { rows: countRows } = await db.query(
      `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE ${WHERE}`,
      params.slice(0, -2)
    );

    return { products, total: parseInt(countRows[0].count) };
  },

  // ── Trouver par slug ──────────────────────────────────────
  async findBySlug(slug) {
    const { rows } = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
             COALESCE(AVG(r.rating), 0)::numeric(3,1) AS avg_rating,
             COUNT(DISTINCT r.id) AS review_count,
             COALESCE(SUM(sd.quantity), 0) AS total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r    ON p.id = r.product_id AND r.is_approved = TRUE
      LEFT JOIN stock_depot sd ON p.id = sd.product_id
      WHERE p.slug = $1 AND p.is_active = TRUE
      GROUP BY p.id, c.name, c.slug
    `, [slug]);
    return rows[0] || null;
  },

  // ── Trouver par ID ────────────────────────────────────────
  async findById(id) {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0] || null;
  },

  // ── Produits similaires ───────────────────────────────────
  async findSimilar(categoryId, excludeId, limit = 4) {
    const { rows } = await db.query(`
      SELECT id, name, slug, price, price_promo, main_image, is_new, avg_rating
      FROM products
      WHERE category_id = $1 AND id != $2 AND is_active = TRUE
      ORDER BY is_featured DESC, created_at DESC
      LIMIT $3
    `, [categoryId, excludeId, limit]);
    return rows;
  },

  // ── Créer un produit ──────────────────────────────────────
  async create(data) {
    const { sku, name, slug, description, short_description, price, price_promo, price_supplier, stock_quantity, category_id, usage_tags, main_image, is_new, is_featured, meta_title, meta_description } = data;
    const { rows } = await db.query(`
      INSERT INTO products (sku, name, slug, description, short_description, price, price_promo, price_supplier, stock_quantity, category_id, usage_tags, main_image, is_new, is_featured, meta_title, meta_description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *
    `, [sku, name, slug, description, short_description, price, price_promo || null, price_supplier || null, stock_quantity || 0, category_id, usage_tags || [], main_image || null, is_new || false, is_featured || false, meta_title || null, meta_description || null]);
    return rows[0];
  },

  // ── Mettre à jour ─────────────────────────────────────────
  async update(id, data) {
    const allowed = ['name', 'description', 'short_description', 'price', 'price_promo', 'price_supplier', 'stock_quantity', 'category_id', 'usage_tags', 'main_image', 'is_new', 'is_featured', 'is_active', 'meta_title', 'meta_description'];
    const sets = []; const vals = [];
    for (const key of allowed) {
      if (data[key] !== undefined) { vals.push(data[key]); sets.push(`${key} = $${vals.length}`); }
    }
    if (!sets.length) return null;
    vals.push(id);
    const { rows } = await db.query(`UPDATE products SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${vals.length} RETURNING *`, vals);
    return rows[0];
  },

  // ── Supprimer (soft delete) ───────────────────────────────
  async delete(id) {
    await db.query("UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = $1", [id]);
  },

  // ── Décrementer stock ─────────────────────────────────────
  async decrementStock(id, qty, client = db) {
    await client.query('UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2', [qty, id]);
  },
};

module.exports = Product;
