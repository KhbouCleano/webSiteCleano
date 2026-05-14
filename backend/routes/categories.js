// routes/categories.js
const express = require('express');
const router  = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, requireRole } = require('../middleware/auth');

const isAdmin = [authenticate, requireRole('admin', 'sous_admin')];

router.get('/',       categoryController.index);
router.get('/:slug',  categoryController.show);
router.post('/',  ...isAdmin, categoryController.create);

module.exports = router;
