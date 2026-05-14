// models/Coupon.js
const db = require('../config/db');

const Coupon = {
  async findByCode(code) {
    const { rows } = await db.query(
      `SELECT * FROM coupons
       WHERE code = $1
         AND is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
         AND (max_uses IS NULL OR uses_count < max_uses)`,
      [code]
    );
    return rows[0] || null;
  },

  async incrementUses(id) {
    await db.query('UPDATE coupons SET uses_count = uses_count + 1 WHERE id = $1', [id]);
  },

  calculateDiscount(coupon, subtotal) {
    if (!coupon) return 0;
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) return 0;
    return coupon.type === 'percent'
      ? parseFloat((subtotal * coupon.value / 100).toFixed(3))
      : parseFloat(coupon.value);
  },
};

module.exports = Coupon;
