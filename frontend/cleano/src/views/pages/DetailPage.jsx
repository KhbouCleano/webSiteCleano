// ============================================================
// src/views/pages/DetailPage.jsx
// Données : API DB uniquement (même logique que ProductsPage)
// ============================================================
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> frontend
import { motion, AnimatePresence } from "framer-motion";
import { useCartController }      from "../../controllers/useCartController";
import { useFavoritesController } from "../../controllers/useFavoritesController";
import useAppStore from "../../store/useAppStore";
<<<<<<< HEAD
=======


const PRODUCTS = [
  { id: 1, name: "Anti-Calcaire",            subtitle: "Décapant surpuissant",              desc: "مزيل للجير",                    img: "/image00001.png",    color: "#1a1a1a", badge: "Noir",  category: "nettoyant", description: "Élimine efficacement le calcaire sur toutes les surfaces sanitaires, robinetterie et carrelage. Formule concentrée à action rapide.", features: ["Action rapide", "Toutes surfaces", "Sans rinçage", "Formule concentrée"] },
  { id: 2, name: "Nettoyant Vitres",          subtitle: "Anti Trace – Séchage rapide",       desc: "منظف الزجاج و الأسطح الحديثة",  img: "/image00002.png",    color: "#4fc3f7", badge: "Bleu",  category: "nettoyant", description: "Nettoie et fait briller vitres, miroirs et surfaces en verre sans laisser de traces. Séchage ultra-rapide.", features: ["Anti-traces", "Séchage rapide", "Brillance longue durée", "Surfaces lisses"] },
  { id: 3, name: "Super Dégraissant Cuisine", subtitle: "Four · Friteuse · Hotte",           desc: "مزيل الدهون القوي للمطبخ",      img: "/image00003.png",    color: "#f9a825", badge: "Jaune", category: "cuisine",   description: "Dégraissant puissant pour four, friteuse et hotte. Dissout les graisses cuites les plus tenaces en quelques minutes.", features: ["Graisses cuites", "Four & hotte", "Sans frotter", "Action 5 min"] },
  { id: 4, name: "Spécial Tissu",             subtitle: "Dégraissant Ultra-Actif",           desc: "خاص بالأقمشة",                  img: "/image00004.png",    color: "#bdbdbd", badge: "Blanc", category: "tissu",     description: "Traitement spécial pour éliminer taches de graisse et salissures sur tissus, moquettes et textiles délicats.", features: ["Tissus délicats", "Anti-tache", "Sans décoloration", "Séchage rapide"] },
  { id: 5, name: "Multi-Usage Sanitaire",     subtitle: "Nettoyant · Désinfectant · Parfumé",desc: "متعدد الاستخدامات للحمام",      img: "/image00005.png",    color: "#8bc34a", badge: "Vert",  category: "sanitaire", description: "Nettoie, désinfecte et parfume toilettes, lavabos et carrelage. Élimine 99,9% des bactéries et laisse une odeur fraîche.", features: ["Désinfectant 99,9%", "Parfumé longue durée", "Toilettes & lavabos", "Multi-surfaces"] },
  { id: 6, name: "Super Anti-Tache",          subtitle: "Nettoyant Toutes Surfaces",         desc: "مضاد للبقع فائق الفعالية",      img: "/product-vitres.png",color: "#E7398B", badge: "Rose",  category: "nettoyant", description: "Solution universelle anti-tache pour toutes les surfaces de la maison. Agit sur les taches les plus résistantes sans abîmer.", features: ["Toutes surfaces", "Taches résistantes", "Formule douce", "Usage quotidien"] },
];

const findProductById = (id) => PRODUCTS.find((p) => p.id === Number(id));

const C = {
  navy:     "#272F67",
  magenta:  "#E7398B",
  rose:     "#EE81B1",
  roseLight:"#F6CFE2",
  lavender: "#DDDEE8",
  offwhite: "#FAFAFD",
};

const IconHeart = ({ filled, color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconCart = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Stars = ({ rating = 0, size = 14 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={i <= Math.round(rating) ? "#f9a825" : "#e0e0e0"}
          stroke={i <= Math.round(rating) ? "#f9a825" : "#e0e0e0"}
          strokeWidth="1"/>
      </svg>
    ))}
  </div>
);

const RelatedCard = ({ product, onNavigate }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    onClick={() => onNavigate && onNavigate(product.id)}
    style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderRadius: 16, overflow: "hidden",
      boxShadow: `0 6px 24px ${product.color || C.magenta}18, 0 2px 6px rgba(0,0,0,0.07)`,
      border: "1.5px solid rgba(255,255,255,0.7)", cursor: "pointer",
    }}
  >
    <div style={{
      height: 140,
      background: `linear-gradient(135deg, ${product.color || C.rose}18 0%, ${product.color || C.rose}08 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img src={product.img} alt={product.name}
        style={{ height: "85%", width: "auto", objectFit: "contain",
                 filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }} />
    </div>
    <div style={{ padding: "12px 14px" }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: product.color || C.magenta,
                  fontFamily: "'Rubik', sans-serif", margin: 0, marginBottom: 3,
                  textTransform: "uppercase", letterSpacing: ".04em" }}>
        {product.subtitle}
      </p>
      <h4 style={{ fontSize: 13, fontWeight: 800, color: C.navy,
                   fontFamily: "'Raleway', sans-serif", margin: 0 }}>
        {product.name}
      </h4>
    </div>
  </motion.div>
);

const DETAIL_CSS = `
  @media (max-width: 640px) {
    .detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
    .detail-features { grid-template-columns: 1fr 1fr !important; }
    .detail-actions { flex-wrap: wrap !important; }
    .detail-related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
    .detail-section {
      margin-top: calc(-1 * var(--header-h, 72px)) !important;
      padding-top: var(--header-h, 72px) !important;
      background-size: cover !important;
      background-attachment: scroll !important;
      min-height: 100dvh !important;
    }
    .deco-left  { display: none !important; }
    .deco-right { display: none !important; }
    .detail-price { font-size: 28px !important; }
    .detail-title { font-size: 24px !important; }
    .qty-btn { width: 36px !important; height: 40px !important; }

    /* ── Décos coin bas-droite masquées sur mobile ── */
    .deco-corner { display: none !important; }
  }
  @media (max-width: 375px) {
    .detail-related-grid { grid-template-columns: 1fr !important; }
    .detail-features { grid-template-columns: 1fr !important; }
  }
`;

let _detailInjected = false;
const injectDetailCSS = () => {
  if (_detailInjected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = DETAIL_CSS;
  document.head.appendChild(s);
  _detailInjected = true;
};
>>>>>>> frontend

const C = {
  navy:      "#272F67",
  magenta:   "#E7398B",
  rose:      "#EE81B1",
  roseLight: "#F6CFE2",
  lavender:  "#DDDEE8",
  offwhite:  "#FAFAFD",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── Même table de styles que ProductsPage ────────────────────
const PRODUCT_STYLE_MAP = {
  "anti-calcaire":             { color:"#1a1a1a", badge:"Noir"  },
  "nettoyant vitres":          { color:"#4fc3f7", badge:"Bleu"  },
  "super dégraissant":         { color:"#f9a825", badge:"Jaune" },
  "super dégraissant cuisine": { color:"#f9a825", badge:"Jaune" },
  "spécial tissu":             { color:"#bdbdbd", badge:"Blanc" },
  "special tissu":             { color:"#bdbdbd", badge:"Blanc" },
  "multi-usage sanitaire":     { color:"#8bc34a", badge:"Vert"  },
  "super anti-tache":          { color:"#E7398B", badge:"Rose"  },
  "nettoyant concentré tous sols fruité": { color:"#F97316", badge:"Orange" },
  "nettoyant concentre tous sols fruite": { color:"#F97316", badge:"Orange" },
};

const resolveStyle = (name, idx = 0) => {
  const key = name?.toLowerCase().trim() ?? "";
  if (PRODUCT_STYLE_MAP[key]) return PRODUCT_STYLE_MAP[key];
  for (const [k, v] of Object.entries(PRODUCT_STYLE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  const FALLBACK_COLORS = ["#6366F1","#10B981","#F59E0B","#3B82F6","#8B5CF6","#F97316","#EC4899","#14B8A6"];
  const FALLBACK_BADGES = ["Violet","Vert","Orange","Bleu","Mauve","Orange","Rose","Cyan"];
  return { color: FALLBACK_COLORS[idx % FALLBACK_COLORS.length], badge: FALLBACK_BADGES[idx % FALLBACK_BADGES.length] };
};

// Extrait la partie arabe courte
const extractArabic = (text) => {
  if (!text) return "";
  const match = text.match(/[\u0600-\u06FF][^.،\n]*/);
  return match ? match[0].trim().replace(/[.،\s]+$/, "") : "";
};

// Extrait le sous-titre FR
const extractSubtitle = (text, fallback) => {
  if (!text) return fallback;
  const noAr = text.replace(/[\u0600-\u06FF].*/, "").trim();
  return noAr.split(".")[0]?.trim() || fallback;
};

// Mapper produit DB → format complet pour DetailPage
const mapDbProduct = (p, idx) => {
  const { color, badge } = resolveStyle(p.name, idx);
  // La description DB mélangée : on prend tout ce qui est FR pour "description" longue
  const fullDesc = (p.description ?? "").replace(/[\u0600-\u06FF][^.]*\./g, "").trim();

  return {
    id:          p.id,
    name:        p.name,
    subtitle:    extractSubtitle(p.description, p.name),
    desc:        extractArabic(p.description),
    description: fullDesc || p.description || "",
    img:         p.image || `/image0000${(idx % 5) + 1}.png`,
    color,
    badge,
    price:       parseFloat(p.price) || 0,
    stock:       p.stock ?? null,
    // Pas de colonnes "features"/"rating"/"reviews" en DB pour l'instant :
    // on utilise les badges comme liste de points forts par défaut.
    features:    Array.isArray(p.badges) ? p.badges : (p.features ?? []),
    rating:      p.rating ?? null,
    reviews:     p.reviews ?? 0,
    category:    p.category_name ?? p.category ?? "",
  };
};

// ── Icônes ───────────────────────────────────────────────────
const IconHeart = ({ filled, color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconCart = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Stars = ({ rating = 0, size = 14 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={i <= Math.round(rating) ? "#f9a825" : "#e0e0e0"}
          stroke={i <= Math.round(rating) ? "#f9a825" : "#e0e0e0"}
          strokeWidth="1"/>
      </svg>
    ))}
  </div>
);

// ── RelatedCard ───────────────────────────────────────────────
const RelatedCard = ({ product, onNavigate }) => (
  <motion.div
    whileHover={{ y:-4, scale:1.02 }} whileTap={{ scale:0.97 }}
    transition={{ type:"spring", stiffness:300, damping:22 }}
    onClick={() => onNavigate && onNavigate(product.id)}
    style={{
      background:"rgba(255,255,255,0.88)", backdropFilter:"blur(16px)",
      WebkitBackdropFilter:"blur(16px)", borderRadius:16, overflow:"hidden",
      boxShadow:`0 6px 24px ${product.color}18, 0 2px 6px rgba(0,0,0,0.07)`,
      border:"1.5px solid rgba(255,255,255,0.7)", cursor:"pointer",
    }}
  >
    <div style={{ height:140, background:`linear-gradient(135deg, ${product.color}18 0%, ${product.color}08 100%)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src={product.img} alt={product.name}
        style={{ height:"85%", width:"auto", objectFit:"contain", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
        onError={e => { e.target.src = "/product-vitres.png"; }}
      />
    </div>
    <div style={{ padding:"12px 14px" }}>
      <p style={{ fontSize:10, fontWeight:700, color:product.color, fontFamily:"'Rubik', sans-serif", margin:0, marginBottom:3, textTransform:"uppercase", letterSpacing:".04em" }}>
        {product.subtitle}
      </p>
      <h4 style={{ fontSize:13, fontWeight:800, color:C.navy, fontFamily:"'Raleway', sans-serif", margin:0 }}>
        {product.name}
      </h4>
    </div>
  </motion.div>
);

// ── CSS mobile ────────────────────────────────────────────────
const DETAIL_CSS = `
  @media (max-width: 640px) {
    .detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
    .detail-features { grid-template-columns: 1fr 1fr !important; }
    .detail-actions { flex-wrap: wrap !important; }
    .detail-related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
    .detail-section { margin-top: calc(-1 * var(--header-h, 72px)) !important; padding-top: var(--header-h, 72px) !important; background-size: cover !important; background-attachment: scroll !important; min-height: 100dvh !important; }
    .deco-left  { display: none !important; }
    .deco-right { display: none !important; }
    .detail-price { font-size: 28px !important; }
    .detail-title { font-size: 24px !important; }
    .qty-btn { width: 36px !important; height: 40px !important; }
    .deco-corner { display: none !important; }
  }
  @media (max-width: 375px) {
    .detail-related-grid { grid-template-columns: 1fr !important; }
    .detail-features { grid-template-columns: 1fr !important; }
  }
`;
let _detailInjected = false;
const injectDetailCSS = () => {
  if (_detailInjected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = DETAIL_CSS;
  document.head.appendChild(s);
  _detailInjected = true;
};

const TRUST = [
  { label:"Livraison 24-48h",  d:"M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" },
  { label:"Retours gratuits",   d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { label:"Paiement sécurisé", d:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

// ── DetailPage ────────────────────────────────────────────────
const DetailPage = () => {
  injectDetailCSS();

  const selectedProductId = useAppStore((s) => s.selectedProductId);
<<<<<<< HEAD
  const navigate           = useAppStore((s) => s.navigate);
  const addToCartSilent    = useAppStore((s) => s.addToCart);
  const { handleAddToCart }          = useCartController();
  const { isFavorite, handleToggle } = useFavoritesController();
=======
const navigate = useAppStore((s) => s.navigate);
  const product           = findProductById(selectedProductId);
  const { handleAddToCart }          = useCartController();
  const { isFavorite, handleToggle } = useFavoritesController();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

// APRÈS ✅ — ajoute au panier sans ouvrir le drawer
const addToCartSilent = useAppStore((s) => s.addToCart);

const handleBuyNow = () => {
  addToCartSilent(product, qty);
  navigate("checkout");
};
>>>>>>> frontend

  // Plus de fallback statique : les données viennent uniquement de la DB
  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  // Charger les produits depuis la DB (même logique que ProductsPage)
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        const list = data.products ?? data ?? [];
        // Filtrer uniquement les entrées de test (name vide ou "pd")
        // On n'exclut plus les images base64 : ce sont de vraies images
        // uploadées depuis l'admin (ImageField → FileReader)
        const clean = list.filter(p =>
          p.name &&
          p.name.trim().toLowerCase() !== "pd"
        );
        setAllProducts(clean.map((p, i) => mapDbProduct(p, i)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const product = allProducts.find(p => p.id === Number(selectedProductId));

  const handleAdd = () => {
    if (!product) return;
    handleAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCartSilent(product, qty);
    navigate("checkout");
  };

  // Produits similaires : même category, ou à défaut les autres produits
  const related = product
    ? allProducts
        .filter(p => p.id !== product.id && (product.category ? p.category === product.category : true))
        .slice(0, 4)
    : [];

  // ── Chargement en cours ───────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign:"center", padding:"80px 24px", background:C.offwhite, minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontSize:16, fontFamily:"'Rubik', sans-serif", color:C.navy }}>Chargement du produit…</p>
      </div>
    );
  }

  // ── Produit non trouvé ────────────────────────────────────
  if (!product) {
    return (
<<<<<<< HEAD
      <div style={{ textAlign:"center", padding:"80px 24px", background:C.offwhite, minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={C.lavender} strokeWidth="1.5" style={{ marginBottom:16 }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p style={{ fontSize:18, fontFamily:"'Rubik', sans-serif", color:C.navy, marginBottom:24 }}>Produit introuvable.</p>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={() => navigate("products")}
          style={{ background:`linear-gradient(135deg, ${C.magenta}, ${C.rose})`, color:"#fff", border:"none", borderRadius:12, padding:"12px 28px", fontSize:14, fontWeight:700, fontFamily:"'Poppins', sans-serif", cursor:"pointer" }}>
=======
      <div style={{ textAlign: "center", padding: "80px 24px", background: C.offwhite,
                    minHeight: "60vh", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center" }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
          stroke={C.lavender} strokeWidth="1.5" style={{ marginBottom: 16 }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p style={{ fontSize: 18, fontFamily: "'Rubik', sans-serif", color: C.navy, marginBottom: 24 }}>
          Produit introuvable.
        </p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("products")}
          style={{ background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
                   color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px",
                   fontSize: 14, fontWeight: 700, fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}>
>>>>>>> frontend
          Retour aux produits
        </motion.button>
      </div>
    );
  }

  const discountPct = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
<<<<<<< HEAD
=======

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
>>>>>>> frontend

  const handleAdd = () => {
    handleAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const TRUST = [
    { label: "Livraison 24-48h",  d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" },
    { label: "Retours gratuits",   d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
    { label: "Paiement sécurisé", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];

  return (
    <div className="page-enter detail-section" style={{
<<<<<<< HEAD
      minHeight:"100vh",
      marginTop:"calc(-1 * var(--header-h, 72px))",
      paddingTop:"var(--header-h, 72px)",
      background:`
=======
      minHeight: "100vh",
      marginTop: "calc(-1 * var(--header-h, 72px))",
      paddingTop: "var(--header-h, 72px)",
      background: `
>>>>>>> frontend
        radial-gradient(ellipse 80% 65% at 0%   0%,   #E7398Baa             0%, transparent 55%),
        radial-gradient(ellipse 75% 60% at 100% 0%,   ${product.color}66   0%, transparent 55%),
        radial-gradient(ellipse 75% 60% at 0%   100%, ${product.color}55   0%, transparent 55%),
        radial-gradient(ellipse 75% 60% at 100% 100%, ${product.color}88   0%, transparent 55%),
        radial-gradient(ellipse 55% 45% at 50%  50%,  rgba(255,255,255,0.88) 0%, transparent 52%),
        ${product.color}18
      `,
<<<<<<< HEAD
      position:"relative", overflow:"hidden",
    }}>

      {/* Déco gauche */}
      <motion.img className="deco-left" src="/1.png" alt=""
        initial={{ opacity:0, x:-80 }} animate={{ opacity:0.90, x:0 }}
        transition={{ delay:0.3, duration:0.8, ease:[.22,.61,.36,1] }}
        style={{ position:"absolute", left:"80%", bottom:0, width:320, height:"auto", pointerEvents:"none", zIndex:2, filter:`drop-shadow(0 12px 32px ${product.color}66)` }}
      />

      <div className="container" style={{ padding:"32px 24px 60px", position:"relative", zIndex:1 }}>

        {/* Breadcrumb */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ display:"flex", gap:8, alignItems:"center", marginBottom:28, fontSize:13, fontFamily:"'Rubik', sans-serif", flexWrap:"wrap" }}>
          {[{ label:"Accueil", page:"home" },{ label:"Produits", page:"products" }].map(crumb => (
            <span key={crumb.page} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button onClick={() => navigate(crumb.page)}
                style={{ background:"none", border:"none", cursor:"pointer", color:C.magenta, fontSize:13, fontFamily:"'Rubik', sans-serif", fontWeight:600, padding:0 }}>
                {crumb.label}
              </button>
              <span style={{ color:C.navy, opacity:0.35 }}>›</span>
            </span>
          ))}
          <span style={{ color:C.navy, opacity:0.6 }}>{product.name}</span>
        </motion.div>

        {/* Grille principale */}
        <div className="detail-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, marginBottom:60 }}>

          {/* Carte image */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.1, duration:0.6, ease:[.22,.61,.36,1] }}
            style={{ position:"relative" }}>
            <div style={{
              aspectRatio:"1", borderRadius:24, overflow:"hidden", position:"relative",
              boxShadow:`0 16px 48px ${product.color}22, 0 4px 16px rgba(0,0,0,0.10)`,
              border:"1.5px solid rgba(255,255,255,0.85)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <img src="/Logo Cleano.png" alt="" style={{ position:"absolute", inset:0, top:"18%", width:"100%", height:"60%", objectFit:"cover", opacity:0.25, mixBlendMode:"multiply", pointerEvents:"none" }} />
              <div style={{ position:"absolute", inset:0, background:`
                radial-gradient(ellipse 85% 70% at 0%   0%,   ${product.color}55 0%, transparent 58%),
                radial-gradient(ellipse 85% 70% at 100% 0%,   ${product.color}33 0%, transparent 58%),
                radial-gradient(ellipse 85% 70% at 0%   100%, ${product.color}44 0%, transparent 58%),
                radial-gradient(ellipse 85% 70% at 100% 100%, ${product.color}66 0%, transparent 58%),
                radial-gradient(ellipse 65% 55% at 50%  50%,  rgba(255,255,255,0.75) 0%, transparent 55%)
              `, pointerEvents:"none" }}/>
              <motion.img src={product.img} alt={product.name}
                initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
                transition={{ delay:0.2, duration:0.6 }}
                style={{ position:"relative", zIndex:1, width:"75%", height:"75%", objectFit:"contain", filter:"drop-shadow(0 12px 32px rgba(0,0,0,0.20))" }}
                onError={e => { e.target.src = "/product-vitres.png"; }}
              />
            </div>
            {product.badge && (
              <div style={{ position:"absolute", top:16, right:16, background:product.color, color:"#fff", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, fontFamily:"'Rubik', sans-serif", boxShadow:`0 2px 8px ${product.color}55`, zIndex:2 }}>
                {product.badge}
              </div>
            )}
            {product.color === "#f9a825" && (
              <motion.img className="deco-corner" src="/spange.png" alt=""
                initial={{ opacity:0, y:30, x:20, rotate:-15 }} animate={{ opacity:0.95, y:0, x:0, rotate:-15 }}
                transition={{ delay:0.4, duration:0.7, ease:[.22,.61,.36,1] }}
                style={{ position:"absolute", right:"-60px", bottom:"-60px", width:"200px", height:"auto", zIndex:3, pointerEvents:"none", filter:"drop-shadow(0 12px 28px rgba(249,168,37,0.45))" }}
              />
            )}
          </motion.div>

          {/* Infos */}
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.15, duration:0.6, ease:[.22,.61,.36,1] }}
            style={{ display:"flex", flexDirection:"column", gap:20 }}>

            <div>
              <p style={{ fontSize:11, fontWeight:700, color:product.color, fontFamily:"'Rubik', sans-serif", textTransform:"uppercase", letterSpacing:".06em", margin:0, marginBottom:8 }}>
                {product.subtitle}
              </p>
              <h1 className="detail-title" style={{ fontFamily:"'Raleway', system-ui, sans-serif", fontSize:32, fontWeight:900, color:C.navy, lineHeight:1.2, margin:0, marginBottom:10, letterSpacing:"-.02em" }}>
                {product.name}
              </h1>
              {product.desc && (
                <p style={{ fontSize:14, color:`${C.navy}77`, fontFamily:"'Rubik', sans-serif", margin:0, marginBottom:10, direction:"rtl" }}>
=======
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Décoration gauche ── */}
      <motion.img
        className="deco-left"
        src="/1.png"
        alt=""
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 0.90, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [.22,.61,.36,1] }}
        style={{
          position: "absolute",
          left: "80%", bottom: 0,
          width: 320, height: "auto",
          pointerEvents: "none", zIndex: 2,
          filter: `drop-shadow(0 12px 32px ${product.color}66)`,
        }}
      />

      {/* ── Décoration droite ── */}
      <motion.img
        className="deco-right"
        src="/.png"
        alt=""
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 0.88, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [.22,.61,.36,1] }}
        style={{
          position: "absolute",
          right: 0, top: 60,
          width: 400, height: "auto",
          pointerEvents: "none", zIndex: 0,
          filter: `drop-shadow(0 12px 32px ${product.color}55)`,
        }}
      />

      <div className="container" style={{ padding: "32px 24px 60px", position: "relative", zIndex: 1 }}>

        {/* ── Breadcrumb ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28,
                   fontSize: 13, fontFamily: "'Rubik', sans-serif", flexWrap: "wrap" }}>
          {[{ label: "Accueil", page: "home" }, { label: "Produits", page: "products" }].map((crumb) => (
            <span key={crumb.page} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => navigate(crumb.page)}
                style={{ background: "none", border: "none", cursor: "pointer",
                         color: C.magenta, fontSize: 13, fontFamily: "'Rubik', sans-serif",
                         fontWeight: 600, padding: 0 }}>
                {crumb.label}
              </button>
              <span style={{ color: C.navy, opacity: 0.35 }}>›</span>
            </span>
          ))}
          <span style={{ color: C.navy, opacity: 0.6 }}>{product.name}</span>
        </motion.div>

        {/* ── Grille principale ── */}
        <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }}>

          {/* ── Carte image ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [.22,.61,.36,1] }}
            style={{ position: "relative" }}>

            <div style={{
              aspectRatio: "1", borderRadius: 24, overflow: "hidden",
              position: "relative",
              boxShadow: `0 16px 48px ${product.color || C.magenta}22, 0 4px 16px rgba(0,0,0,0.10)`,
              border: "1.5px solid rgba(255,255,255,0.85)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Fond logo */}
              <img src="/Logo Cleano.png" alt=""
                style={{
                  position: "absolute", inset: 0, top: "18%",
                  width: "100%", height: "60%",
                  objectFit: "cover",
                  opacity: 0.25,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                }}
              />
              {/* Dégradé couleur */}
              <div style={{
                position: "absolute", inset: 0,
                background: `
                  radial-gradient(ellipse 85% 70% at 0%   0%,   ${product.color || C.magenta}55 0%, transparent 58%),
                  radial-gradient(ellipse 85% 70% at 100% 0%,   ${product.color || C.magenta}33 0%, transparent 58%),
                  radial-gradient(ellipse 85% 70% at 0%   100%, ${product.color || C.magenta}44 0%, transparent 58%),
                  radial-gradient(ellipse 85% 70% at 100% 100%, ${product.color || C.magenta}66 0%, transparent 58%),
                  radial-gradient(ellipse 65% 55% at 50%  50%,  rgba(255,255,255,0.75) 0%, transparent 55%)
                `,
                pointerEvents: "none",
              }}/>
              {/* Image produit */}
              <motion.img
                src={product.img} alt={product.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                  position: "relative", zIndex: 1,
                  width: "75%", height: "75%", objectFit: "contain",
                  filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.20))",
                }}
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <div style={{
                position: "absolute", top: 16, right: 16,
                background: product.color || C.magenta, color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                fontFamily: "'Rubik', sans-serif",
                boxShadow: `0 2px 8px ${product.color || C.magenta}55`, zIndex: 2,
              }}>
                {product.badge}
              </div>
            )}

            {/* ── Jaune : éponge cuisine ── */}
            {product.color === "#f9a825" && (
              <motion.img
                className="deco-corner"
                src="/spange.png"
                alt=""
                initial={{ opacity: 0, y: 30, x: 20, rotate: -15 }}
                animate={{ opacity: 0.95, y: 0, x: 0, rotate: -15 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [.22,.61,.36,1] }}
                style={{
                  position: "absolute",
                  right: "-60px",
                  bottom: "-60px",
                  width: "200px", height: "auto",
                  zIndex: 3,
                  pointerEvents: "none",
                  filter: "drop-shadow(0 12px 28px rgba(249,168,37,0.45))",
                }}
              />
            )}

          </motion.div>

          {/* ── Infos ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [.22,.61,.36,1] }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: product.color || C.magenta,
                          fontFamily: "'Rubik', sans-serif", textTransform: "uppercase",
                          letterSpacing: ".06em", margin: 0, marginBottom: 8 }}>
                {product.subtitle}
              </p>
              <h1 className="detail-title" style={{
                fontFamily: "'Raleway', system-ui, sans-serif",
                fontSize: 32, fontWeight: 900, color: C.navy,
                lineHeight: 1.2, margin: 0, marginBottom: 10, letterSpacing: "-.02em",
              }}>
                {product.name}
              </h1>
              {product.desc && (
                <p style={{ fontSize: 14, color: `${C.navy}77`, fontFamily: "'Rubik', sans-serif",
                            margin: 0, marginBottom: 10, direction: "rtl" }}>
>>>>>>> frontend
                  {product.desc}
                </p>
              )}
              {product.rating && (
<<<<<<< HEAD
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Stars rating={product.rating} size={16} />
                  <span style={{ fontSize:13, color:`${C.navy}77`, fontFamily:"'Rubik', sans-serif" }}>
                    {product.rating} ({product.reviews} avis)
=======
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Stars rating={product.rating} size={16} />
                  <span style={{ fontSize: 13, color: `${C.navy}77`, fontFamily: "'Rubik', sans-serif" }}>
                    {product.rating} ({product.reviews || 0} avis)
>>>>>>> frontend
                  </span>
                </div>
              )}
            </div>

<<<<<<< HEAD
            {product.price > 0 && (
              <div style={{ display:"flex", alignItems:"baseline", gap:14, flexWrap:"wrap" }}>
                <span className="detail-price" style={{ fontSize:36, fontWeight:900, color:C.navy, fontFamily:"'Raleway', sans-serif" }}>
                  {product.price.toFixed(2)} TND
                </span>
                {discountPct && (
                  <>
                    <span style={{ fontSize:18, color:`${C.navy}55`, textDecoration:"line-through", fontFamily:"'Rubik', sans-serif" }}>
                      {product.originalPrice.toFixed(2)} TND
                    </span>
                    <span style={{ background:"#dcfce7", color:"#16a34a", fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:20, fontFamily:"'Rubik', sans-serif" }}>
=======
            {product.price && (
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <span className="detail-price" style={{ fontSize: 36, fontWeight: 900, color: C.navy, fontFamily: "'Raleway', sans-serif" }}>
                  {product.price.toFixed(2)} €
                </span>
                {discountPct && (
                  <>
                    <span style={{ fontSize: 18, color: `${C.navy}55`, textDecoration: "line-through", fontFamily: "'Rubik', sans-serif" }}>
                      {product.originalPrice.toFixed(2)} €
                    </span>
                    <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, fontFamily: "'Rubik', sans-serif" }}>
>>>>>>> frontend
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>
            )}

            {product.description && (
<<<<<<< HEAD
              <p style={{ fontSize:15, color:`${C.navy}bb`, fontFamily:"'Rubik', system-ui, sans-serif", lineHeight:1.7, margin:0 }}>
=======
              <p style={{ fontSize: 15, color: `${C.navy}bb`, fontFamily: "'Rubik', system-ui, sans-serif", lineHeight: 1.7, margin: 0 }}>
>>>>>>> frontend
                {product.description}
              </p>
            )}

<<<<<<< HEAD
            {product.features?.length > 0 && (
              <div className="detail-features" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {product.features.map(f => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(8px)", borderRadius:10, fontSize:13, fontFamily:"'Rubik', sans-serif", color:C.navy, border:"1px solid rgba(255,255,255,0.6)" }}>
                    <span style={{ color:product.color, fontWeight:800, fontSize:15 }}>✓</span>
=======
            {product.features && (
              <div className="detail-features" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {product.features.map((f) => (
                  <div key={f} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(8px)", borderRadius: 10, fontSize: 13,
                    fontFamily: "'Rubik', sans-serif", color: C.navy,
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}>
                    <span style={{ color: product.color || C.magenta, fontWeight: 800, fontSize: 15 }}>✓</span>
>>>>>>> frontend
                    {f}
                  </div>
                ))}
              </div>
            )}

<<<<<<< HEAD
            <div style={{ height:2, borderRadius:4, background:`linear-gradient(90deg, ${product.color}, transparent)` }} />

            {/* Actions */}
            <div className="detail-actions" style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", border:`1.5px solid ${C.lavender}`, borderRadius:12, overflow:"hidden", background:"rgba(255,255,255,0.9)" }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width:42, height:46, background:"transparent", border:"none", cursor:"pointer", fontSize:22, color:C.navy, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                <span style={{ width:44, textAlign:"center", fontWeight:800, fontSize:16, fontFamily:"'Raleway', sans-serif", color:C.navy }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}
                  style={{ width:42, height:46, background:"transparent", border:"none", cursor:"pointer", fontSize:22, color:C.navy, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
              </div>

              <motion.button whileHover={{ scale:1.03, filter:"brightness(1.08)" }} whileTap={{ scale:0.96 }}
                onClick={handleAdd}
                style={{ flex:1, background:added ? "linear-gradient(135deg, #16a34a, #22c55e)" : `linear-gradient(135deg, ${product.color}, ${product.color}bb)`, color:"#fff", border:"none", borderRadius:12, padding:"13px 20px", fontSize:14, fontWeight:700, fontFamily:"'Poppins', sans-serif", cursor:"pointer", boxShadow:`0 4px 16px ${product.color}44`, transition:"background .3s ease", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" style={{ display:"flex", alignItems:"center", gap:6 }}
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}>
                      <IconCheck size={16} /> Ajouté !
                    </motion.span>
                  ) : (
                    <motion.span key="add" style={{ display:"flex", alignItems:"center", gap:6 }}
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}>
=======
            <div style={{ height: 2, borderRadius: 4, background: `linear-gradient(90deg, ${product.color || C.magenta}, transparent)` }} />

            <div className="detail-actions" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.lavender}`, borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.9)" }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 42, height: 46, background: "transparent", border: "none", cursor: "pointer", fontSize: 22, color: C.navy, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ width: 44, textAlign: "center", fontWeight: 800, fontSize: 16, fontFamily: "'Raleway', sans-serif", color: C.navy }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}
                  style={{ width: 42, height: 46, background: "transparent", border: "none", cursor: "pointer", fontSize: 22, color: C.navy, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>

              {/* Bouton Ajouter au panier existant */}
              <motion.button
                whileHover={{ scale: 1.03, filter: "brightness(1.08)" }} whileTap={{ scale: 0.96 }}
                onClick={handleAdd} disabled={product.inStock === false}
                style={{
                  flex: 1,
                  background: added
                    ? "linear-gradient(135deg, #16a34a, #22c55e)"
                    : `linear-gradient(135deg, ${product.color || C.magenta}, ${product.color || C.magenta}bb)`,
                  color: "#fff", border: "none", borderRadius: 12, padding: "13px 20px",
                  fontSize: 14, fontWeight: 700, fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                  boxShadow: `0 4px 16px ${product.color || C.magenta}44`, transition: "background .3s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: product.inStock === false ? 0.5 : 1,
                }}>
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" style={{ display: "flex", alignItems: "center", gap: 6 }}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      <IconCheck size={16} /> Ajouté !
                    </motion.span>
                  ) : (
                    <motion.span key="add" style={{ display: "flex", alignItems: "center", gap: 6 }}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
>>>>>>> frontend
                      <IconCart size={16} /> Ajouter au panier
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

<<<<<<< HEAD
              <motion.button whileHover={{ scale:1.03, filter:"brightness(1.08)" }} whileTap={{ scale:0.96 }}
                onClick={handleBuyNow}
                style={{ background:`linear-gradient(135deg, ${C.magenta}, ${C.rose})`, color:"#fff", border:"none", borderRadius:12, padding:"13px 24px", fontSize:14, fontWeight:700, fontFamily:"'Poppins', sans-serif", cursor:"pointer", boxShadow:`0 4px 16px ${C.magenta}44`, display:"flex", alignItems:"center", justifyContent:"center", gap:8, whiteSpace:"nowrap" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Acheter
              </motion.button>

              <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                onClick={() => handleToggle(product)}
                style={{ width:48, height:48, borderRadius:12, border:`1.5px solid ${isFavorite(product.id) ? C.magenta : C.lavender}`, background:isFavorite(product.id) ? `${C.magenta}12` : "rgba(255,255,255,0.9)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s ease" }}>
=======
              {/* NOUVEAU BOUTON : ACHETER DIRECTEMENT */}
             <motion.button
               whileHover={{ scale: 1.03, filter: "brightness(1.08)" }} whileTap={{ scale: 0.96 }}
               onClick={handleBuyNow}
               style={{
                 background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
                 color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px",
                 fontSize: 14, fontWeight: 700, fontFamily: "'Poppins', sans-serif", cursor: "pointer",
                 boxShadow: `0 4px 16px ${C.magenta}44`, transition: "background .3s ease",
                 display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                 whiteSpace: "nowrap",
               }}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                 <line x1="3" y1="6" x2="21" y2="6"/>
                 <path d="M16 10a4 4 0 0 1-8 0"/>
               </svg>
               Acheter
             </motion.button>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => handleToggle(product)}
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  border: `1.5px solid ${isFavorite(product.id) ? C.magenta : C.lavender}`,
                  background: isFavorite(product.id) ? `${C.magenta}12` : "rgba(255,255,255,0.9)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all .2s ease",
                }}>
>>>>>>> frontend
                <IconHeart filled={isFavorite(product.id)} color={isFavorite(product.id) ? C.magenta : C.lavender} size={20} />
              </motion.button>
            </div>

<<<<<<< HEAD
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", paddingTop:12, borderTop:`1px solid ${C.lavender}` }}>
              {TRUST.map(t => (
                <span key={t.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:`${C.navy}99`, fontFamily:"'Rubik', sans-serif", fontWeight:500 }}>
=======
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 12, borderTop: `1px solid ${C.lavender}` }}>
              {TRUST.map((t) => (
                <span key={t.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: `${C.navy}99`, fontFamily: "'Rubik', sans-serif", fontWeight: 500 }}>
>>>>>>> frontend
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.d}/>
                  </svg>
                  {t.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

<<<<<<< HEAD
        {/* Produits similaires */}
        {related.length > 0 && (
          <motion.section initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Raleway', system-ui, sans-serif", fontSize:26, fontWeight:900, color:C.navy, margin:0, marginBottom:4, letterSpacing:"-.02em" }}>
                Produits similaires
              </h2>
              <div style={{ height:3, width:120, borderRadius:10, background:`linear-gradient(90deg, ${C.magenta}, ${C.rose}, transparent)` }} />
            </div>
            <div className="detail-related-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:20 }}>
              {related.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 + i * 0.07 }}>
                  <RelatedCard product={p} onNavigate={id => navigate("detail", id)} />
=======
        {/* ── Produits similaires ── */}
        {related.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Raleway', system-ui, sans-serif", fontSize: 26, fontWeight: 900, color: C.navy, margin: 0, marginBottom: 4, letterSpacing: "-.02em" }}>
                Produits similaires
              </h2>
              <div style={{ height: 3, width: 120, borderRadius: 10, background: `linear-gradient(90deg, ${C.magenta}, ${C.rose}, transparent)` }} />
            </div>
            <div className="detail-related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
              {related.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.07 }}>
                  <RelatedCard product={p} onNavigate={(id) => navigate("detail", id)} />
>>>>>>> frontend
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

<<<<<<< HEAD
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          style={{ marginTop:40, textAlign:"center" }}>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => navigate("products")}
            style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", color:C.navy, border:`1.5px solid ${C.lavender}`, borderRadius:12, padding:"12px 28px", fontSize:14, fontWeight:600, fontFamily:"'Poppins', sans-serif", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8 }}>
=======
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 40, textAlign: "center" }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("products")}
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", color: C.navy, border: `1.5px solid ${C.lavender}`, borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
>>>>>>> frontend
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour aux produits
          </motion.button>
        </motion.div>
<<<<<<< HEAD
=======

>>>>>>> frontend
      </div>
    </div>
  );
};

export default DetailPage;