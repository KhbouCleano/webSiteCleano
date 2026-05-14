// server.js — cleano.tn
// ============================================================
// Point d'entrée principal
// Charge Sequelize, définit les associations, puis démarre
// Express avec toutes les routes.
// ============================================================
'use strict';

require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');
const path        = require('path');

// ── 1. Charger Sequelize + définir TOUTES les associations ──
const sequelize                = require('./config/database');
const { defineAssociations }   = require('./models/associations');
defineAssociations();

// ── 2. App Express ──────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ── Sécurité ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// ── Logs ────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials:    true,
  methods:        ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ── Body parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Fichiers statiques ───────────────────────────────────────
app.use('/images',  express.static(path.join(__dirname, '..', 'frontend', 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rate Limiting ────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez dans quelques minutes.' },
}));
app.use('/api/auth/login',    rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Trop de tentatives.' } }));
app.use('/api/auth/register', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Trop de tentatives.' } }));

// ── Routes API ───────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/admin',      require('./routes/admin'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected', orm: 'sequelize', version: '1.0.0' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── Frontend SPA ──────────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
// Express 5 : utiliser /{*path} au lieu de '*'
app.get('/{*path}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Route API introuvable.' });
  }
});

// ── Gestion d'erreurs globale ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── 3. Synchroniser Sequelize, puis démarrer ─────────────────
// sync({ alter: true }) met à jour les tables sans les supprimer
// En production utiliser les migrations Sequelize CLI
sequelize
  .sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║  🧹  cleano.tn API  v1.0                    ║
║  http://localhost:${PORT}                       ║
║  ORM     : Sequelize + PostgreSQL           ║
║  Env     : ${(process.env.NODE_ENV || 'development').padEnd(32)}║
╚══════════════════════════════════════════════╝
      `);
    });
  })
  .catch(err => {
    console.error('❌ Impossible de se connecter à la base de données :', err.message);
    process.exit(1);
  });

module.exports = app;