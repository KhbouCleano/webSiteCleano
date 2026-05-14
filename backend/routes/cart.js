// routes/cart.js
const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const Coupon  = require('../models/Coupon');
const { optionalAuth, authenticate } = require('../middleware/auth');

// ── POST /api/cart/validate ────────────────────────────────
// Valide les articles du panier (stock + prix en temps réel)
router.post('/validate', optionalAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res.status(400).json({ error: 'Panier vide.' });

    const isSupplier = req.user?.role_name === 'fournisseur';
    const validated  = [];

    for (const item of items) {
      const p = await Product.findById(item.product_id);
      if (!p || !p.is_active) continue;

      const unitPrice = isSupplier && p.price_supplier
        ? parseFloat(p.price_supplier)
        : parseFloat(p.price_promo || p.price);

      validated.push({
        product_id:   p.id,
        name:         p.name,
        sku:          p.sku,
        main_image:   p.main_image,
        price:        parseFloat(p.price),
        price_promo:  p.price_promo ? parseFloat(p.price_promo) : null,
        unit_price:   unitPrice,
        quantity:     Math.min(item.quantity, p.stock_quantity),
        available:    p.stock_quantity > 0,
        stock:        p.stock_quantity,
      });
    }

    const subtotal = validated.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    return res.json({ items: validated, subtotal: parseFloat(subtotal.toFixed(3)) });
  } catch (err) {
    console.error('cart.validate:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── POST /api/cart/coupon ──────────────────────────────────
// Valide un code promo
router.post('/coupon', authenticate, async (req, res) => {
  const { code, cart_total } = req.body;
  try {
    const coupon = await Coupon.findByCode(code);
    if (!coupon) return res.status(404).json({ error: 'Code promo invalide ou expiré.' });

    const discount = Coupon.calculateDiscount(coupon, parseFloat(cart_total));
    if (!discount && coupon.min_order_amount)
      return res.status(400).json({ error: `Montant minimum requis : ${coupon.min_order_amount} TND` });

    return res.json({
      coupon:          { id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value },
      discount_amount: discount,
    });
  } catch (err) {
    console.error('cart.coupon:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
