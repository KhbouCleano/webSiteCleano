// ============================================================
// src/controllers/useFavoritesController.js
// ============================================================

import { useMemo } from "react";
import useAppStore from "../store/useAppStore";
import { PRODUCTS } from "../models/Product";

export const useFavoritesController = () => {
  const favorites       = useAppStore((s) => s.favorites);
  const toggleFavorite  = useAppStore((s) => s.toggleFavorite);
  const addToast        = useAppStore((s) => s.addToast);

  // Dériver isFavorite localement (pas depuis le store) pour éviter l'infinite loop
  const isFavorite = (productId) => favorites.includes(productId);

  const favoriteProducts = useMemo(
    () => PRODUCTS.filter((p) => favorites.includes(p.id)),
    [favorites]
  );

  const handleToggle = (product) => {
    const wasAdded = !favorites.includes(product.id);
    toggleFavorite(product.id);
    addToast(
      wasAdded
        ? `${product.name} ajouté aux favoris ❤️`
        : `${product.name} retiré des favoris`,
      wasAdded ? "success" : "info"
    );
  };

  return {
    favorites,
    favoriteProducts,
    isFavorite,
    handleToggle,
  };
};
