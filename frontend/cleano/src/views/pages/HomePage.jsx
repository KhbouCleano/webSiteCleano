// ============================================================
// src/views/pages/HomePage.jsx — Responsive mobile
// ============================================================
import { useRef } from "react";
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

// ── Icônes SVG par catégorie ──────────────────────────────────
const CAT_ICONS = {
  cuisine: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11V3h4v8"/><path d="M7 11a4 4 0 0 0 4-4V3"/><path d="M11 3v8a4 4 0 0 0 4 4"/><path d="M3 11a4 4 0 0 0 4 4"/><path d="M7 21v-6"/><path d="M17 21V3"/><path d="M21 9H17"/>
    </svg>
  ),
  "salle-de-bain": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="7" y1="19" x2="7" y2="21"/><line x1="17" y1="19" x2="17" y2="21"/>
    </svg>
  ),
  desinfection: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  vitres: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
    </svg>
  ),
  wc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V12a8 8 0 1 1 16 0v10"/><path d="M4 16h16"/><path d="M10 22v-4"/><path d="M14 22v-4"/>
    </svg>
  ),
  sols: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
    </svg>
  ),
  auto: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17H5a2 2 0 0 1-2-2V9l3-4h12l3 4v6a2 2 0 0 1-2 2z"/><circle cx="8.5" cy="17" r="1.5"/><circle cx="15.5" cy="17" r="1.5"/>
    </svg>
  ),
  linge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

// Mapping id → icône (fallback sur default)
const getCatIcon = (id) => CAT_ICONS[id] || CAT_ICONS.default;

// Dégradés par catégorie
const CAT_GRADIENTS = {
  cuisine:        ["#FFF3E0", "#FFE0B2", "#FF9800"],
  "salle-de-bain":["#E3F2FD", "#BBDEFB", "#1E88E5"],
  desinfection:   ["#F3E5F5", "#E1BEE7", "#8E24AA"],
  vitres:         ["#E0F7FA", "#B2EBF2", "#00ACC1"],
  wc:             ["#E8F5E9", "#C8E6C9", "#43A047"],
  sols:           ["#FBE9E7", "#FFCCBC", "#F4511E"],
  auto:           ["#ECEFF1", "#CFD8DC", "#546E7A"],
  linge:          ["#FCE4EC", "#F8BBD0", "#E91E63"],
  default:        [C.roseLight, "#F6CFE2", C.magenta],
};

const getCatGradient = (id) => CAT_GRADIENTS[id] || CAT_GRADIENTS.default;

// ── CSS mobile ────────────────────────────────────────────────
const MOBILE_CSS = `
  @media (max-width: 640px) {
    .hero-ctas        { flex-direction: column !important; align-items: stretch !important; padding: 0 24px !important; }
    .hero-ctas button { width: 100% !important; justify-content: center; }
    .cat-grid         { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
    .feat-grid        { grid-template-columns: 1fr !important; }
    .usp-grid         { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
    .feat-header      { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
    .section-title h2 { font-size: 22px !important; }
    .hero-video       { object-fit: cover !important; object-position: center center !important; width: 100% !important; height: 100% !important; }
    .hero-section     { min-height: 60vh !important; max-height: 60vh !important; height: 60vh !important; padding-top: 72px !important; }
    .hero-ctas button { font-size: 14px !important; padding: 13px 28px !important; }
    .cat-card-label   { font-size: 10px !important; }
  }
  @media (max-width: 375px) {
    .hero-ctas { padding: 0 16px !important; }
    .hero-ctas button { font-size: 13px !important; padding: 12px 20px !important; }
    .cat-grid  { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
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
        <source src="/cleano.mp4" type="video/mp4" />
      </video>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, rgba(39,47,103,.50) 0%, rgba(0,0,0,.30) 50%, rgba(231,57,139,.28) 100%)",
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

// ── Category Card ─────────────────────────────────────────────
const CategoryCard = ({ cat, index, navigate }) => {
  const [bg, bg2, accent] = getCatGradient(cat.id);
  const icon = getCatIcon(cat.id);

  return (
    <motion.button
      onClick={() => navigate("products")}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 22 }}
      style={{
        background: "#fff",
        border: `1.5px solid ${C.lavender}`,
        borderRadius: 18,
        padding: 0,
        cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
    >
      {/* Zone icône avec dégradé coloré */}
      <motion.div
        variants={{ hover: { scale: 1.04 } }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%",
          background: `linear-gradient(145deg, ${bg} 0%, ${bg2} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px 0 16px",
          position: "relative",
        }}
      >
        {/* Cercle icône */}
        <motion.div
          variants={{ hover: { y: -3, scale: 1.1 } }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
          style={{
            width: 44, height: 44,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: `0 4px 16px ${accent}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: accent,
          }}
        >
          <div style={{ width: 22, height: 22 }}>{icon}</div>
        </motion.div>

        {/* Trait décoratif bas */}
        <motion.div
          variants={{ hover: { scaleX: 1, opacity: 1 } }}
          initial={{ scaleX: 0, opacity: 0 }}
          style={{
            position: "absolute", bottom: 0, left: "20%", right: "20%",
            height: 2, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            transformOrigin: "center",
          }}
        />
      </motion.div>

      {/* Label */}
      <div style={{
        padding: "10px 8px 12px",
        width: "100%", textAlign: "center",
      }}>
        <span
          className="cat-card-label"
          style={{
            fontSize: 11, fontWeight: 600, color: C.navy,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: ".02em",
            textTransform: "uppercase",
            lineHeight: 1.3,
            display: "block",
          }}
        >
          {cat.label}
        </span>
      </div>

      {/* Bordure hover magenta */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        style={{
          position: "absolute", inset: 0,
          borderRadius: 18,
          border: `1.5px solid ${accent}55`,
          pointerEvents: "none",
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
      <section style={{ padding: "56px 0 48px", background: C.offwhite }}>
        <div className="container" style={{ padding: "0 16px" }}>
          <SectionTitle title="Nos catégories" sub="Trouvez le produit idéal pour chaque surface" />
          <div
            className="cat-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 12, marginTop: 32,
            }}
          >
            {CATEGORIES.filter((c) => c.id !== "all").map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Produits vedettes ────────────────────────────────── */}
      <section style={{ padding: "48px 0 56px", background: C.offwhite }}>
        <div className="container" style={{ padding: "0 16px" }}>
          <div className="feat-header"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <SectionTitle title="Produits vedettes" sub="Les incontournables de notre catalogue" noMargin />
            <motion.button onClick={() => navigate("products")}
              style={{ background: "none", border: `1.5px solid ${C.navy}`, color: C.navy, cursor: "pointer", padding: "9px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}
              whileHover={{ background: C.navy, color: "#fff" }}>
              Voir tout →
            </motion.button>
          </div>
          <div className="feat-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {featured.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP Banner ───────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1a2150 100%)`, padding: "48px 16px" }}>
        <div className="container" style={{ padding: "0 16px" }}>
          <div className="usp-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28 }}>
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>, title: "Livraison offerte", sub: "Dès 35 € d'achat" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>, title: "Retour 30 jours", sub: "Satisfait ou remboursé" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: "Paiement sécurisé", sub: "SSL & 3D Secure" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>, title: "Éco-responsable", sub: "Certifications ECOLABEL" },
            ].map(({ icon, title, sub }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, flexShrink: 0, color: C.rose, opacity: .9 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionTitle = ({ title, sub }) => (
  <div className="section-title">
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.navy, marginBottom: 4, lineHeight: 1.2 }}>{title}</h2>
    {sub && <p style={{ color: `${C.navy}88`, fontSize: 14 }}>{sub}</p>}
  </div>
);

export default HomePage;