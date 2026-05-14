// routes/orders.js
const express = require('express');
const router  = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// Toutes les routes commandes nécessitent une authentification
router.use(authenticate);

router.get('/',                orderController.index);
router.post('/',               orderController.create);
router.get('/:id',             orderController.show);
router.patch('/:id/cancel',    orderController.cancel);

module.exports = router;
