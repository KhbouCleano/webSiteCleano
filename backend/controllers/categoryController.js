// controllers/categoryController.js
const Category = require('../models/Category');

exports.index = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.show = async (req, res) => {
  try {
    const category = await Category.findBySlug(req.params.slug);
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable.' });
    return res.json({ category });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json({ category });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
