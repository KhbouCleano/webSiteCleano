'use strict';
const jwt = require('jsonwebtoken');
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'cleano_secret');
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Acces admin requis' });
  next();
};
module.exports = { protect, adminOnly };
