// ============================================================
// src/models/Order.js — Order entity & tracking mock data
// ============================================================

export const ORDER_STATUSES = [
  { key: "confirmed", label: "Confirmée",  icon: "✓" },
  { key: "preparing", label: "Préparation", icon: "📦" },
  { key: "shipped",   label: "Expédiée",   icon: "🚚" },
  { key: "delivered", label: "Livrée",     icon: "🏠" },
];

/**
 * Mock order lookup — in production, would call an API
 */
export const findOrderByNumber = (orderNumber) => {
  if (!orderNumber || orderNumber.trim() === "") return null;

  // Simulate a found order for demo purposes
  return {
    number: orderNumber.toUpperCase(),
    status: "shipped",
    date: "08 Avril 2025",
    estimatedDelivery: "12 Avril 2025",
    carrier: "Chronopost",
    trackingCode: "CP123456789FR",
    items: [
      { name: "Dégraissant Multi-Surfaces Pro", qty: 2, price: 12.99 },
      { name: "Lingettes Désinfectantes Premium", qty: 1, price: 7.99 },
    ],
    address: "12 Rue de la Paix, 75001 Paris",
  };
};
