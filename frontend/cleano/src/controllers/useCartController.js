// ============================================================
// src/controllers/useCartController.js
// ============================================================

import { useMemo } from "react";
import useAppStore from "../store/useAppStore";
import { computeCartTotals } from "../models/Cart";

export const useCartController = () => {
  const cartItems     = useAppStore((s) => s.cartItems);
  const cartOpen      = useAppStore((s) => s.cartOpen);
  const openCart      = useAppStore((s) => s.openCart);
  const closeCart     = useAppStore((s) => s.closeCart);
  const _addToCart    = useAppStore((s) => s.addToCart);
  const _removeFromCart = useAppStore((s) => s.removeFromCart);
  const _updateQty    = useAppStore((s) => s.updateQty);
  const clearCart     = useAppStore((s) => s.clearCart);
  const addToast      = useAppStore((s) => s.addToast);

  // useMemo garantit un objet stable — évite le "getSnapshot" infinite loop
  const totals = useMemo(() => computeCartTotals(cartItems), [cartItems]);

  const handleAddToCart = (product, qty = 1) => {
    _addToCart(product, qty);
    openCart();
    addToast(`${product.name} ajouté au panier 🛒`);
  };

  const handleRemove = (product) => {
    _removeFromCart(product.id);
    addToast(`${product.name} retiré du panier`, "info");
  };

  const handleQtyChange = (productId, qty) => {
    _updateQty(productId, qty);
  };

  return {
    cartItems,
    cartOpen,
    openCart,
    closeCart,
    handleAddToCart,
    handleRemove,
    handleQtyChange,
    clearCart,
    ...totals,
  };
};
