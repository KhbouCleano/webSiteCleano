// ============================================================
// src/views/pages/DetailPage.jsx
// ============================================================
import { useState } from "react";
import Stars from "../components/shared/Stars";
import { useCartController }      from "../../controllers/useCartController";
import { useFavoritesController } from "../../controllers/useFavoritesController";
import { findProductById, PRODUCTS } from "../../models/Product";
import useAppStore from "../../store/useAppStore";
import ProductCard from "../components/shared/ProductCard";

const DetailPage = () => {
  const selectedProductId = useAppStore((s) => s.selectedProductId);
  const navigate          = useAppStore((s) => s.navigate);
  const product           = findProductById(selectedProductId);
  const { handleAddToCart }          = useCartController();
  const { isFavorite, handleToggle } = useFavoritesController();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
        <p style={{ fontSize: 18 }}>Produit introuvable.</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("products")}>
          Retour aux produits
        </button>
      </div>
    );
  }

  const discountPct = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="page-enter">
      <div className="container" style={{ padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28,
                      fontSize: 13, color: "var(--text-muted)" }}>
          <button onClick={() => navigate("home")} style={{ background: "none", border: "none",
            cursor: "pointer", color: "var(--brand)", fontSize: 13 }}>Accueil</button>
          <span>›</span>
          <button onClick={() => navigate("products")} style={{ background: "none", border: "none",
            cursor: "pointer", color: "var(--brand)", fontSize: 13 }}>Produits</button>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        {/* Main */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }}>
          {/* Image */}
          <div style={{ position: "relative" }}>
            <div style={{
              aspectRatio: "1", borderRadius: 20, overflow: "hidden",
              background: "var(--surface-3)", boxShadow: "var(--shadow)",
            }}>
              <img src={product.image} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 6 }}>
              {product.badges.map((b) => (
                <span key={b} className="badge" style={{ background: "var(--brand)", color: "#fff" }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600,
                          textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
                {product.category}
              </p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--brand)",
                            lineHeight: 1.2, marginBottom: 12 }}>
                {product.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Stars rating={product.rating} size={16} />
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: "var(--brand)",
                             fontFamily: "var(--font-ui)" }}>
                {product.price.toFixed(2)} €
              </span>
              {discountPct && (
                <>
                  <span style={{ fontSize: 18, color: "var(--text-muted)", textDecoration: "line-through" }}>
                    {product.originalPrice.toFixed(2)} €
                  </span>
                  <span className="badge" style={{ background: "#dcfce7", color: "#16a34a" }}>
                    -{discountPct}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Features */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {product.features.map((f) => (
                <div key={f} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", background: "var(--surface-2)",
                  borderRadius: 10, fontSize: 13,
                }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>

            {/* Qty + CTA */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0,
                            border: "1.5px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 40, height: 44, background: "var(--surface-3)",
                           border: "none", cursor: "pointer", fontSize: 20 }}>−</button>
                <span style={{ width: 44, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  style={{ width: 40, height: 44, background: "var(--surface-3)",
                           border: "none", cursor: "pointer", fontSize: 20 }}>+</button>
              </div>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center", padding: "13px", fontSize: 15 }}
                onClick={() => handleAddToCart(product, qty)}
                disabled={!product.inStock}
              >
                🛒 Ajouter au panier
              </button>
              <button
                onClick={() => handleToggle(product)}
                style={{
                  width: 46, height: 46, borderRadius: 10,
                  border: "1.5px solid var(--border)", background: "#fff",
                  cursor: "pointer", fontSize: 20, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {isFavorite(product.id) ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Trust */}
            <div style={{ display: "flex", gap: 20, paddingTop: 8,
                          borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
              {["🚚 Livraison 24-48h", "🔄 Retours gratuits", "🔒 Paiement sécurisé"].map((t) => (
                <span key={t} style={{ fontSize: 13, color: "var(--text-muted)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26,
                          color: "var(--brand)", marginBottom: 24 }}>
              Produits similaires
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
