// ============================================================
// src/controllers/useFavoritesController.js
// ============================================================

import { useMemo } from "react";
import useAppStore from "../store/useAppStore";

// Utiliser la MÊME liste que ProductsPage
const PRODUCTS = [
  {
    id: 1,
    name: "Anti-Calcaire",
    subtitle: "Décapant surpuissant",
    desc: "مزيل للجير",
    img: "/image00001.png",
    color: "#1a1a1a",
    badge: "Noir",
    price: 13.5,
  },
  {
    id: 2,
    name: "Nettoyant Vitres",
    subtitle: "Anti Trace – Séchage rapide",
    desc: "منظف الزجاج",
    img: "/image00002.png",
    color: "#4fc3f7",
    badge: "Bleu",
    price: 13.5,
  },
  {
    id: 3,
    name: "Super Dégraissant Cuisine",
    subtitle: "Four · Friteuse · Hotte",
    desc: "مزيل الدهون القوي للمطبخ",
    img: "/image00003.png",
    color: "#f9a825",
    badge: "Jaune",
    price: 13.5,
  },
  {
    id: 4,
    name: "Spécial Tissu",
    subtitle: "Dégraissant Ultra-Actif",
    desc: "خاص بالأقمشة",
    img: "/image00004.png",
    color: "#bdbdbd",
    badge: "Blanc",
    price: 13.5,
  },
  {
    id: 5,
    name: "Multi-Usage Sanitaire",
    subtitle: "Nettoyant · Désinfectant · Parfumé",
    desc: "متعدد الاستخدامات للحمام",
    img: "/image00005.png",
    color: "#8bc34a",
    badge: "Vert",
    price: 13.5,
  },
  {
    id: 6,
    name: "Super Anti-Tache",
    subtitle: "Nettoyant Toutes Surfaces",
    desc: "مضاد للبقع فائق الفعالية",
    img: "/product-vitres.png",
    color: "#E7398B",
    badge: "Rose",
    price: 13.5,
  },
];

export const useFavoritesController = () => {
  const favorites       = useAppStore((s) => s.favorites);
  const toggleFavorite  = useAppStore((s) => s.toggleFavorite);
  const addToast        = useAppStore((s) => s.addToast);

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