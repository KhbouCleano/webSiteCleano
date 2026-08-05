'use strict';
// backend/routes/stock.js
//
// Gère l'historique des mouvements de stock (entrée / sortie / correction).
// Chaque appel à POST /api/stock/movement met à jour products.stock ET
// insère une ligne dans stock_movements, dans une seule transaction.

const express   = require('express');
const router    = express.Router();
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// ── GET /api/stock/historique ─────────────────────────────────
// Liste des mouvements, du plus récent au plus ancien.
// Filtres optionnels : ?productId=  &type=entree|sortie|correction  &limit=100
router.get('/historique', async (req, res) => {
  try {
    const { productId, type, limit } = req.query;

    const where = [];
    const replacements = {};

    if (productId) { where.push('m.product_id = :productId'); replacements.productId = productId; }
    if (type)      { where.push('m.type = :type');             replacements.type = type; }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const limitClause = limit ? `LIMIT :limit` : 'LIMIT 200';
    replacements.limit = parseInt(limit) || 200;

    const movements = await sequelize.query(
      `SELECT m.id, m.product_id, m.type, m.quantity, m.stock_before, m.stock_after,
              m.note, m.created_at,
              p.name AS product_name, p.image AS product_image
       FROM stock_movements m
       JOIN products p ON p.id = m.product_id
       ${whereClause}
       ORDER BY m.created_at DESC
       ${limitClause}`,
      { replacements, type: QueryTypes.SELECT }
    );

    res.json({ movements, total: movements.length });
  } catch (err) {
    console.error('GET /api/stock/historique:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/stock/historique/:productId ──────────────────────
// Historique pour un seul produit.
router.get('/historique/:productId', async (req, res) => {
  try {
    const movements = await sequelize.query(
      `SELECT m.id, m.product_id, m.type, m.quantity, m.stock_before, m.stock_after,
              m.note, m.created_at
       FROM stock_movements m
       WHERE m.product_id = :productId
       ORDER BY m.created_at DESC`,
      { replacements: { productId: req.params.productId }, type: QueryTypes.SELECT }
    );
    res.json({ movements, total: movements.length });
  } catch (err) {
    console.error('GET /api/stock/historique/:productId:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/stock/movement ──────────────────────────────────
// Body attendu : { productId, type: 'entree'|'sortie'|'correction', quantity, note? }
// - entree/sortie : quantity est un delta (>= 0), appliqué en + ou -
// - correction     : quantity est la nouvelle valeur absolue du stock
router.post('/movement', async (req, res) => {
  const { productId, type, quantity, note } = req.body;

  if (!productId || !['entree', 'sortie', 'correction'].includes(type)) {
    return res.status(400).json({ error: 'productId et type (entree|sortie|correction) sont requis.' });
  }
  const qty = parseInt(quantity);
  if (Number.isNaN(qty)) {
    return res.status(400).json({ error: 'quantity doit être un nombre.' });
  }

  const t = await sequelize.transaction();
  try {
    const [product] = await sequelize.query(
      'SELECT id, stock FROM products WHERE id = :id FOR UPDATE',
      { replacements: { id: productId }, type: QueryTypes.SELECT, transaction: t }
    );
    if (!product) {
      await t.rollback();
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const stockBefore = product.stock;
    let stockAfter;
    if (type === 'entree')      stockAfter = stockBefore + qty;
    else if (type === 'sortie') stockAfter = stockBefore - qty;
    else /* correction */       stockAfter = qty;

    if (stockAfter < 0) stockAfter = 0;

    await sequelize.query(
      'UPDATE products SET stock = :stock WHERE id = :id',
      { replacements: { stock: stockAfter, id: productId }, type: QueryTypes.UPDATE, transaction: t }
    );

    const [movement] = await sequelize.query(
      `INSERT INTO stock_movements (product_id, type, quantity, stock_before, stock_after, note, created_at)
       VALUES (:productId, :type, :quantity, :stockBefore, :stockAfter, :note, NOW())
       RETURNING *`,
      {
        replacements: {
          productId, type, quantity: qty,
          stockBefore, stockAfter,
          note: note || null,
        },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({ movement: Array.isArray(movement) ? movement[0] : movement, stock: stockAfter });
  } catch (err) {
    await t.rollback();
    // Log complet (message + stack) pour repérer facilement une erreur SQL
    // (colonne manquante, contrainte violée, connexion DB perdue, etc.)
    console.error('POST /api/stock/movement failed:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;