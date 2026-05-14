// controllers/orderController.js
const Order   = require('../models/Order');
const Product = require('../models/Product');
const Coupon  = require('../models/Coupon');

// ── POST /api/orders ───────────────────────────────────────
exports.create = async (req, res) => {
  const { address_id, depot_id, payment_method, items, coupon_code, notes } = req.body;

  if (!items?.length) return res.status(400).json({ error: 'Panier vide.' });
  if (!payment_method) return res.status(400).json({ error: 'Mode de paiement requis.' });

  try {
    // Vérifier le stock et calculer les prix
    const enrichedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product || !product.is_active)
        return res.status(400).json({ error: `Produit introuvable : ${item.product_id}` });
      if (product.stock_quantity < item.quantity)
        return res.status(400).json({ error: `Stock insuffisant pour "${product.name}".` });

      const isSupplier = req.user.role_name === 'fournisseur';
      const unitPrice  = isSupplier && product.price_supplier
        ? parseFloat(product.price_supplier)
        : parseFloat(product.price_promo || product.price);

      subtotal += unitPrice * item.quantity;
      enrichedItems.push({
        product_id: product.id,
        name:       product.name,
        sku:        product.sku,
        main_image: product.main_image,
        quantity:   item.quantity,
        unit_price: unitPrice,
      });
    }

    // Coupon
    let couponId       = null;
    let discountAmount = 0;
    if (coupon_code) {
      const coupon = await Coupon.findByCode(coupon_code);
      if (coupon) {
        discountAmount = Coupon.calculateDiscount(coupon, subtotal);
        couponId       = coupon.id;
        await Coupon.incrementUses(coupon.id);
      }
    }

    const shippingCost = payment_method === 'retrait' ? 0 : 7.000;
    const total        = Math.max(0, subtotal - discountAmount + shippingCost);

    const order = await Order.create({
      userId:         req.user.id,
      addressId:      address_id || null,
      depotId:        depot_id   || null,
      paymentMethod:  payment_method,
      items:          enrichedItems,
      couponId,
      subtotal,
      discountAmount,
      shippingCost,
      total,
      orderType:      req.user.role_name,
      notes,
    });

    return res.status(201).json({ order, message: 'Commande créée avec succès !' });
  } catch (err) {
    console.error('orders.create:', err);
    return res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
  }
};

// ── GET /api/orders ────────────────────────────────────────
exports.index = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const orders = await Order.findByUser(req.user.id, {
      status,
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    return res.json({ orders });
  } catch (err) {
    console.error('orders.index:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/orders/:id ────────────────────────────────────
exports.show = async (req, res) => {
  try {
    const data = await Order.findById(req.params.id, req.user.id);
    if (!data) return res.status(404).json({ error: 'Commande introuvable.' });
    return res.json(data);
  } catch (err) {
    console.error('orders.show:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── PATCH /api/orders/:id/cancel ──────────────────────────
exports.cancel = async (req, res) => {
  try {
    const data = await Order.findById(req.params.id, req.user.id);
    if (!data) return res.status(404).json({ error: 'Commande introuvable.' });
    if (data.order.status !== 'en_attente')
      return res.status(400).json({ error: 'Seules les commandes "en attente" peuvent être annulées.' });

    const updated = await Order.updateStatus(req.params.id, 'annulee');
    return res.json({ order: updated, message: 'Commande annulée.' });
  } catch (err) {
    console.error('orders.cancel:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── PATCH /api/admin/orders/:id/status — Admin ────────────
exports.updateStatus = async (req, res) => {
  const VALID = ['en_attente','validee','en_preparation','expediee','en_livraison','livree','annulee','retour_en_cours'];
  const { status } = req.body;
  if (!VALID.includes(status)) return res.status(400).json({ error: 'Statut invalide.' });
  try {
    const order = await Order.updateStatus(req.params.id, status);
    if (!order) return res.status(404).json({ error: 'Commande introuvable.' });
    return res.json({ order, message: 'Statut mis à jour.' });
  } catch (err) {
    console.error('orders.updateStatus:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ── GET /api/admin/orders — Admin ─────────────────────────
exports.adminIndex = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const orders = await Order.findAll({ status, limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit) });
    return res.json({ orders });
  } catch (err) {
    console.error('orders.adminIndex:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
