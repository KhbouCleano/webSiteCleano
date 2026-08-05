'use strict';

require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const compression = require('compression');
const os          = require('os');

const sequelize              = require('./config/database');
const { defineAssociations } = require('./models/associations');
defineAssociations();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.1.155:5173',
    'http://192.168.1.158:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));        // ← 50mb pour les images base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ══════════════════════════════════════════════════════════════
// 🔍 DIAGNOSTIC RÉSEAU TEMPORAIRE
// Log CHAQUE requête reçue avec l'IP/port du serveur qui répond.
// Sert à savoir si CE processus est bien celui qui reçoit les
// appels du front, ou si un autre serveur/process répond à sa place.
// ⚠️ À retirer une fois le problème d'IP/serveur résolu.
// ══════════════════════════════════════════════════════════════
app.use((req, res, next) => {
  console.log(`📥 [PID ${process.pid}] ${req.method} ${req.originalUrl}  ←  from ${req.ip}`);
  next();
});

// GET /api/whoami — ouvre cette URL depuis chaque IP candidate
// (http://192.168.1.155:3000/api/whoami puis .158) pour voir
// quel processus répond réellement derrière chaque adresse.
app.get('/api/whoami', (req, res) => {
  const nets = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) addresses.push({ interface: name, address: net.address });
    }
  }
  res.json({
    pid: process.pid,
    port: PORT,
    hostname: os.hostname(),
    interfaces_reseau: addresses,
    started_at: new Date(process.uptime() * -1000 + Date.now()).toISOString(),
    uptime_secondes: Math.round(process.uptime()),
    node_env: process.env.NODE_ENV || 'non défini',
    cwd: process.cwd(),
  });
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/stock',      require('./routes/stock'));   // ← AJOUTER CETTE LIGNE
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/track',      require('./routes/track'));
app.use('/api/colis',      require('./routes/colis'));
app.use('/api/adex',       require('./routes/adex'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur.' });
});

// ── Start — authenticate() seulement, pas de sync ────────────
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Base de données connectée');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Cleano API — http://localhost:${PORT}`);
      console.log(`✅ Réseau local — http://192.168.1.155:${PORT}`);
      console.log(`🔍 Diagnostic — ouvre http://192.168.1.158:${PORT}/api/whoami et http://192.168.1.155:${PORT}/api/whoami`);
    });
  })
  .catch(err => {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  });

module.exports = app;