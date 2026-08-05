'use strict';
// backend/routes/users.js

const express   = require('express');
const router    = express.Router();
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await sequelize.query(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json({ users, total: users.length });
  } catch (err) {
    console.error('GET /api/users:', err.message);
    // Fallback mock si la table n'existe pas encore
    res.json({
      users: [
        { id:1, name:"Administrateur", email:"admin@gmail.com", role:"admin",  created_at:"2024-01-01" },
        { id:2, name:"Ahmed Ben Ali",  email:"ahmed@gmail.com", role:"client", created_at:"2024-01-15" },
        { id:3, name:"Fatma Trabelsi", email:"fatma@gmail.com", role:"client", created_at:"2024-02-01" },
      ],
      total: 3,
    });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const [user] = await sequelize.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = :id`,
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;