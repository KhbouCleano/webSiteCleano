// routes/admin.js
const express = require('express');
const router  = express.Router();
const adminController   = require('../controllers/adminController');
const orderController   = require('../controllers/orderController');
const productController = require('../controllers/productController');
const userController    = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

// Middleware appliqué à toutes les routes admin
const isAdmin       = [authenticate, requireRole('admin', 'sous_admin', 'gestionnaire_stock', 'gestionnaire_commandes')];
const isSuperAdmin  = [authenticate, requireRole('admin', 'sous_admin')];

// ── Dashboard ──────────────────────────────────────────────
router.get('/dashboard', ...isAdmin, adminController.dashboard);
router.get('/stock',     ...isAdmin, adminController.stock);

// ── Commandes ──────────────────────────────────────────────
router.get('/orders',               ...isAdmin,      orderController.adminIndex);
router.patch('/orders/:id/status',  ...isAdmin,      orderController.updateStatus);

// ── Produits ───────────────────────────────────────────────
router.post('/products',     ...isSuperAdmin, productController.create);
router.put('/products/:id',  ...isSuperAdmin, productController.update);
router.delete('/products/:id',...isSuperAdmin, productController.destroy);

// ── Utilisateurs ───────────────────────────────────────────
router.get('/users', authenticate, requireRole('admin'), userController.adminIndex);

module.exports = router;
