// routes/products.js
const express = require('express');
const router  = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireRole, optionalAuth } = require('../middleware/auth');

const isAdmin = [authenticate, requireRole('admin', 'sous_admin')];

// ── Public ─────────────────────────────────────────────────
router.get('/',       optionalAuth, productController.index);
router.get('/:slug',  optionalAuth, productController.show);

// ── Admin ──────────────────────────────────────────────────
router.post('/',       ...isAdmin, productController.create);
router.put('/:id',     ...isAdmin, productController.update);
router.delete('/:id',  ...isAdmin, productController.destroy);

module.exports = router;
