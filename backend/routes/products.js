'use strict';
// backend/routes/products.js

const express   = require('express');
const router    = express.Router();
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// ── Helper : vérifie si un nom de produit existe déjà ──────────
// Comparaison insensible à la casse et aux espaces superflus,
// pour éviter "Anti-Calcaire" / "anti-calcaire " / "ANTI-CALCAIRE" en double.
async function nameAlreadyExists(name, excludeId = null) {
  const replacements = { name: name.trim() };
  let query = `SELECT id FROM products WHERE LOWER(TRIM(name)) = LOWER(:name)`;
  if (excludeId) {
    query += ` AND id != :excludeId`;
    replacements.excludeId = excludeId;
  }
  const [existing] = await sequelize.query(query, { replacements, type: QueryTypes.SELECT });
  return !!existing;
}

// ── GET /api/products ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const products = await sequelize.query(
      `SELECT p.*, c.label AS category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`,
      { type: QueryTypes.SELECT }
    );
    // badges est un tableau PostgreSQL — parser si string
    const parsed = products.map(p => ({
      ...p,
      badges: Array.isArray(p.badges) ? p.badges :
              (typeof p.badges === 'string' && p.badges.startsWith('{'))
                ? p.badges.replace(/[{}]/g, '').split(',').map(b => b.trim()).filter(Boolean)
                : [],
    }));
    res.json({ products: parsed, total: parsed.length });
  } catch (err) {
    console.error('GET /api/products:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [product] = await sequelize.query(
      `SELECT p.*, c.label AS category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    product.badges = Array.isArray(product.badges) ? product.badges :
                     (typeof product.badges === 'string' && product.badges.startsWith('{'))
                       ? product.badges.replace(/[{}]/g, '').split(',').map(b => b.trim()).filter(Boolean)
                       : [];
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/products ────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category_id, stock, image, badges } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom du produit est requis.' });
    }

    // ── Interdiction stricte des doublons de nom ─────────────
    if (await nameAlreadyExists(name)) {
      return res.status(409).json({
        error: `Un produit nommé "${name.trim()}" existe déjà. Choisissez un nom différent.`,
      });
    }

    // Convertir badges en format PostgreSQL array
    const badgesArray = Array.isArray(badges) ? badges : [];
    const badgesPg = badgesArray.length > 0
      ? `{${badgesArray.map(b => `"${b}"`).join(',')}}`
      : '{}';

    const [result] = await sequelize.query(
      `INSERT INTO products (name, description, price, category_id, stock, image, badges, created_at)
       VALUES (:name, :description, :price, :category_id, :stock, :image, :badges, NOW())
       RETURNING *`,
      {
        replacements: {
          name:        name.trim(),
          description: description || '',
          price:       parseFloat(price) || 0,
          category_id: parseInt(category_id) || null,
          stock:       parseInt(stock) || 0,
          image:       image || '',
          badges:      badgesPg,
        },
        type: QueryTypes.INSERT,
      }
    );
    const product = Array.isArray(result) ? result[0] : result;
    res.status(201).json(product);
  } catch (err) {
    console.error('POST /api/products:', err.message);
    // Si une contrainte d'unicité existe au niveau SQL (idx_products_name_unique),
    // on traduit l'erreur Postgres en message clair plutôt qu'un 500 générique.
    if (err.message?.includes('idx_products_name_unique') || err.original?.code === '23505') {
      return res.status(409).json({ error: `Un produit avec ce nom existe déjà.` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/products/:id ─────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category_id, stock, image, badges } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom du produit est requis.' });
    }

    // ── Interdiction stricte des doublons de nom (hors ce produit lui-même) ──
    if (await nameAlreadyExists(name, req.params.id)) {
      return res.status(409).json({
        error: `Un autre produit nommé "${name.trim()}" existe déjà. Choisissez un nom différent.`,
      });
    }

    const badgesArray = Array.isArray(badges) ? badges : [];
    const badgesPg = badgesArray.length > 0
      ? `{${badgesArray.map(b => `"${b}"`).join(',')}}`
      : '{}';

    await sequelize.query(
      `UPDATE products
       SET name        = :name,
           description = :description,
           price       = :price,
           category_id = :category_id,
           stock       = :stock,
           image       = :image,
           badges      = :badges
       WHERE id = :id`,
      {
        replacements: {
          id:          req.params.id,
          name:        name.trim(),
          description: description || '',
          price:       parseFloat(price) || 0,
          category_id: parseInt(category_id) || null,
          stock:       parseInt(stock) || 0,
          image:       image || '',
          badges:      badgesPg,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updated] = await sequelize.query(
      'SELECT * FROM products WHERE id = :id',
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/products:', err.message);
    if (err.message?.includes('idx_products_name_unique') || err.original?.code === '23505') {
      return res.status(409).json({ error: `Un produit avec ce nom existe déjà.` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/products/:id ──────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await sequelize.query(
      'DELETE FROM products WHERE id = :id',
      { replacements: { id: req.params.id }, type: QueryTypes.DELETE }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;