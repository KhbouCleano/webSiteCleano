// routes/auth.js
const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Règles de validation
const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe : 8 caractères minimum.'),
  body('first_name').trim().notEmpty().withMessage('Prénom requis.'),
  body('last_name').trim().notEmpty().withMessage('Nom requis.'),
  body('phone').optional().isMobilePhone().withMessage('Téléphone invalide.'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// ── Routes ────────────────────────────────────────────────
router.post('/register', registerRules, authController.register);
router.post('/login',    loginRules,    authController.login);
router.post('/refresh',                authController.refresh);
router.post('/logout',   authenticate, authController.logout);
router.get('/me',        authenticate, authController.me);

module.exports = router;
