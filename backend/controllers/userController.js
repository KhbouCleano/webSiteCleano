// controllers/userController.js
const User     = require('../models/User');
const Address  = require('../models/Address');
const Favorite = require('../models/Favorite');

// ── GET /api/users/profile ─────────────────────────────────
exports.profile = (req, res) => {
  return res.json({ user: User.sanitize(req.user) });
};

// ── PUT /api/users/profile ─────────────────────────────────
exports.updateProfile = async (req, res) => {
  const { first_name, last_name, phone } = req.body;
  try {
    const user = await User.updateProfile(req.user.id, { first_name, last_name, phone });
    return res.json({ user, message: 'Profil mis à jour.' });
  } catch (err) {
    console.error('users.updateProfile:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/users/addresses ───────────────────────────────
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findByUser(req.user.id);
    return res.json({ addresses });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── POST /api/users/addresses ──────────────────────────────
exports.createAddress = async (req, res) => {
  try {
    const address = await Address.create(req.user.id, req.body);
    return res.status(201).json({ address });
  } catch (err) {
    console.error('users.createAddress:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── DELETE /api/users/addresses/:id ───────────────────────
exports.deleteAddress = async (req, res) => {
  try {
    await Address.delete(req.params.id, req.user.id);
    return res.json({ message: 'Adresse supprimée.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/users/favorites ───────────────────────────────
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findByUser(req.user.id);
    return res.json({ favorites });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── POST /api/users/favorites/:productId ──────────────────
exports.addFavorite = async (req, res) => {
  try {
    await Favorite.add(req.user.id, req.params.productId);
    return res.json({ message: 'Ajouté aux favoris.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── DELETE /api/users/favorites/:productId ────────────────
exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.remove(req.user.id, req.params.productId);
    return res.json({ message: 'Retiré des favoris.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/admin/users — Admin ──────────────────────────
exports.adminIndex = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
