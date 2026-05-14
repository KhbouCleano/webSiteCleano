// models/Order.js
const db = require('../config/db');

const Order = {
  // ── Générer numéro de commande ────────────────────────────
  generateNumber() {
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900000) + 100000;
    return `CLN-${year}-${rand}`;
  },

  // ── Créer une commande (transaction) ─────────────────────
  async create({ userId, addressId, depotId, paymentMethod, items, couponId, subtotal, discountAmount, shippingCost, total, orderType, notes }) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const orderNumber = Order.generateNumber();
      const { rows: [order] } = await client.query(`
        INSERT INTO orders (order_number, user_id, address_id, depot_id, coupon_id, subtotal, discount_amount, shipping_cost, total, payment_method, order_type, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *
      `, [orderNumber, userId, addressId, depotId || null, couponId || null, subtotal, discountAmount || 0, shippingCost || 0, total, paymentMethod, orderType || 'client', notes || null]);

      // Insérer les lignes
      for (const item of items) {
        await client.query(`
          INSERT INTO order_items (order_id, product_id, product_name, product_sku, product_image, quantity, unit_price, total_price)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `, [order.id, item.product_id, item.name, item.sku, item.main_image, item.quantity, item.unit_price, item.unit_price * item.quantity]);

        // Décrémenter stock
        await client.query('UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2', [item.quantity, item.product_id]);
      }

      // Créer un envoi vide
      await client.query('INSERT INTO shipments (order_id, status) VALUES ($1, $2)', [order.id, 'en_attente']);

      await client.query('COMMIT');
      return order;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // ── Commandes d'un utilisateur ────────────────────────────
  async findByUser(userId, { status, limit = 10, offset = 0 } = {}) {
    const conditions = ['o.user_id = $1'];
    const params = [userId];
    if (status) { params.push(status); conditions.push(`o.status = $${params.length}`); }
    params.push(limit, offset);

    const { rows } = await db.query(`
      SELECT o.*, s.tracking_number, s.carrier_name, s.status AS shipment_status,
             COUNT(oi.id) AS items_count
      FROM orders o
      LEFT JOIN shipments s    ON o.id = s.order_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY o.id, s.tracking_number, s.carrier_name, s.status
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);
    return rows;
  },

  // ── Détail commande ───────────────────────────────────────
  async findById(id, userId = null) {
    const conditions = ['o.id = $1'];
    const params = [id];
    if (userId) { params.push(userId); conditions.push(`o.user_id = $${params.length}`); }

    const { rows } = await db.query(`
      SELECT o.*,
             a.address_line1, a.city, a.governorate, a.phone AS delivery_phone,
             s.tracking_number, s.carrier_name, s.carrier_url, s.status AS shipment_status,
             s.estimated_delivery, s.id AS shipment_id
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      LEFT JOIN shipments s ON o.id = s.order_id
      WHERE ${conditions.join(' AND ')}
    `, params);
    if (!rows[0]) return null;

    const { rows: items } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    const events = rows[0].shipment_id
      ? (await db.query('SELECT * FROM shipment_events WHERE shipment_id = $1 ORDER BY occurred_at ASC', [rows[0].shipment_id])).rows
      : [];

    return { order: rows[0], items, events };
  },

  // ── Mettre à jour le statut ───────────────────────────────
  async updateStatus(id, status) {
    const dateField = {
      validee: 'validated_at',
      expediee: 'shipped_at',
      livree: 'delivered_at',
      annulee: 'cancelled_at',
    }[status];

    const extra = dateField ? `, ${dateField} = NOW()` : '';
    const { rows } = await db.query(
      `UPDATE orders SET status = $1, updated_at = NOW()${extra} WHERE id = $2 RETURNING *`,
      [status, id]
    );
    // Mettre à jour le shipment
    const ship = await db.query('SELECT id FROM shipments WHERE order_id = $1', [id]);
    if (ship.rows[0]) {
      await db.query('UPDATE shipments SET status = $1, updated_at = NOW() WHERE order_id = $2', [status, id]);
      await db.query('INSERT INTO shipment_events (shipment_id, status, description) VALUES ($1,$2,$3)', [ship.rows[0].id, status, `Statut mis à jour : ${status}`]);
    }
    return rows[0];
  },

  // ── Toutes les commandes (admin) ──────────────────────────
  async findAll({ status, limit = 20, offset = 0 } = {}) {
    const conditions = ['TRUE'];
    const params = [];
    if (status) { params.push(status); conditions.push(`o.status = $${params.length}`); }
    params.push(limit, offset);

    const { rows } = await db.query(`
      SELECT o.*, u.first_name, u.last_name, u.email, u.phone AS client_phone,
             s.tracking_number, s.carrier_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN shipments s ON o.id = s.order_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);
    return rows;
  },
};

module.exports = Order;
