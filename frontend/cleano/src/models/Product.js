// ============================================================
// src/models/Product.js — Product entity & data
// ============================================================

/**
 * @typedef {Object} Product
 * @property {number}   id
 * @property {string}   name
 * @property {string}   category
 * @property {number}   price
 * @property {number}   originalPrice
 * @property {number}   rating
 * @property {number}   reviews
 * @property {string}   image
 * @property {string[]} badges
 * @property {string}   description
 * @property {string[]} features
 * @property {boolean}  inStock
 */

export const PRODUCTS = [
  {
    id: 1,
    name: "Dégraissant Multi-Surfaces Pro",
    category: "cuisine",
    price: 12.99,
    originalPrice: 16.99,
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    badges: ["Bestseller", "-24%"],
    description: "Un dégraissant professionnel ultra-puissant pour toutes vos surfaces de cuisine. Formule concentrée qui élimine les graisses les plus tenaces en quelques secondes.",
    features: ["Sans rinçage", "Certifié écologique", "Concentré x10", "Parfum citron"],
    inStock: true,
  },
  {
    id: 2,
    name: "Nettoyant Salle de Bain Éclat",
    category: "salle-de-bain",
    price: 9.49,
    originalPrice: 9.49,
    rating: 4.6,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop",
    badges: ["Nouveau"],
    description: "Formule anti-calcaire et anti-moisissures pour une salle de bain étincelante. Action rapide en moins de 5 minutes.",
    features: ["Anti-calcaire", "Anti-moisissures", "Parfum frais", "Sans javel"],
    inStock: true,
  },
  {
    id: 3,
    name: "Lingettes Désinfectantes Premium",
    category: "desinfection",
    price: 7.99,
    originalPrice: 10.49,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop",
    badges: ["Top Vente", "-24%"],
    description: "Lingettes désinfectantes au pouvoir bactéricide prouvé. Élimine 99,9% des bactéries et virus en un seul geste.",
    features: ["99,9% bactéries", "Virucide", "Aloe vera", "100 lingettes"],
    inStock: true,
  },
  {
    id: 4,
    name: "Nettoyant Vitres Sans Traces",
    category: "vitres",
    price: 6.99,
    originalPrice: 6.99,
    rating: 4.5,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    badges: [],
    description: "Spray nettoyant spécial vitres pour un résultat impeccable sans traces ni auréoles. Parfait pour vitres, miroirs et surfaces vitrées.",
    features: ["Sans traces", "Séchage rapide", "Anti-buée", "Parfum menthe"],
    inStock: true,
  },
  {
    id: 5,
    name: "Détartrant WC Ultra-Puissant",
    category: "wc",
    price: 5.49,
    originalPrice: 7.99,
    rating: 4.7,
    reviews: 441,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    badges: ["-31%"],
    description: "Gel détartrant à action prolongée pour des toilettes propres et désinfectées. Formule acide qui détruit le calcaire et élimine les mauvaises odeurs.",
    features: ["Action gel", "Anti-odeurs", "Détartrant puissant", "Longue durée"],
    inStock: true,
  },
  {
    id: 6,
    name: "Spray Sol Parquet & Carrelage",
    category: "sols",
    price: 11.29,
    originalPrice: 11.29,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    badges: ["Éco"],
    description: "Nettoyant sols 2-en-1 pour parquet et carrelage. Nettoie et protège en un seul passage, laisse un voile protecteur anti-rayures.",
    features: ["Parquet & Carrelage", "Anti-rayures", "Voile protecteur", "Parfum lavande"],
    inStock: true,
  },
  {
    id: 7,
    name: "Kit Nettoyage Complet Maison",
    category: "kits",
    price: 34.99,
    originalPrice: 52.00,
    rating: 4.9,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    badges: ["Kit", "-33%"],
    description: "Le kit complet pour nettoyer toute votre maison. 8 produits sélectionnés par nos experts pour couvrir toutes vos surfaces.",
    features: ["8 produits inclus", "Tous types de surfaces", "Économique", "Livraison offerte"],
    inStock: true,
  },
  {
    id: 8,
    name: "Nettoyant Four & Micro-ondes",
    category: "cuisine",
    price: 8.79,
    originalPrice: 8.79,
    rating: 4.3,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    badges: [],
    description: "Mousse nettoyante puissante pour four, micro-ondes et plaques de cuisson. Dissout les graisses carbonisées sans effort.",
    features: ["Mousse active", "Sans frottage", "Graisses carbonisées", "Parfum neutre"],
    inStock: false,
  },
];

/**
 * Lightweight factory helpers
 */
export const findProductById = (id) =>
  PRODUCTS.find((p) => p.id === Number(id)) ?? null;

export const getProductsByCategory = (category) =>
  category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

export const searchProducts = (query) => {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};
