// ============================================================
// src/views/pages/ProductsPage.jsx
// ============================================================
import { motion, AnimatePresence } from "framer-motion";
import { useProductsController } from "../../controllers/useProductsController";
import { useFavoritesController } from "../../controllers/useFavoritesController";
import useAppStore from "../../store/useAppStore";

const C = {
  navy:     "#272F67",
  magenta:  "#E7398B",
  rose:     "#EE81B1",
  roseLight:"#F6CFE2",
  lavender: "#DDDEE8",
  offwhite: "#FAFAFD",
};

// ── Produits statiques avec vraies images ─────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Anti-Calcaire",
    subtitle: "Décapant surpuissant",
    desc: "مزيل للجير",
    img: "/image00001.png",
    color: "#1a1a1a",
    badge: "Noir",
    price: 15,
  },
  {
    id: 2,
    name: "Nettoyant Vitres",
    subtitle: "Anti Trace – Séchage rapide",
    desc: "منظف الزجاج",
    img: "/image00002.png",
    color: "#4fc3f7",
    badge: "Bleu",
    price: 15,
  },
  {
    id: 3,
    name: "Super Dégraissant Cuisine",
    subtitle: "Four · Friteuse · Hotte",
    desc: "مزيل الدهون القوي للمطبخ",
    img: "/image00003.png",
    color: "#f9a825",
    badge: "Jaune",
    price: 15,
  },
  {
    id: 4,
    name: "Spécial Tissu",
    subtitle: "Dégraissant Ultra-Actif",
    desc: "خاص بالأقمشة",
    img: "/image00004.png",
    color: "#bdbdbd",
    badge: "Blanc",
    price: 15,
  },
  {
    id: 5,
    name: "Multi-Usage Sanitaire",
    subtitle: "Nettoyant · Désinfectant · Parfumé",
    desc: "متعدد الاستخدامات للحمام",
    img: "/image00005.png",
    color: "#8bc34a",
    badge: "Vert",
    price: 15,
  },
  {
    id: 6,
    name: "Super Anti-Tache",
    subtitle: "Nettoyant Toutes Surfaces",
    desc: "مضاد للبقع فائق الفعالية",
    img: "/product-vitres.png",
    color: "#E7398B",
    badge: "Rose",
    price: 15,
  },
];

// ── Mobile CSS injection ──────────────────────────────────────
const MOBILE_CSS = `
  @media (max-width: 640px) {
    .banner-root {
      height: 410px !important;
      position: relative !important;
      top: -26px !important;
    }
    .banner-inner {
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-end !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      padding-bottom: 50px !important;
      padding-top: 72px !important;
      gap: 0 !important;
    }
    .banner-text {
      order: 1 !important;
      max-width: 100% !important;
      width: 100% !important;
      align-items: center !important;
      padding: 0 !important;
      position: relative !important;
      right: 2.5rem !important;
      top: 16rem !important;
    }
    .banner-text h1 {
      font-size: 28px !important;
      left: 0 !important; top: 0 !important;
      position: relative !important;
      text-align: center !important;
      transform: none !important;
      margin-bottom: 6px !important;
    }
    .banner-text p {
      font-size: 11px !important;
      left: 0 !important; top: 0 !important;
      position: relative !important;
      max-width: 85% !important;
      text-align: center !important;
      transform: none !important;
    }
    .banner-bar {
      left: 0 !important; top: 0 !important;
      position: relative !important;
      width: 140px !important;
      margin-top: 8px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      transform: none !important;
    }
    .banner-img {
      display: block !important;
      order: 2 !important;
      width: min(180px, 44vw) !important;
      flex-shrink: 0 !important;
      align-self: flex-end !important;
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }
    .banner-arrow {
      bottom: -28px !important;
      top: auto !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
    }
    .products-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
    }
    .product-card-inner { padding: 12px !important; }
    .product-card-img { height: 160px !important; }
    .product-card-name { font-size: 13px !important; }
    .product-card-sub  { font-size: 10px !important; }

    .products-section {
      background-image: none !important;
      background-attachment: scroll !important;
      background:
        radial-gradient(ellipse 65% 55% at -2%  20%,  #6dbf22 0%, rgba(109,191,34,0)  65%),
        radial-gradient(ellipse 60% 65% at -2%  85%,  #d4c000 0%, rgba(212,192,0,0)   65%),
        radial-gradient(ellipse 55% 50% at 103% 5%,   #1976d2 0%, rgba(25,118,210,0)  60%),
        radial-gradient(ellipse 55% 55% at 103% 98%,  #e7398b 0%, rgba(231,57,139,0)  60%),
        radial-gradient(ellipse 80% 50% at 50%  50%,  rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%),
        #e8f5e0 !important;
      padding-bottom: 40px !important;
    }
    .fondu-haut {
      height: 80px !important;
    }
    .fondu-bas {
      height: 140px !important;
    }
    .pont-footer {
      height: 50px !important;
    }
  }

  @media (max-width: 375px) {
    .banner-root { height: 360px !important; }
    .banner-text h1 { font-size: 24px !important; }
    .products-grid { grid-template-columns: 1fr !important; }
    .fondu-bas { height: 100px !important; }
    .pont-footer { height: 36px !important; }
  }
`;

let _injected = false;
const injectCSS = () => {
  if (_injected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = MOBILE_CSS;
  document.head.appendChild(s);
  _injected = true;
};

// ── ProductCard avec favoris ─────────────────────────────────────
const ProductCard = ({ product, onSelect, isFavorite, onToggleFavorite }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: `0 8px 32px ${product.color}22, 0 2px 8px rgba(0,0,0,0.08)`,
      border: `1.5px solid rgba(255,255,255,0.7)`,
      cursor: "pointer",
      position: "relative",
    }}
  >
    {/* Bouton favori (cœur) */}
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(product);
      }}
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        background: "rgba(255,255,255,0.9)",
        border: "none",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backdropFilter: "blur(4px)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isFavorite ? "#E7398B" : "none"}
        stroke={isFavorite ? "#E7398B" : "#8892B0"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </motion.button>

    {/* Badge couleur */}
    <div style={{
      position: "absolute", top: 12, right: 12,
      background: product.color,
      color: "#fff",
      fontSize: 10, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20,
      fontFamily: "'Rubik', sans-serif",
      boxShadow: `0 2px 8px ${product.color}55`,
      letterSpacing: ".04em",
      zIndex: 10,
    }}>
      {product.badge}
    </div>

    {/* Image */}
    <div
      className="product-card-img"
      style={{
        height: 220,
        background: `linear-gradient(135deg, ${product.color}18 0%, ${product.color}08 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={product.img}
        alt={product.name}
        style={{
          height: "90%",
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))",
          transition: "transform .3s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      />
    </div>

    {/* Infos */}
    <div className="product-card-inner" style={{ padding: "16px 18px 18px" }}>
      <p
        className="product-card-sub"
        style={{
          fontSize: 11, fontWeight: 600,
          color: product.color,
          fontFamily: "'Rubik', sans-serif",
          margin: 0, marginBottom: 4,
          letterSpacing: ".04em",
          textTransform: "uppercase",
        }}
      >
        {product.subtitle}
      </p>

      <h3
        className="product-card-name"
        style={{
          fontSize: 16, fontWeight: 800,
          color: C.navy,
          fontFamily: "'Raleway', sans-serif",
          margin: 0, marginBottom: 4,
          lineHeight: 1.2,
        }}
      >
        {product.name}
      </h3>

      <p style={{
        fontSize: 12,
        color: "rgba(39,47,103,0.5)",
        fontFamily: "'Rubik', sans-serif",
        margin: 0, marginBottom: 14,
        direction: "rtl",
      }}>
        {product.desc}
      </p>

      <motion.button
        whileHover={{ scale: 1.04, filter: "brightness(1.08)" }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onSelect && onSelect(product)}
        style={{
          width: "100%",
          background: `linear-gradient(135deg, ${product.color}, ${product.color}bb)`,
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "10px 0",
          fontSize: 13, fontWeight: 700,
          fontFamily: "'Poppins', sans-serif",
          cursor: "pointer",
          boxShadow: `0 4px 14px ${product.color}44`,
          letterSpacing: ".02em",
        }}
      >
        Voir le produit
      </motion.button>
    </div>
  </motion.div>
);

// ── Page Banner ───────────────────────────────────────────────
const PageBanner = () => {
  injectCSS();
  return (
    <div className="banner-root" style={{ position: "relative", marginTop: -72, height: 760 }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        <div style={{
          position: "absolute", right: -80, top: -80,
          width: 380, height: 380, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.magenta}66 0%, transparent 70%)`,
          zIndex: 1, filter: "blur(50px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: -60, bottom: -60,
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,120,255,0.45) 0%, transparent 70%)",
          zIndex: 1, filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0, top: "65px",
          backgroundImage: "url('/tissus.png')",
          backgroundSize: "cover", backgroundPosition: "center center",
          zIndex: 2, opacity: 1,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 90,
          background: `linear-gradient(to bottom, transparent, ${C.offwhite})`,
          zIndex: 3, pointerEvents: "none",
        }} />
      </div>

      <div className="banner-inner" style={{
        position: "absolute", inset: 0, zIndex: 4,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 72, paddingLeft: "6%", paddingRight: "2%",
      }}>
        <motion.div
          className="banner-text"
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [.22,.61,.36,1] }}
          style={{ maxWidth: 420, flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <h1 style={{
            fontFamily: "'Raleway', system-ui, sans-serif",
            fontSize: "clamp(36px, 5vw, 62px)",
            fontWeight: 900, lineHeight: 1.2, letterSpacing: "-.03em",
            margin: 0, marginBottom: 16, color: "#115df5",
            position: "relative", left: "22.5rem", top: "9rem",
            textShadow: "0 4px 24px rgba(0,0,0,0.18)",
            textAlign: "center", display: "block", width: "100%",
          }}>
            Nos<br />
            <span style={{
              background: `linear-gradient(90deg, #1965fc 0%, ${C.rose} 60%, ${C.magenta} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Produits</span>
          </h1>
          <p style={{
            position: "relative", left: "22.5rem", top: "9rem",
            fontFamily: "'Rubik', system-ui, sans-serif", fontSize: 15,
            color: "rgb(217, 56, 131)", margin: 0, lineHeight: 1.6, maxWidth: 500,
          }}>
            Des solutions professionnelles pour chaque surface
          </p>
          <motion.div
            className="banner-bar"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            style={{
              position: "relative", left: "22rem", top: "8rem",
              marginTop: 22, height: 3, width: 350, borderRadius: 10,
              background: `linear-gradient(90deg, #1965fc, ${C.rose}, transparent)`,
              transformOrigin: "left",
            }}
          />
        </motion.div>

        <motion.img
          className="banner-img"
          src="/product-vitres.png"
          alt="Produit Cleano"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [.22,.61,.36,1] }}
          style={{
            width: "min(480px, 44vw)", objectFit: "contain",
            filter: "drop-shadow(0 32px 60px rgba(39,47,103,0.25))",
            flexShrink: 0, marginRight: "2%",
          }}
        />
      </div>

      <motion.div
        className="banner-arrow"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => window.scrollBy({ top: 500, behavior: "smooth" })}
        style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)", zIndex: 10, cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "rgba(39,47,103,0.10)", backdropFilter: "blur(8px)",
          border: `1.5px solid ${C.navy}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, minWidth: 38, minHeight: 38, boxSizing: "border-box",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

// ── Products Page ─────────────────────────────────────────────
const ProductsPage = () => {
  const { searchQuery, setSearchQuery, sortBy, setSortBy } = useProductsController();
  const { isFavorite, handleToggle } = useFavoritesController();
  const navigate = useAppStore((s) => s.navigate);

  const handleSelectProduct = (product) => {
    navigate("detail", product.id);
  };

  // Filtrer les produits
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tri des produits
  const sortedProducts = [...filtered];
  if (sortBy === "price-asc") {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "price-desc") {
    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  return (
    <div className="page-enter" style={{ minHeight: "80vh", background: C.offwhite }}>
      <PageBanner />

      <div
        className="products-section"
        style={{
          backgroundImage: "url('/logo-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          padding: "0 12px 60px",
          position: "relative",
        }}
      >
        <div
          className="fondu-haut"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 160,
            background: `linear-gradient(to bottom, ${C.offwhite}, transparent)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div
          className="fondu-bas"
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 250,
            background: `linear-gradient(to bottom,
              transparent 0%,
              rgba(255,255,255,0.3) 30%,
              rgba(255,255,255,0.7) 60%,
              rgba(255,255,255,0.95) 100%)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ padding: "32px 16px 48px", position: "relative", zIndex: 2 }}>
          {/* Filters bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: "flex", gap: 12, alignItems: "center",
              flexWrap: "wrap", marginBottom: 28, padding: "14px 18px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
              borderRadius: 16,
              border: "1.5px solid rgba(255,255,255,0.65)",
              boxShadow: "0 4px 24px rgba(39,47,103,.10)",
            }}
          >
            <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit…"
                style={{
                  width: "100%", padding: "10px 12px 10px 38px",
                  border: `1.5px solid ${C.lavender}`, borderRadius: 10,
                  fontFamily: "'Rubik', sans-serif", fontSize: 14,
                  outline: "none", color: C.navy,
                  background: "rgba(255,255,255,0.95)",
                }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "10px 36px 10px 14px", border: `1.5px solid ${C.lavender}`,
                  borderRadius: 10, fontFamily: "'Rubik', sans-serif", fontSize: 14,
                  cursor: "pointer", background: "rgba(255,255,255,0.95)",
                  color: C.navy, appearance: "none",
                }}>
                <option value="default">Trier par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
              <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.5 }}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {sortedProducts.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  textAlign: "center", padding: "80px 0",
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(10px)", borderRadius: 20,
                }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 16, fontFamily: "'Rubik', sans-serif", color: C.navy }}>
                  Aucun produit trouvé.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="products-grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 24,
                }}
              >
                {sortedProducts.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ProductCard
                      product={p}
                      onSelect={handleSelectProduct}
                      isFavorite={isFavorite(p.id)}
                      onToggleFavorite={handleToggle}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className="pont-footer"
        style={{
          height: 80,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,220,235,0.4) 50%, transparent 100%)",
          marginTop: -2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default ProductsPage;