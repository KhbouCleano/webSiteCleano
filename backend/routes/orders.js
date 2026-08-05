'use strict';
// backend/routes/orders.js — détecte automatiquement MySQL ou PostgreSQL

const express   = require('express');
const router    = express.Router();
const https     = require('https');
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

const ADEX_HOST = 'my.adex.tn';
const ADEX_USER = '55777400';
const ADEX_PASS = 'd813b214-8126-4fb4-a51d-52a18733de1e';
const agent     = new https.Agent({ rejectUnauthorized: false });

const DIALECT = sequelize.getDialect(); // 'mysql' | 'postgres' | ...
const isPg = DIALECT === 'postgres';

// ── Helpers SQL portables ────────────────────────────────────
const monthExpr = (col) => isPg
  ? `TO_CHAR(${col}, 'YYYY-MM')`
  : `DATE_FORMAT(${col}, '%Y-%m')`;

const yearExpr = (col) => isPg
  ? `EXTRACT(YEAR FROM ${col})`
  : `YEAR(${col})`;

const quoteIdent = (name) => isPg ? `"${name}"` : `\`${name}\``;

function adexPost(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const buf  = Buffer.from(body, 'utf8');
    const opts = {
      hostname: ADEX_HOST, path, method: 'POST', agent, timeout: 10000,
      headers: { 'Content-Type':'application/json','Accept':'application/json','Content-Length':buf.length,'User-Agent':'Mozilla/5.0' },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

// ══════════════════════════════════════════════════════════════
// GET /api/orders
// ══════════════════════════════════════════════════════════════
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 10, month, year, status, adex_status, search,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const offset   = (pageNum - 1) * limitNum;

    const conditions = [];
    const replacements = {};

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      conditions.push(`${monthExpr('o.created_at')} = :month`);
      replacements.month = month;
    }
    if (year && /^\d{4}$/.test(year) && !month) {
      conditions.push(`${yearExpr('o.created_at')} = :year`);
      replacements.year = parseInt(year);
    }
    if (status && status !== 'all') {
      conditions.push(`o.status = :status`);
      replacements.status = status;
    }
    if (adex_status && adex_status !== 'all') {
      conditions.push(`o.adex_status = :adex_status`);
      replacements.adex_status = adex_status;
    }
    if (search && search.trim()) {
      const likeOp = isPg ? 'ILIKE' : 'LIKE';
      conditions.push(`(
        COALESCE(u.name, o.adex_client_name, '') ${likeOp} :search
        OR o.tracking_adex ${likeOp} :search
      )`);
      replacements.search = `%${search.trim()}%`;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRows = await sequelize.query(
      `SELECT COUNT(*) as total
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ${whereClause}`,
      { replacements, type: QueryTypes.SELECT }
    );
    const totalRows  = parseInt(countRows[0]?.total || 0);
    const totalPages = Math.ceil(totalRows / limitNum) || 1;

    replacements.limit  = limitNum;
    replacements.offset = offset;

    const orders = await sequelize.query(
      `SELECT o.*,
              COALESCE(u.name, o.adex_client_name) AS user_name,
              u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT }
    );

    const monthsList = await sequelize.query(
      `SELECT ${monthExpr('created_at')} as month, COUNT(*) as count
       FROM orders GROUP BY ${monthExpr('created_at')} ORDER BY month DESC`,
      { type: QueryTypes.SELECT }
    );

    // ── Rattache les produits (order_items) à chaque commande ──
    // Un seul aller-retour DB pour toutes les commandes de la page,
    // plutôt qu'une requête par commande (N+1).
    const orderIds = orders.map(o => o.id);
    if (orderIds.length > 0) {
      try {
        const items = await sequelize.query(
          `SELECT order_id, product_id, product_name, quantity, unit_price
           FROM order_items WHERE order_id IN (:orderIds)
           ORDER BY id ASC`,
          { replacements: { orderIds }, type: QueryTypes.SELECT }
        );
        const itemsByOrder = {};
        for (const it of items) {
          (itemsByOrder[it.order_id] ??= []).push(it);
        }
        for (const o of orders) o.produits = itemsByOrder[o.id] ?? [];
      } catch (itemsErr) {
        // Ne fait pas planter la liste des commandes si order_items n'existe pas encore
        // (as-tu exécuté create_order_items.sql ?)
        console.error('⚠️ Lecture order_items impossible:', itemsErr.message);
        for (const o of orders) o.produits = [];
      }
    }

    res.json({
      orders,
      pagination: {
        page: pageNum, limit: limitNum, total: totalRows, totalPages,
        hasNext: pageNum < totalPages, hasPrev: pageNum > 1,
      },
      months: monthsList,
    });
  } catch (err) {
    console.error('❌ GET /api/orders:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/orders/stats ─────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const stats = await sequelize.query(
      `SELECT
         ${monthExpr('created_at')} as month,
         COUNT(*) as total,
         SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
         SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
         SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) as pending,
         SUM(total) as revenue
       FROM orders
       WHERE ${yearExpr('created_at')} = :year
       GROUP BY ${monthExpr('created_at')}
       ORDER BY month ASC`,
      { replacements: { year: parseInt(year) }, type: QueryTypes.SELECT }
    );

    res.json({ stats, year: parseInt(year) });
  } catch (err) {
    console.error('❌ GET /api/orders/stats:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/orders/clients
// ⚠️ IMPORTANT : cette route DOIT rester déclarée AVANT /:id,
// sinon Express route "/clients" vers "/:id" et tente de faire
// un CAST("clients" AS integer) → erreur SQL "invalid input syntax".
// Agrège les commandes par client (nom + tel + adresse) : nom, tel,
// adresse, date de la dernière commande, nombre total de commandes.
// ══════════════════════════════════════════════════════════════
router.get('/clients', async (req, res) => {
  try {
    const clients = await sequelize.query(
      `SELECT
         adex_client_name    AS name,
         adex_client_phone   AS phone,
         adex_client_address AS address,
         MAX(created_at)     AS last_order_date,
         COUNT(*)            AS orders_count
       FROM orders
       WHERE adex_client_name IS NOT NULL AND adex_client_name != ''
       GROUP BY adex_client_name, adex_client_phone, adex_client_address
       ORDER BY last_order_date DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json({ clients });
  } catch (err) {
    console.error('❌ GET /api/orders/clients:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// GET /api/orders/debug/check — DIAGNOSTIC TEMPORAIRE
// Ouvre juste http://<ton-serveur>:3000/api/orders/debug/check
// dans le navigateur pour voir exactement où ça bloque.
// ⚠️ À supprimer une fois le problème résolu.
// ══════════════════════════════════════════════════════════════
router.get('/debug/check', async (req, res) => {
  const report = {};

  // 1) order_items existe ?
  try {
    const [row] = await sequelize.query('SELECT COUNT(*) AS n FROM order_items', { type: QueryTypes.SELECT });
    report.order_items_table = { exists: true, rows: parseInt(row.n) };
  } catch (e) {
    report.order_items_table = { exists: false, error: e.message };
  }

  // 2) stock_movements existe ?
  try {
    const [row] = await sequelize.query('SELECT COUNT(*) AS n FROM stock_movements', { type: QueryTypes.SELECT });
    report.stock_movements_table = { exists: true, rows: parseInt(row.n) };
  } catch (e) {
    report.stock_movements_table = { exists: false, error: e.message };
  }

  // 3) 5 dernières commandes + nb produits liés
  try {
    report.dernieres_commandes = await sequelize.query(
      `SELECT o.id, o.tracking_adex, o.total, o.created_at,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS nb_produits
       FROM orders o ORDER BY o.created_at DESC LIMIT 5`,
      { type: QueryTypes.SELECT }
    );
  } catch (e) {
    report.dernieres_commandes = { error: e.message };
  }

  // 4) derniers order_items (s'il y en a)
  try {
    report.derniers_order_items = await sequelize.query(
      'SELECT * FROM order_items ORDER BY id DESC LIMIT 5',
      { type: QueryTypes.SELECT }
    );
  } catch (e) {
    report.derniers_order_items = { error: e.message };
  }

  // 5) stock actuel des produits
  try {
    report.produits = await sequelize.query(
      'SELECT id, name, stock, price FROM products ORDER BY id',
      { type: QueryTypes.SELECT }
    );
  } catch (e) {
    report.produits = { error: e.message };
  }

  res.json(report);
});

// ── GET /api/orders/:id ───────────────────────────────────────
// (doit rester APRÈS /stats et /clients)
router.get('/:id', async (req, res) => {
  try {
    const [order] = await sequelize.query(
      `SELECT o.*, u.name AS user_name, u.email AS user_email
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
       WHERE o.id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

    try {
      order.produits = await sequelize.query(
        `SELECT product_id, product_name, quantity, unit_price
         FROM order_items WHERE order_id = :id ORDER BY id ASC`,
        { replacements: { id: order.id }, type: QueryTypes.SELECT }
      );
    } catch (itemsErr) {
      console.error('⚠️ Lecture order_items impossible:', itemsErr.message);
      order.produits = [];
    }

    if (order.tracking_adex) {
      try {
        const result = await adexPost('/api/rest/StColis/getColis', {
          Utilisateur: ADEX_USER, Pass: ADEX_PASS, codeBar: order.tracking_adex,
        });
        if (result.body?.result_type === 'success') {
          return res.json({ ...order, adex_status: result.body.result_content?.etat ?? order.adex_status, adex_details: result.body.result_content });
        }
      } catch (_) {}
    }
    res.json(order);
  } catch (err) {
    console.error('❌ GET /api/orders/:id:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/orders ──────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { user_id, total, status, tracking_adex, url_bl_adex, adex_status } = req.body;
    const [result] = await sequelize.query(
      `INSERT INTO orders (user_id,total,status,tracking_adex,url_bl_adex,adex_status,adex_created_at,created_at,updated_at)
       VALUES (:user_id,:total,:status,:tracking,:url_bl,:adex_status,:adex_at,NOW(),NOW())
       ${isPg ? 'RETURNING id' : ''}`,
      {
        replacements: {
          user_id: user_id||null, total: parseFloat(total)||0, status: status||'pending',
          tracking: tracking_adex||null, url_bl: url_bl_adex||null,
          adex_status: adex_status||null, adex_at: tracking_adex?new Date().toISOString():null,
        },
        type: isPg ? QueryTypes.SELECT : QueryTypes.INSERT,
      }
    );
    res.status(201).json({ id: isPg ? result?.id : result, success: true });
  } catch (err) {
    console.error('❌ POST /api/orders:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/orders/:id ───────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const [order] = await sequelize.query(
      'SELECT * FROM orders WHERE id = :id',
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

    const { confirmed, status, tracking_adex, url_bl_adex, adex_status } = req.body;
    let adexAction = null;

    if (typeof confirmed !== 'undefined') {
      const wasConfirmed = order.confirmed === true;
      const nowConfirmed = confirmed === true || confirmed === 1;
      if (wasConfirmed && !nowConfirmed && order.tracking_adex) {
        const s = (order.adex_status ?? '').toLowerCase();
        if (s.includes('attente')) {
          try {
            const del = await adexPost('/api/rest/StColis/supprimerColis', { Utilisateur:ADEX_USER, Pass:ADEX_PASS, codeBar:order.tracking_adex });
            if (del.body?.result_type === 'success') {
              req.body.tracking_adex = null; req.body.url_bl_adex = null; req.body.adex_status = null;
              adexAction = { deleted:true, message:`Colis ADEX ${order.tracking_adex} annulé` };
            } else {
              adexAction = { deleted:false, message: del.body?.result_content ?? "Impossible d'annuler" };
            }
          } catch(e) { adexAction = { deleted:false, message:'Erreur communication ADEX' }; }
        }
      }
    }

    const allowed = ['status','confirmed','tracking_adex','url_bl_adex','adex_status','adex_created_at'];
    const toUpdate = {};
    for (const k of allowed) {
      if (typeof req.body[k] !== 'undefined') toUpdate[k] = req.body[k];
    }

    if (Object.keys(toUpdate).length > 0) {
      const sets = Object.keys(toUpdate).map(k => `${quoteIdent(k)} = :${k}`).join(', ');
      await sequelize.query(
        `UPDATE orders SET ${sets}, updated_at = NOW() WHERE id = :id`,
        { replacements: { ...toUpdate, id: req.params.id }, type: QueryTypes.UPDATE }
      );
    }

    const [updated] = await sequelize.query(
      `SELECT o.*, u.name AS user_name FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE o.id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    res.json({ ...(updated ?? {}), ...(adexAction ? { adex_action: adexAction } : {}) });
  } catch (err) {
    console.error('❌ PUT /api/orders/:id:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/orders/:id ────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const [order] = await sequelize.query('SELECT * FROM orders WHERE id = :id', { replacements:{ id:req.params.id }, type:QueryTypes.SELECT });
    if (order?.tracking_adex) {
      const s = (order.adex_status ?? '').toLowerCase();
      if (s.includes('attente')) {
        await adexPost('/api/rest/StColis/supprimerColis', { Utilisateur:ADEX_USER, Pass:ADEX_PASS, codeBar:order.tracking_adex }).catch(()=>{});
      }
    }
    await sequelize.query('DELETE FROM orders WHERE id = :id', { replacements:{ id:req.params.id }, type:QueryTypes.DELETE });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ DELETE /api/orders/:id:', err.message, '\n', err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;