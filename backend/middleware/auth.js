// middleware/auth.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'cleano_secret';

// ── Authentification obligatoire ───────────────────────────
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token d\'authentification manquant.' });

  const token = header.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};

// ── Auth optionnelle (prix fournisseur, etc.) ──────────────
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  const token = header.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(userId);
    if (user) req.user = user;
  } catch {}
  next();
};

// ── Restriction par rôle ───────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié.' });
  if (!roles.includes(req.user.role_name))
    return res.status(403).json({ error: `Accès refusé. Rôles requis : ${roles.join(', ')}.` });
  next();
};

module.exports = { authenticate, optionalAuth, requireRole };