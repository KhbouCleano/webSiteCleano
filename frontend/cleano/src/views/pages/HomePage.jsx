// ============================================================
// src/views/pages/HomePage.jsx — Responsive mobile
// ============================================================
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductCard from "../components/shared/ProductCard";
import { PRODUCTS } from "../../models/Product";
import { CATEGORIES } from "../../models/Category";
import useAppStore from "../../store/useAppStore";

const C = {
  navy:     "#272F67",
  magenta:  "#E7398B",
  rose:     "#EE81B1",
  roseLight:"#F6CFE2",
  lavender: "#DDDEE8",
  offwhite: "#FAFAFD",
  banner:   "#d8e8f6",
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
//         background: "linear-gradient(160deg, rgba(39,47,103,.50) 0%, rgba(0,0,0,.30) 50%, rgba(231,57,139,.28) 100%)",
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
    </motion.button>
  );
};

// ── HomePage ──────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useAppStore((s) => s.navigate);
  const featured = PRODUCTS.filter(
    (p) => p.badges.includes("Bestseller") || p.badges.includes("Top Vente")
  ).slice(0, 4);

  return (
    <div>
      <HeroSection navigate={navigate} />

      {/* ── Catégories ───────────────────────────────────────── */}
      <section style={{ padding: "56px 0 52px", background: C.offwhite }}>
        <div className="container" style={{ padding: "0 20px" }}>

          {/* Header avec CTA */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 ,}}>
            <SectionTitle  title="Nos catégories"   noMargin />
            <motion.button
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
      color: C.magenta,   // ← couleur changée
      fontSize: 14,
      fontWeight: 400,
    }}>{sub}</p>}
  </div>
);

export default HomePage;