// ============================================================
// src/views/components/shared/ProductCard.jsx
// ============================================================
import Stars from "./Stars";
import { useCartController }      from "../../../controllers/useCartController";
import { useFavoritesController } from "../../../controllers/useFavoritesController";
import useAppStore from "../../../store/useAppStore";

const BADGE_COLORS = {
  "Bestseller": { bg: "#0a2342", color: "#fff" },
  "Nouveau":    { bg: "#00c896", color: "#fff" },
  "Top Vente":  { bg: "#f59e0b", color: "#fff" },
  "Kit":        { bg: "#8b5cf6", color: "#fff" },
  "Éco":        { bg: "#10b981", color: "#fff" },
};

const ProductCard = ({ product }) => {
  const navigate              = useAppStore((s) => s.navigate);
  const { handleAddToCart }   = useCartController();
  const { isFavorite, handleToggle } = useFavoritesController();

  const discountPct =
    product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <article
      style={{
        background: "#fff", borderRadius: 16,
        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "box-shadow .2s, transform .2s", cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div
        style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: "#f8f9fb" }}
        onClick={() => navigate("detail", product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover",
                   transition: "transform .4s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
          {product.badges.map((b) => {
            const colors = BADGE_COLORS[b] || { bg: "#0a2342", color: "#fff" };
            return (
              <span key={b} className="badge" style={{ background: colors.bg, color: colors.color }}>
                {b.startsWith("-") ? b : b}
              </span>
            );
          })}
        </div>

        {/* Favorite btn */}
        <button
          onClick={(e) => { e.stopPropagation(); handleToggle(product); }}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 34, height: 34, borderRadius: "50%",
            background: "#fff", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, transition: "transform .15s",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
          }}
          aria-label="Favoris"
        >
          {isFavorite(product.id) ? "❤️" : "🤍"}
        </button>

        {/* Out of stock */}
        {!product.inStock && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              background: "#0a2342", color: "#fff",
              padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            }}>Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3
          style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: "var(--text-primary)", cursor: "pointer" }}
          onClick={() => navigate("detail", product.id)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Stars rating={product.rating} size={13} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            ({product.reviews})
          </span>
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: "auto" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--brand)" }}>
            {product.price.toFixed(2)} €
          </span>
          {discountPct && (
            <span style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "line-through" }}>
              {product.originalPrice.toFixed(2)} €
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 4, fontSize: 13, padding: "9px 16px" }}
          onClick={() => handleAddToCart(product)}
          disabled={!product.inStock}
        >
          🛒 Ajouter au panier
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
