// ============================================================
// src/views/pages/HomePage.jsx — Responsive mobile
// ============================================================
<<<<<<< HEAD
import { useRef, useState, useEffect } from "react";
=======
import { useRef, useState } from "react";
>>>>>>> frontend
import { motion, useScroll, useTransform } from "framer-motion";
import { CATEGORIES } from "../../models/Category";
import useAppStore from "../../store/useAppStore";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000");

// Produits statiques fallback (mêmes données que ProductsPage)
const STATIC_PRODUCTS = [
  { id:1, name:"Anti-Calcaire",            subtitle:"Décapant surpuissant",               desc:"مزيل للجير",               img:"/image00001.png",    color:"#1a1a1a", badge:"Noir",  price:15 },
  { id:2, name:"Nettoyant Vitres",          subtitle:"Anti Trace – Séchage rapide",        desc:"منظف الزجاج",              img:"/image00002.png",    color:"#4fc3f7", badge:"Bleu",  price:15 },
  { id:3, name:"Super Dégraissant Cuisine", subtitle:"Four · Friteuse · Hotte",            desc:"مزيل الدهون القوي للمطبخ",img:"/image00003.png",    color:"#f9a825", badge:"Jaune", price:15 },
  { id:4, name:"Spécial Tissu",             subtitle:"Dégraissant Ultra-Actif",             desc:"خاص بالأقمشة",             img:"/image00004.png",    color:"#bdbdbd", badge:"Blanc", price:15 },
  { id:5, name:"Multi-Usage Sanitaire",     subtitle:"Nettoyant · Désinfectant · Parfumé", desc:"متعدد الاستخدامات للحمام",img:"/image00005.png",    color:"#8bc34a", badge:"Vert",  price:15 },
  { id:6, name:"Super Anti-Tache",          subtitle:"Nettoyant Toutes Surfaces",           desc:"مضاد للبقع فائق الفعالية",img:"/product-vitres.png",color:"#E7398B", badge:"Rose",  price:15 },
];

// Table de correspondance name → couleur/badge (mêmes données que ProductsPage)
const PRODUCT_STYLE_MAP = {
  "anti-calcaire":            { color:"#1a1a1a", badge:"Noir"  },
  "nettoyant vitres":         { color:"#4fc3f7", badge:"Bleu"  },
  "super dégraissant":        { color:"#f9a825", badge:"Jaune" },
  "super dégraissant cuisine":{ color:"#f9a825", badge:"Jaune" },
  "spécial tissu":            { color:"#bdbdbd", badge:"Blanc" },
  "special tissu":            { color:"#bdbdbd", badge:"Blanc" },
  "multi-usage sanitaire":    { color:"#8bc34a", badge:"Vert"  },
  "super anti-tache":         { color:"#E7398B", badge:"Rose"  },
};

const resolveStyle = (name, idx) => {
  const key = name?.toLowerCase().trim() ?? "";
  if (PRODUCT_STYLE_MAP[key]) return PRODUCT_STYLE_MAP[key];
  for (const [k, v] of Object.entries(PRODUCT_STYLE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  const FALLBACK_COLORS = ["#6366F1","#10B981","#F59E0B","#3B82F6","#8B5CF6","#F97316","#EC4899","#14B8A6"];
  const FALLBACK_BADGES = ["Violet","Vert","Orange","Bleu","Mauve","Orange","Rose","Cyan"];
  return { color: FALLBACK_COLORS[idx % FALLBACK_COLORS.length], badge: FALLBACK_BADGES[idx % FALLBACK_BADGES.length] };
};

const extractArabic = (text) => {
  if (!text) return "";
  const match = text.match(/[\u0600-\u06FF][^.،\n]*/);
  return match ? match[0].trim().replace(/[.،\s]+$/, "") : "";
};

const extractSubtitle = (text, fallback) => {
  if (!text) return fallback;
  const noAr = text.replace(/[\u0600-\u06FF].*/, "").trim();
  const parts = noAr.split(".");
  return parts[0]?.trim() || fallback;
};

const mapDbProduct = (p, idx) => {
  const { color, badge } = resolveStyle(p.name, idx);
  return {
    id:       p.id,
    name:     p.name,
    subtitle: extractSubtitle(p.description, p.name),
    desc:     extractArabic(p.description),
    img:      p.image || `/image0000${(idx % 5) + 1}.png`,
    color,
    badge,
    price:    parseFloat(p.price) || 0,
    stock:    p.stock ?? null,
  };
};

// ── Hook responsive ────────────────────────────────────────────
const useIsMobile = (bp = 640) => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return mobile;
};

// ProductShowcaseCard — design "vitrine" distinct de la page Produits :
// halo coloré derrière l'image, badge plein en couleur, barre d'accent en bas.
// `compact` : version réduite utilisée sur mobile (cartes plus petites, ~4 visibles à l'écran).
const ProductShowcaseCard = ({ product, onSelect, isFavorite, onToggleFavorite, compact }) => (
  <motion.div
    onClick={() => onSelect && onSelect(product)}
    whileHover={{ y: -8 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 280, damping: 24 }}
    style={{
      position: "relative", cursor: "pointer", borderRadius: compact ? 16 : 24, overflow: "hidden",
      flex: "0 0 auto", width: compact ? "min(42vw, 168px)" : "min(84vw, 300px)", scrollSnapAlign: "start",
      background: "#fff",
      boxShadow: `0 ${compact ? 6 : 12}px ${compact ? 16 : 30}px ${product.color}2e, 0 4px 10px rgba(39,47,103,0.10)`,
      border: `1.5px solid ${product.color}30`,
    }}
  >
    {/* Favori */}
    <motion.button
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(product); }}
      style={{
        position:"absolute", top: compact ? 8 : 12, right: compact ? 8 : 12, zIndex:10,
        background:"rgba(255,255,255,0.92)", border:"none", borderRadius:"50%",
        width: compact ? 26 : 34, height: compact ? 26 : 34,
        display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
        boxShadow:"0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <svg width={compact ? 12 : 16} height={compact ? 12 : 16} viewBox="0 0 24 24"
        fill={isFavorite ? "#E7398B" : "none"}
        stroke={isFavorite ? "#E7398B" : "#8892B0"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </motion.button>

    {/* Badge plein en couleur */}
    <div style={{
      position:"absolute", top: compact ? 8 : 14, left: compact ? 8 : 14, zIndex:10,
      background:product.color, padding: compact ? "3px 8px" : "5px 12px", borderRadius:20,
      boxShadow:`0 4px 12px ${product.color}66`,
    }}>
      <span style={{ fontSize: compact ? 8 : 10, fontWeight:700, color:"#fff", fontFamily:"'Rubik', sans-serif", letterSpacing:".04em" }}>{product.badge}</span>
    </div>

    {/* Zone image avec halo coloré */}
    <div style={{
      height: compact ? 150 : 300, position:"relative", overflow:"hidden",
      background: `radial-gradient(ellipse 80% 70% at 50% 38%, ${product.color}30 0%, ${product.color}10 45%, transparent 75%)`,
    }}>
      {product.stock === 0 && (
        <div style={{ position:"absolute", top: compact ? 32 : 52, left: compact ? 8 : 14, background:"#EF444495", color:"#fff", fontSize: compact ? 8 : 10, fontWeight:700, padding: compact ? "2px 7px" : "3px 10px", borderRadius:10, zIndex:6 }}>
          Rupture
        </div>
      )}
      <motion.img src={product.img} alt={product.name}
        whileHover={{ scale: 1.07 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width:"100%", height:"100%", objectFit:"contain", padding: compact ? "12px 8px" : "22px 16px", filter:"drop-shadow(0 14px 22px rgba(0,0,0,0.20))" }}
        onError={e => { e.target.src = "/product-vitres.png"; }}
      />

      {/* Prix flottant */}
      <div style={{
        position:"absolute", bottom: compact ? 8 : 14, right: compact ? 8 : 14,
        background:`linear-gradient(135deg, ${product.color}, ${product.color}cc)`, color:"#fff",
        fontSize: compact ? 10 : 13, fontWeight:800, padding: compact ? "4px 8px" : "6px 12px",
        borderRadius: compact ? 10 : 14, boxShadow:`0 6px 18px ${product.color}55`,
        fontFamily:"'Poppins', sans-serif", whiteSpace:"nowrap",
      }}>
        {product.price.toFixed(compact ? 2 : 3)} DT
      </div>
    </div>

    {/* Infos sous l'image, sur fond blanc plein avec barre d'accent */}
    <div style={{ padding: compact ? "8px 10px 10px" : "14px 18px 18px", position:"relative" }}>
      <p style={{ fontSize: compact ? 9 : 11, fontWeight:600, color:product.color, fontFamily:"'Rubik', sans-serif", margin:0, marginBottom:3, letterSpacing:".04em", textTransform:"uppercase" }}>
        {product.subtitle}
      </p>
      <h3 style={{ fontSize: compact ? 12 : 17, fontWeight:800, color:C.navy, fontFamily:"'Raleway', sans-serif", margin:0, lineHeight:1.25, overflow:"hidden", textOverflow:"ellipsis", whiteSpace: compact ? "nowrap" : "normal" }}>
        {product.name}
      </h3>
    </div>
  </motion.div>
);

const C = {
  navy:     "#272F67",
  magenta:  "#E7398B",
  rose:     "#EE81B1",
  roseLight:"#F6CFE2",
  lavender: "#DDDEE8",
  offwhite: "#FAFAFD",
  banner:   "#d8e8f6",
  wait : "#fafafc",
};

// ── 6 Catégories personnalisées ───────────────────────────────
const CUSTOM_CATEGORIES = [
  {
    id: "cuisine",
    label: "Cuisine",
    sub: "Nettoyants & dégraissants",
    image: "/categories/cat-cuisine.jpg",
    gradient: ["#FFF3E0", "#FFE0B2"],
    accent: "#FF9800",
  },
  {
    id: "sanitaire",
    label: "Sanitaire",
    sub: "WC, lavabos & douches",
    image: "/categories/cat-sanitaire.jpg",
    gradient: ["#E3F2FD", "#BBDEFB"],
    accent: "#1E88E5",
  },
  {
    id: "vitres",
    label: "Vitres",
    sub: "Vitres & surfaces vitrées",
    image: "/categories/cat-vitre.jpg",
    gradient: ["#E0F7FA", "#B2EBF2"],
    accent: "#00ACC1",
  },
  {
    id: "sols",
    label: "Sols & Salons",
    sub: "Parquets, carrelages & moquettes",
    image: "/categories/cat-sols.jpg",
    gradient: ["#FBE9E7", "#FFCCBC"],
    accent: "#F4511E",
  },
  {
    id: "auto",
    label: "Salon de voiture",
    sub: "Intérieur & extérieur auto",
    image: "/categories/cat-maison.jpg",
    gradient: ["#101112", "#101112"],
    accent: "#546E7A",
  },
  {
    id: "desinfection",
    label: "Désinfection",
    sub: "Antibactériens & désinfectants",
    image: "/categories/cat-antitachess.png",
    gradient: ["#F3E5F5", "#E1BEE7"],
    accent: "#8E24AA",
  },
];
// ── CSS mobile ────────────────────────────────────────────────
const MOBILE_CSS = `
  @keyframes products-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes products-marquee-reverse {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  .marquee-track { will-change: transform; }
  .marquee-viewport:hover .marquee-track,
  .marquee-track:focus-within { animation-play-state: paused; }

  @media (max-width: 640px) {
    .hero-ctas        { flex-direction: row !important; align-items: center !important; justify-content: center !important; padding: 0 16px !important; gap: 8px !important; }
    .hero-ctas button { width: auto !important; font-size: 12px !important; padding: 9px 18px !important; }
    .feat-grid        { grid-template-columns: 1fr !important; }
    .usp-grid         { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
    .feat-header      { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
    .section-title h2 { font-size: 22px !important; }
    .hero-video       { object-fit: cover !important; object-position: center center !important; width: 100% !important; height: 100% !important; }
    .hero-section     { min-height: 32vh !important; max-height: 32vh !important; height: 50vh !important; padding-top: 0 !important; }
    .cat-grid-custom  { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
    .cat-img-zone     { height: 110px !important; }
<<<<<<< HEAD

    /* ── Section produits : bouton "Tout voir" minimisé ── */
    .tout-voir-btn    { padding: 5px 12px !important; font-size: 10px !important; border-width: 1px !important; }
    .products-section-inner-header { margin-bottom: 14px !important; }
=======
>>>>>>> frontend
  }
  @media (max-width: 375px) {
    .hero-ctas        { padding: 0 12px !important; gap: 6px !important; }
    .hero-ctas button { font-size: 11px !important; padding: 8px 14px !important; }
    .hero-section     { min-height: 45vh !important; max-height: 45vh !important; height: 45vh !important; }
    .cat-grid-custom  { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    .cat-img-zone     { height: 90px !important; }
  }
`;

let _injected = false;
const injectMobileCSS = () => {
  if (_injected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = MOBILE_CSS;
  document.head.appendChild(style);
  _injected = true;
};

// ── Hero Section ─────────────────────────────────────────────
const HeroSection = ({ navigate }) => {
  injectMobileCSS();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY   = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 320], [1, 0]);

  return (
    <section ref={heroRef} className="hero-section" style={{
      position: "relative", minHeight: "100vh", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      paddingTop: 96, background: "#000",
    }}>
      <video autoPlay muted loop playsInline className="hero-video" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center center", zIndex: 0,
      }}>
        <source src="/app.mp4" type="video/mp4" />
      </video>
      <div style={{
        position: "absolute", inset: 0,
<<<<<<< HEAD
=======
//         background: "linear-gradient(160deg, rgba(39,47,103,.50) 0%, rgba(0,0,0,.30) 50%, rgba(231,57,139,.28) 100%)",
>>>>>>> frontend
        zIndex: 1, pointerEvents: "none",
      }} />
      <motion.div style={{ y: parallaxY, opacity: heroOpacity, position: "relative", zIndex: 2, width: "100%" }}>
        <div className="hero-ctas" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button onClick={() => navigate("products")}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [.22,.61,.36,1] }}
            style={{ background: `linear-gradient(135deg, ${C.magenta}, #c42a76)`, color: "#fff", border: "none", cursor: "pointer", padding: "15px 34px", borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: "'Poppins', sans-serif", boxShadow: `0 8px 32px ${C.magenta}66`, letterSpacing: ".01em" }}
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            Voir les produits →
          </motion.button>
          <motion.button onClick={() => navigate("about")}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [.22,.61,.36,1] }}
            style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", color: "#fff", border: "1.5px solid rgba(255,255,255,.4)", cursor: "pointer", padding: "15px 34px", borderRadius: 50, fontSize: 15, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}
            whileHover={{ scale: 1.04, background: "rgba(255,255,255,.25)" }} whileTap={{ scale: 0.97 }}>
            En savoir plus
          </motion.button>
        </div>
      </motion.div>
      <svg style={{ position: "absolute", bottom: -1, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 3 }}
        viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={C.offwhite} />
      </svg>
    </section>
  );
};
const CAT_OVERLAYS = {
  cuisine:     { from: "rgba(255,152,0,0.72)",   to: "rgba(255,193,7,0.45)",   label: "#fff" },
  sanitaire:   { from: "rgba(67,160,71,0.72)",   to: "rgba(129,199,132,0.45)", label: "#fff" },
  vitres:      { from: "rgba(30,136,229,0.72)",  to: "rgba(100,181,246,0.45)", label: "#fff" },
  sols:        { from: "rgba(97,97,97,0.75)",    to: "rgba(189,189,189,0.45)", label: "#fff" },
auto: {
  from: "rgba(255,255,255,0.78)",
  to: "rgba(240,240,240,0.42)",
  label: "rgba(39,47,103,1)",
  subColor: "rgba(39,47,103,1)",
  titleColor: "rgba(39,47,103,1)",  // ← ajoute ça
},
desinfection:{ from: "rgba(233,30,99,0.72)",   to: "rgba(248,187,208,0.45)", label: "#fff" },
};

// ── Section Produits (extrait juste après le hero) ────────────
// Desktop : un seul bandeau défilant avec toutes les cartes.
// Mobile   : deux bandeaux parallèles défilant en sens opposés, cartes compactes
//            (~2 visibles par ligne × 2 lignes = ~4 articles visibles à l'écran).
const ProductsPreviewSection = ({ navigate }) => {
  const favorites = useAppStore((s) => s.favorites || []);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = (id) => favorites.includes(id);
  const handleToggle = (product) => toggleFavorite(product.id);
  const isMobile = useIsMobile(640);

  const [dbProducts, setDbProducts] = useState([]);
  const [loadingDB,  setLoadingDB]  = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        const list = data.products ?? data ?? [];
        if (list.length > 0) {
          // Filtrer les entrées de test (name vide, "pd", ou image base64)
          const clean = list.filter(p =>
            p.name &&
            p.name.trim().toLowerCase() !== "pd" &&
            !(p.image?.startsWith("data:"))
          );
          setDbProducts(clean.map((p, i) => mapDbProduct(p, i)));
        }
        setLoadingDB(false);
      })
      .catch(() => setLoadingDB(false));
  }, []);

  const products = dbProducts.length > 0 ? dbProducts : STATIC_PRODUCTS;

  // ── Desktop : un seul bandeau, tous les produits ──
  const marqueeProducts = products.length > 0 ? [...products, ...products] : [];
  const marqueeDuration = Math.max(products.length * 4.5, 18);

  // ── Mobile : deux bandeaux parallèles (répartition alternée) ──
  const half = Math.ceil(products.length / 2);
  const rowA = products.slice(0, half);
  const rowB = products.slice(half).length > 0 ? products.slice(half) : products; // fallback si peu de produits
  const marqueeRowA = rowA.length > 0 ? [...rowA, ...rowA] : [];
  const marqueeRowB = rowB.length > 0 ? [...rowB, ...rowB] : [];
  const durationRowA = Math.max(rowA.length * 5, 14);
  const durationRowB = Math.max(rowB.length * 5, 14);

  return (
    <div
      className="products-section"
      style={{
        // Fond distinct de la page Produits : mesh gradient aux couleurs de la marque,
        // pas d'image ni de background-attachment fixed.
//         background: `
//           radial-gradient(ellipse 60% 50% at 8% 8%,   ${C.magenta}22 0%, transparent 65%),
//           radial-gradient(ellipse 55% 55% at 95% 12%, ${C.rose}2a    0%, transparent 60%),
//           radial-gradient(ellipse 60% 60% at 90% 95%, ${C.navy}1c   0%, transparent 65%),
//           radial-gradient(ellipse 55% 50% at 5% 95%,  ${C.lavender}55 0%, transparent 60%),
//           ${C.offwhite}
//         `,
        padding: isMobile ? "28px 0 36px" : "48px 0 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ padding: "0 20px", position: "relative", zIndex: 2 }}>

        {/* Header avec titre + CTA */}
        <div className="products-section-inner-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <SectionTitle title="Nos Produits" sub={loadingDB ? "Chargement…" : `${products.length} produit${products.length !== 1 ? "s" : ""}`} noMargin />
          <motion.button
            className="tout-voir-btn"
            onClick={() => navigate("products")}
            style={{ background:"none", border:`1.5px solid ${C.navy}`, color:C.navy, cursor:"pointer", padding:"8px 18px", borderRadius:50, fontSize:12, fontWeight:600, fontFamily:"'Poppins', sans-serif", whiteSpace:"nowrap", flexShrink:0 }}
            whileHover={{ background:C.navy, color:"#fff" }}>
            Tout voir →
          </motion.button>
        </div>

        {isMobile ? (
          // ══════════════════════════════════════════════════
          // ── MOBILE : deux bandeaux parallèles, sens opposés ──
          // ══════════════════════════════════════════════════
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Ligne 1 — défile vers la gauche */}
            <div className="marquee-viewport" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position:"absolute", top:0, bottom:0, left:0, width:24, background:`linear-gradient(to right, ${C.wait}, transparent)`, zIndex:3, pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:0, bottom:0, right:0, width:24, background:`linear-gradient(to left, ${C.wait}, transparent)`, zIndex:3, pointerEvents:"none" }} />
              <div
                className="marquee-track"
                style={{
                  display: "flex", gap: 10, width: "max-content",
                  animation: `products-marquee ${durationRowA}s linear infinite`,
                  paddingBottom: 6, paddingTop: 6,
                }}
              >
                {marqueeRowA.map((p, i) => (
                  <ProductShowcaseCard
                    key={`a-${p.id}-${i}`}
                    product={p}
                    compact
                    onSelect={(product) => navigate("detail", product.id)}
                    isFavorite={isFavorite(p.id)}
                    onToggleFavorite={handleToggle}
                  />
                ))}
              </div>
            </div>

            {/* Ligne 2 — défile vers la droite (sens opposé) */}
            <div className="marquee-viewport" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position:"absolute", top:0, bottom:0, left:0, width:24, background:`linear-gradient(to right, ${C.wait}, transparent)`, zIndex:3, pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:0, bottom:0, right:0, width:24, background:`linear-gradient(to left, ${C.wait}, transparent)`, zIndex:3, pointerEvents:"none" }} />
              <div
                className="marquee-track"
                style={{
                  display: "flex", gap: 10, width: "max-content",
                  animation: `products-marquee-reverse ${durationRowB}s linear infinite`,
                  paddingBottom: 6, paddingTop: 6,
                }}
              >
                {marqueeRowB.map((p, i) => (
                  <ProductShowcaseCard
                    key={`b-${p.id}-${i}`}
                    product={p}
                    compact
                    onSelect={(product) => navigate("detail", product.id)}
                    isFavorite={isFavorite(p.id)}
                    onToggleFavorite={handleToggle}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // ══════════════════════════════════════════════════
          // ── DESKTOP : un seul bandeau, toutes les cartes ──
          // ══════════════════════════════════════════════════
          <div className="marquee-viewport" style={{ position: "relative", overflow: "hidden", maxWidth: "1380px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ position:"absolute", top:0, bottom:0, left:0, width:40, background:`linear-gradient(to right, ${C.wait}, transparent)`, zIndex:3, pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:0, bottom:0, right:0, width:40, background:`linear-gradient(to left, ${C.wait}, transparent)`, zIndex:3, pointerEvents:"none" }} />

            <div
              className="marquee-track"
              style={{
                display: "flex", gap: 18, width: "max-content",
                animation: `products-marquee ${marqueeDuration}s linear infinite`,
                paddingBottom: 18,
                paddingTop: 18,
              }}
            >
              {marqueeProducts.map((p, i) => (
                <ProductShowcaseCard
                  key={`${p.id}-${i}`}
                  product={p}
                  onSelect={(product) => navigate("detail", product.id)}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={handleToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CAT_OVERLAYS = {
  cuisine:     { from: "rgba(255,152,0,0.72)",   to: "rgba(255,193,7,0.45)",   label: "#fff" },
  sanitaire:   { from: "rgba(67,160,71,0.72)",   to: "rgba(129,199,132,0.45)", label: "#fff" },
  vitres:      { from: "rgba(30,136,229,0.72)",  to: "rgba(100,181,246,0.45)", label: "#fff" },
  sols:        { from: "rgba(97,97,97,0.75)",    to: "rgba(189,189,189,0.45)", label: "#fff" },
auto: {
  from: "rgba(255,255,255,0.78)",
  to: "rgba(240,240,240,0.42)",
  label: "rgba(39,47,103,1)",
  subColor: "rgba(39,47,103,1)",
  titleColor: "rgba(39,47,103,1)",  // ← ajoute ça
},
desinfection:{ from: "rgba(233,30,99,0.72)",   to: "rgba(248,187,208,0.45)", label: "#fff" },
};

// ── Category Card ─────────────────────────────────────────────
const CategoryCard = ({ cat, index, navigate }) => {
  const [hovered, setHovered] = useState(false);
  const overlay = CAT_OVERLAYS[cat.id] || CAT_OVERLAYS.desinfection;

  return (
    <motion.button
      onClick={() => navigate("products")}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 240, damping: 22 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? cat.accent + "55" : C.lavender}`,
        borderRadius: 20,
        padding: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        boxShadow: hovered
          ? `0 16px 40px ${cat.accent}33`
          : "0 2px 12px rgba(39,47,103,.07)",
        transition: "box-shadow 0.35s ease, border-color 0.3s ease",
        textAlign: "left",
      }}
    >
      {/* ── Zone image ── */}
      <div className="cat-img-zone" style={{
        width: "100%", height: 160,
        position: "relative", overflow: "hidden",
        background: `linear-gradient(145deg, ${cat.gradient[0]} 0%, ${cat.gradient[1]} 100%)`,
      }}>

        {/* Image avec zoom */}
        <motion.img
          src={cat.image}
          alt={cat.label}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
<<<<<<< HEAD
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            display: "block",
          }}
        />

        {/* ── Overlay couleur PERMANENT (toujours visible) ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(
            160deg,
            ${overlay.from} 0%,
            ${overlay.to}   55%,
            rgba(0,0,0,0.10) 100%
          )`,
          zIndex: 2,
          transition: "opacity 0.35s ease",
          opacity: hovered ? 0.75 : 0.88,
        }} />

        {/* ── Texte centré sur l'image ── */}
        <div style={{
          position: "absolute", inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
        }}>
          <motion.span
            animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.25 }}
            style={{
              color: overlay.titleColor || overlay.label,
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "'Raleway', system-ui, sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.22)",
              letterSpacing: ".02em",
              textAlign: "center",
              display: "block",
            }}
          >
            {cat.label}
          </motion.span>

          <motion.span
            animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 2 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              color: overlay.subColor || overlay.from.replace(/[\d.]+\)$/, "1)"),
              fontSize: 10,
              fontWeight: 500,
              fontFamily: "'Rubik', system-ui, sans-serif",
              marginTop: 4,
              textAlign: "center",
              textShadow: "0 1px 4px rgba(0,0,0,0.18)",
              background: "rgba(255,255,255,0.18)",
              borderRadius: 20,
              padding: "2px 8px",
            }}
          >
            {cat.sub}
          </motion.span>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 6 : 14 }}
            transition={{ duration: 0.25, delay: hovered ? 0.05 : 0 }}
            style={{
              marginTop: 10,
              padding: "5px 14px",
              borderRadius: 50,
              background: "rgba(255,255,255,0.22)",
              border: `1px solid ${overlay.label}88`,
              backdropFilter: "blur(6px)",
              color: overlay.label,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "'Rubik', system-ui, sans-serif",
              letterSpacing: ".04em",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            Voir les produits
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </motion.div>
        </div>

        {/* Point décoratif */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 7, height: 7, borderRadius: "50%",
          background: overlay.label,
          opacity: 0.7,
          zIndex: 4,
        }} />
      </div>

      {/* ── Bas de carte ── */}
      <motion.div
        animate={{ background: hovered ? `${cat.accent}0D` : "#fff" }}
        transition={{ duration: 0.3 }}
        style={{ padding: "12px 16px 14px", borderTop: `2px solid ${overlay.from}` }}
      >
        <motion.div
          transition={{ duration: 0.25 }}
          style={{
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Raleway', system-ui, sans-serif",
            marginBottom: 3,
            color: overlay.subColor || overlay.from.replace(/[\d.]+\)$/, "1)"),
          }}
        >
          {cat.label}
        </motion.div>

        <div style={{
          fontSize: 11,
          color: overlay.subColor || overlay.from.replace(/[\d.]+\)$/, "1)"),
          fontFamily: "'Rubik', system-ui, sans-serif",
          fontWeight: 400,
          lineHeight: 1.4,
        }}>
          {cat.sub}
        </div>
      </motion.div>

      {/* Barre bas */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${overlay.from}, ${overlay.to})`,
          transformOrigin: "left",
        }}
      />
=======
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            display: "block",
          }}
        />

        {/* ── Overlay couleur PERMANENT (toujours visible) ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(
            160deg,
            ${overlay.from} 0%,
            ${overlay.to}   55%,
            rgba(0,0,0,0.10) 100%
          )`,
          zIndex: 2,
          transition: "opacity 0.35s ease",
          opacity: hovered ? 0.75 : 0.88,
        }} />

        {/* ── Texte centré sur l'image (comme le hero) ── */}
{/* ── Texte centré sur l'image ── */}
<div style={{
  position: "absolute", inset: 0,
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px",
}}>
  {/* Titre centré */}
{/* Titre centré */}
<motion.span
  animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.05 : 1 }}
  transition={{ duration: 0.25 }}
  style={{
    color: overlay.titleColor || overlay.label,  // ← subColor pour auto, label pour les autres
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "'Raleway', system-ui, sans-serif",
    textShadow: "0 2px 8px rgba(0,0,0,0.22)",
    letterSpacing: ".02em",
    textAlign: "center",
    display: "block",
  }}
>
  {cat.label}
</motion.span>

  {/* Sous-titre sur l'image */}
  <motion.span
    animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 2 : 0 }}
    transition={{ duration: 0.25 }}
    style={{
color: overlay.subColor || overlay.from.replace(/[\d.]+\)$/, "1)"),
      fontSize: 10,
      fontWeight: 500,
      fontFamily: "'Rubik', system-ui, sans-serif",    // ← Rubik
      marginTop: 4,
      textAlign: "center",
      textShadow: "0 1px 4px rgba(0,0,0,0.18)",
      background: "rgba(255,255,255,0.18)",
      borderRadius: 20,
      padding: "2px 8px",
    }}
  >
    {cat.sub}
  </motion.span>

  {/* Bouton "Voir" au hover */}
  <motion.div
    animate={{ opacity: hovered ? 1 : 0, y: hovered ? 6 : 14 }}
    transition={{ duration: 0.25, delay: hovered ? 0.05 : 0 }}
    style={{
      marginTop: 10,
      padding: "5px 14px",
      borderRadius: 50,
      background: "rgba(255,255,255,0.22)",
      border: `1px solid ${overlay.label}88`,
      backdropFilter: "blur(6px)",
      color: overlay.label,
      fontSize: 10,
      fontWeight: 600,
      fontFamily: "'Rubik', system-ui, sans-serif",    // ← Rubik
      letterSpacing: ".04em",
      display: "flex", alignItems: "center", gap: 4,
    }}
  >
    Voir les produits
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  </motion.div>
</div>

        {/* Point décoratif */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 7, height: 7, borderRadius: "50%",
          background: overlay.label,
          opacity: 0.7,
          zIndex: 4,
        }} />
      </div>

      {/* ── Bas de carte ── */}
{/* ── Bas de carte ── */}
<motion.div
  animate={{ background: hovered ? `${cat.accent}0D` : "#fff" }}
  transition={{ duration: 0.3 }}
  style={{ padding: "12px 16px 14px", borderTop: `2px solid ${overlay.from}` }}
>
<motion.div
  transition={{ duration: 0.25 }}
  style={{
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Raleway', system-ui, sans-serif",
    marginBottom: 3,
    color: overlay.subColor || overlay.from.replace(/[\d.]+\)$/, "1)"),  // ← subColor en priorité
  }}
>
  {cat.label}
</motion.div>

  {/* Sous-titre bas — même police Rubik + couleur overlay */}
  <div style={{
    fontSize: 11,
color: overlay.subColor || overlay.from.replace(/[\d.]+\)$/, "1)"),
    fontFamily: "'Rubik', system-ui, sans-serif",      // ← Rubik
    fontWeight: 400,
    lineHeight: 1.4,
  }}>
    {cat.sub}
  </div>
</motion.div>

 {/* Barre bas */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${overlay.from}, ${overlay.to})`,  // ← dégradé overlay
            transformOrigin: "left",
          }}
        />
>>>>>>> frontend
    </motion.button>
  );
};

// ── HomePage ──────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div>
      <HeroSection navigate={navigate} />

      {/* ── Produits (juste après la bannière, avant les catégories) ── */}
      <ProductsPreviewSection navigate={navigate} />

      {/* ── Catégories ───────────────────────────────────────── */}
      <section style={{ padding: "56px 0 52px", background: C.offwhite }}>
        <div className="container" style={{ padding: "0 20px" }}>

          {/* Header avec CTA */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 ,}}>
            <SectionTitle  title="Nos catégories"   noMargin />
            <motion.button
<<<<<<< HEAD
              className="tout-voir-btn"
=======
>>>>>>> frontend
              onClick={() => navigate("products")}
              style={{ background: "none", border: `1.5px solid ${C.navy}`, color: C.navy, cursor: "pointer", padding: "8px 18px", borderRadius: 50, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}
              whileHover={{ background: C.navy, color: "#fff" }}>
              Tout voir →
            </motion.button>
          </div>

          {/* Grille 3 colonnes desktop / 2 colonnes mobile */}
          <div
            className="cat-grid-custom"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {CUSTOM_CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} navigate={navigate} />
            ))}
          </div>

        </div>
      </section>

      {/* ── Produits vedettes ────────────────────────────────── */}

      {/* ── USP Banner ───────────────────────────────────────── */}

    </div>
  );
};

const SectionTitle = ({ title, sub }) => (
  <div className="section-title">
    <h2 style={{
      fontFamily: "'Raleway', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontSize: 28, color: C.navy, marginBottom: 4, lineHeight: 1.2,
    }}>{title}</h2>
    {sub && <p style={{
      fontFamily: "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
<<<<<<< HEAD
      color: C.magenta,
=======
      color: C.magenta,   // ← couleur changée
>>>>>>> frontend
      fontSize: 14,
      fontWeight: 400,
    }}>{sub}</p>}
  </div>
);

export default HomePage;