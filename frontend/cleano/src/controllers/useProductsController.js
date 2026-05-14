// ============================================================
// src/controllers/useProductsController.js
// ============================================================

import { useState, useMemo } from "react";
import { PRODUCTS, getProductsByCategory, searchProducts } from "../models/Product";
import useAppStore from "../store/useAppStore";

export const useProductsController = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("default");
  const navigate = useAppStore((s) => s.navigate);

  const filtered = useMemo(() => {
    let list = searchQuery
      ? searchProducts(searchQuery)
      : getProductsByCategory(activeCategory);

    switch (sortBy) {
      case "price-asc":  return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating":     return [...list].sort((a, b) => b.rating - a.rating);
      case "reviews":    return [...list].sort((a, b) => b.reviews - a.reviews);
      default:           return list;
    }
  }, [activeCategory, searchQuery, sortBy]);

  const openDetail = (productId) => navigate("detail", productId);

  return {
    products: filtered,
    allProducts: PRODUCTS,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    openDetail,
  };
};
