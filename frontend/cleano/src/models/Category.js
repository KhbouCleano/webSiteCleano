// ============================================================
// src/models/Category.js — Category entity & data
// ============================================================

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} label
 * @property {string} icon
 * @property {string} color
 */

export const CATEGORIES = [
  { id: "all",          label: "Tous",           icon: "✦",  color: "#1a1a2e" },
  { id: "cuisine",      label: "Cuisine",        icon: "🍋", color: "#f59e0b" },
  { id: "salle-de-bain",label: "Salle de bain",  icon: "🚿", color: "#06b6d4" },
  { id: "desinfection", label: "Désinfection",   icon: "🛡️", color: "#10b981" },
  { id: "vitres",       label: "Vitres",         icon: "🪟", color: "#3b82f6" },
  { id: "wc",           label: "WC",             icon: "🚽", color: "#8b5cf6" },
  { id: "sols",         label: "Sols",           icon: "🧹", color: "#f97316" },
  { id: "kits",         label: "Kits",           icon: "📦", color: "#ec4899" },
];

export const findCategoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
