// controllers/productController.js
const Product  = require('../models/Product');
const Category = require('../models/Category');

// ── GET /api/products ──────────────────────────────────────
exports.index = async (req, res) => {
  try {
    const { category, search, min_price, max_price, is_new, is_featured, sort, order, page = 1, limit = 12 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await Product.findAll({
      category,
      search,
      minPrice:   min_price  !== undefined ? parseFloat(min_price)  : undefined,
      maxPrice:   max_price  !== undefined ? parseFloat(max_price)  : undefined,
      isNew:      is_new      === 'true',
      isFeatured: is_featured === 'true',
      sort,
      order,
      limit: parseInt(limit),
      offset,
    });

    return res.json({
      products: result.products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('products.index:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/products/:slug ────────────────────────────────
exports.show = async (req, res) => {
  try {
    const product = await Product.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });

    const similar = await Product.findSimilar(product.category_id, product.id);
    return res.json({ product, similar });
  } catch (err) {
    console.error('products.show:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── POST /api/products — Admin ─────────────────────────────
exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ product });
  } catch (err) {
    console.error('products.create:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/products/:id — Admin ─────────────────────────
exports.update = async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    return res.json({ product });
  } catch (err) {
    console.error('products.update:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── DELETE /api/products/:id — Admin ──────────────────────
exports.destroy = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    return res.json({ message: 'Produit désactivé.' });
  } catch (err) {
    console.error('products.destroy:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
