// controllers/authController.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const JWT_SECRET         = process.env.JWT_SECRET         || 'cleano_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'cleano_refresh_secret';
const ACCESS_EXPIRES     = '15m';
const REFRESH_EXPIRES    = '7d';

// ── Générer les tokens ─────────────────────────────────────
const makeTokens = (userId) => ({
  accessToken:  jwt.sign({ userId }, JWT_SECRET,         { expiresIn: ACCESS_EXPIRES }),
  refreshToken: jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES }),
});

// ── POST /api/auth/register ────────────────────────────────
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password, first_name, last_name, phone, account_type } = req.body;
  try {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Cet email est déjà utilisé.' });

    const user   = await User.create({ email, password, first_name, last_name, phone, account_type });
    const tokens = makeTokens(user.id);
    await User.updateRefreshToken(user.id, tokens.refreshToken);

    return res.status(201).json({ user: User.sanitize(user), ...tokens });
  } catch (err) {
    console.error('register:', err);
    return res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
  }
};

// ── POST /api/auth/login ───────────────────────────────────
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user || !user.is_active)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const valid = await User.verifyPassword(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const tokens = makeTokens(user.id);
    await User.updateRefreshToken(user.id, tokens.refreshToken);

    return res.json({ user: User.sanitize(user), ...tokens });
  } catch (err) {
    console.error('login:', err);
    return res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
};

// ── POST /api/auth/refresh ─────────────────────────────────
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token manquant.' });
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user    = await User.findById(decoded.userId);
    if (!user || user.refresh_token !== refreshToken)
      return res.status(401).json({ error: 'Token invalide ou révoqué.' });

    const tokens = makeTokens(user.id);
    await User.updateRefreshToken(user.id, tokens.refreshToken);
    return res.json(tokens);
  } catch {
    return res.status(401).json({ error: 'Token expiré ou invalide.' });
  }
};

// ── POST /api/auth/logout ──────────────────────────────────
exports.logout = async (req, res) => {
  await User.updateRefreshToken(req.user.id, null);
  return res.json({ message: 'Déconnecté avec succès.' });
};

// ── GET /api/auth/me ───────────────────────────────────────
exports.me = (req, res) => {
  return res.json({ user: User.sanitize(req.user) });
};
