// models/User.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

const User = {
  // ── Trouver par ID ───────────────────────────────────────
  async findById(id) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.is_active = TRUE`,
      [id]
    );
    return rows[0] || null;
  },

  // ── Trouver par email ────────────────────────────────────
  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );
    return rows[0] || null;
  },

  // ── Créer un utilisateur ─────────────────────────────────
  async create({ email, password, first_name, last_name, phone, account_type = 'client' }) {
    const roleRes = await db.query('SELECT id FROM roles WHERE name = $1', [account_type]);
    const roleId  = roleRes.rows[0]?.id || 1;
    const hash    = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, phone, role_id, created_at`,
      [email, hash, first_name, last_name, phone || null, roleId]
    );
    return rows[0];
  },

  // ── Vérifier le mot de passe ─────────────────────────────
  async verifyPassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  },

  // ── Mettre à jour le refresh token ──────────────────────
  async updateRefreshToken(id, token) {
    await db.query(
      'UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2',
      [token, id]
    );
  },

  // ── Mettre à jour le profil ──────────────────────────────
  async updateProfile(id, { first_name, last_name, phone }) {
    const { rows } = await db.query(
      `UPDATE users SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, first_name, last_name, phone`,
      [first_name, last_name, phone, id]
    );
    return rows[0];
  },

  // ── Liste tous les users (admin) ─────────────────────────
  async findAll({ limit = 50, offset = 0 } = {}) {
    const { rows } = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone,
              u.is_active, u.created_at, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return rows;
  },

  // ── Sanitiser (supprimer les champs sensibles) ───────────
  sanitize(user) {
    if (!user) return null;
    const { password_hash, refresh_token, ...safe } = user;
    return safe;
  },
};

module.exports = User;
