// controllers/adminController.js
const db = require('../config/db');

// ── GET /api/admin/dashboard ───────────────────────────────
exports.dashboard = async (req, res) => {
  try {
    const [revenue, orderStats, lowStock, newClients, topProducts] = await Promise.all([
      db.query(`
        SELECT
          COALESCE(SUM(CASE WHEN DATE_TRUNC('day',  created_at) = CURRENT_DATE          THEN total ELSE 0 END), 0) AS today,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month',created_at) = DATE_TRUNC('month',NOW()) THEN total ELSE 0 END), 0) AS this_month
        FROM orders WHERE status = 'livree'
      `),
      db.query(`SELECT status, COUNT(*) AS count FROM orders GROUP BY status`),
      db.query(`SELECT id, sku, name, stock_quantity, min_stock_alert FROM products WHERE stock_quantity <= min_stock_alert AND is_active = TRUE ORDER BY stock_quantity ASC LIMIT 10`),
      db.query(`SELECT COUNT(*) FROM users WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`),
      db.query(`
        SELECT p.name, p.main_image, SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.id, p.name, p.main_image
        ORDER BY total_sold DESC
        LIMIT 5
      `),
    ]);

    return res.json({
      revenue:             revenue.rows[0],
      orders_by_status:    orderStats.rows,
      low_stock_products:  lowStock.rows,
      new_clients_month:   parseInt(newClients.rows[0].count),
      top_products:        topProducts.rows,
    });
  } catch (err) {
    console.error('admin.dashboard:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/admin/stock ───────────────────────────────────
exports.stock = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.id, p.sku, p.name, p.stock_quantity, p.min_stock_alert, p.is_active,
             c.name AS category_name,
             COALESCE(SUM(sd.quantity), 0) AS depot_total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stock_depot sd ON p.id = sd.product_id
      GROUP BY p.id, c.name
      ORDER BY p.stock_quantity ASC
    `);
    return res.json({ stock: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
