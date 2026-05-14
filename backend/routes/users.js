// routes/users.js
const express = require('express');
const router  = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Toutes les routes utilisateur nécessitent une authentification
router.use(authenticate);

// Profil
router.get('/profile',  userController.profile);
router.put('/profile',  userController.updateProfile);

// Adresses
router.get('/addresses',         userController.getAddresses);
router.post('/addresses',        userController.createAddress);
router.delete('/addresses/:id',  userController.deleteAddress);

// Favoris
router.get('/favorites',                  userController.getFavorites);
router.post('/favorites/:productId',      userController.addFavorite);
router.delete('/favorites/:productId',    userController.removeFavorite);

module.exports = router;
