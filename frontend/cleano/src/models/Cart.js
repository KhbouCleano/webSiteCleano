// ============================================================
// src/models/Cart.js — Cart entity & pure business logic
// ============================================================

/**
 * @typedef {Object} CartItem
 * @property {import('./Product').Product} product
 * @property {number} qty
 */

/** Add or increment an item in the cart */
export const addToCart = (items, product, qty = 1) => {
  const idx = items.findIndex((i) => i.product.id === product.id);
  if (idx === -1) return [...items, { product, qty }];
  return items.map((i, index) =>
    index === idx ? { ...i, qty: i.qty + qty } : i
  );
};

/** Remove an item from the cart */
export const removeFromCart = (items, productId) =>
  items.filter((i) => i.product.id !== productId);

/** Update the qty of a specific item */
export const updateQty = (items, productId, qty) => {
  if (qty <= 0) return removeFromCart(items, productId);
  return items.map((i) =>
    i.product.id === productId ? { ...i, qty } : i
  );
};

/** Compute totals */
export const computeCartTotals = (items) => {
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 35 ? 0 : 4.99;
  const total = subtotal + shipping;
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return { subtotal, shipping, total, count };
};
