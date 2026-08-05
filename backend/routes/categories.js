'use strict';
// backend/routes/categories.js

const express   = require('express');
const router    = express.Router();
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await sequelize.query(
      'SELECT * FROM categories ORDER BY id ASC',
      { type: QueryTypes.SELECT }
    );
    res.json({ categories, total: categories.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const [result] = await sequelize.query(
      `INSERT INTO categories (label) VALUES (:label) RETURNING *`,
      { replacements: { label: req.body.label }, type: QueryTypes.INSERT }
    );
    res.status(201).json(Array.isArray(result) ? result[0] : result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;