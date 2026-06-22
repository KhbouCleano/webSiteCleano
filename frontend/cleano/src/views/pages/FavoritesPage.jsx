// ============================================================
// src/views/pages/FavoritesPage.jsx
// ============================================================
import { motion, AnimatePresence } from "framer-motion";
import { useFavoritesController } from "../../controllers/useFavoritesController";
import { useProductsController } from "../../controllers/useProductsController";
import useAppStore from "../../store/useAppStore";

// Importer la même liste de produits et le même style que ProductsPage
const C = {
  navy:     "#272F67",
  magenta:  "#E7398B",
  rose:     "#EE81B1",
  roseLight:"#F6CFE2",
  lavender: "#DDDEE8",
  offwhite: "#FAFAFD",
};

// ── MÊME LISTE DE PRODUITS QUE ProductsPage ─────────────────────
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

// ── MÊME ProductCard que ProductsPage ─────────────────────────────
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
    <div style={{ padding: "16px 18px 18px" }}>
      <p
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

      <p style={{
        fontSize: 20,
        fontWeight: 700,
        color: C.magenta,
        margin: "0 0 12px 0",
        fontFamily: "'Poppins', sans-serif",
      }}>
        {product.price}     TND
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
        Ajouter au panier
      </motion.button>
    </div>
  </motion.div>
);

const FavoritesPage = () => {
  const { favoriteProducts, isFavorite, handleToggle } = useFavoritesController();
  const navigate = useAppStore((s) => s.navigate);

  const handleSelectProduct = (product) => {
    navigate("detail", product.id);
  };

  return (
    <>
      {/* ── IMAGE DE FOND TOTALE ── */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/favoris.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }} />

      {/* Overlay dégradé */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(27,37,89,0.75) 0%, rgba(231,57,139,0.55) 100%)",
        zIndex: -1,
      }} />

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="page-enter" style={{
        fontFamily: "'Raleway', system-ui, sans-serif",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        background: "transparent",
      }}>

        {/* Espace pour le header */}
        <div style={{ height: "var(--header-h, 80px)" }} />

        {/* ── TITRE ── */}
        <div style={{
          textAlign: "center",
          padding: "40px 20px 20px",
        }}>
          <h1 style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 900,
            marginBottom: 10,
            color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.2)"
          }}>
            Mes Favoris
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "clamp(14px, 3vw, 16px)",
          }}>
            {favoriteProducts.length} produit{favoriteProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── GRILLE DES FAVORIS ── */}
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 60px", flex: 1 }}>
          <AnimatePresence mode="wait">
            {favoriteProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 24,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  maxWidth: 500,
                  margin: "0 auto"
                }}
              >
                <div style={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 20px",
                  backgroundImage: "url('/a_voila_cette_image_.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.5
                }} />
                <p style={{ fontSize: 18, marginBottom: 24, color: "#1B2559", fontWeight: 600 }}>
                  Aucun favori pour l'instant
                </p>
                <button
                  onClick={() => navigate("products")}
                  style={{
                    background: "linear-gradient(135deg, #E7398B, #F472B6)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 32px",
                    borderRadius: 30,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Raleway', sans-serif",
                    boxShadow: "0 6px 20px rgba(231,57,139,0.35)",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                >
                  Découvrir nos produits
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 24,
                }}
              >
                {favoriteProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
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
    </>
  );
};

export default FavoritesPage;