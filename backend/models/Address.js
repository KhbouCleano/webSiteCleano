// models/Address.js
const db = require('../config/db');

const Address = {
  async findByUser(userId) {
    const { rows } = await db.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  },

  async create(userId, data) {
    const { label, full_name, phone, address_line1, address_line2, city, governorate, postal_code, is_default } = data;
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      if (is_default) {
        await client.query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
      }
      const { rows } = await client.query(`
        INSERT INTO addresses (user_id, label, full_name, phone, address_line1, address_line2, city, governorate, postal_code, is_default)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
      `, [userId, label || 'Domicile', full_name, phone, address_line1, address_line2 || null, city, governorate || null, postal_code || null, is_default || false]);
      await client.query('COMMIT');
      return rows[0];
    } catch (e) {
      await client.query('ROLLBACK'); throw e;
    } finally {
      client.release();
    }
  },

  async delete(id, userId) {
    await db.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [id, userId]);
  },
};

module.exports = Address;
