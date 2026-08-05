// backend/routes/auth.js
'use strict';

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'cleano_secret';

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  SECRET,
  { expiresIn: '7d' }
);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email et mot de passe requis.' });

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    res.json({
      message: 'Connexion réussie',
      token: sign(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Mot de passe min 6 caractères.' });

    const exists = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (exists)
      return res.status(409).json({ error: 'Email déjà utilisé.' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hash,
      role:     'client',
    });

    res.status(201).json({
      message: 'Compte créé',
      token: sign(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token manquant.' });

    const payload = jwt.verify(auth.slice(7), SECRET);
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Token invalide.' });
  }
});

module.exports = router;