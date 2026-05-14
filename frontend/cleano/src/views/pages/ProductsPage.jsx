// ============================================================
// src/views/pages/ProductsPage.jsx
// ============================================================
import ProductCard from "../components/shared/ProductCard";
import { useProductsController } from "../../controllers/useProductsController";
import { CATEGORIES } from "../../models/Category";

const ProductsPage = () => {
  const {
    products, activeCategory, setActiveCategory,
    searchQuery, setSearchQuery, sortBy, setSortBy,
  } = useProductsController();

  return (
    <div className="page-enter" style={{ minHeight: "80vh" }}>
      {/* Page header */}
      <div style={{ background: "var(--brand)", padding: "40px 0 48px", color: "#fff" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 38, marginBottom: 8 }}>Nos Produits</h1>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 16 }}>
            {products.length} produit{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 24px" }}>
        {/* Filters bar */}
        <div style={{
          display: "flex", gap: 12, alignItems: "center",
          flexWrap: "wrap", marginBottom: 28,
          padding: "16px 20px", background: "#fff",
          borderRadius: 14, border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              style={{
                width: "100%", padding: "9px 12px 9px 38px",
                border: "1.5px solid var(--border)", borderRadius: 10,
                fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "9px 14px", border: "1.5px solid var(--border)",
              borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 14,
              cursor: "pointer", background: "#fff", outline: "none",
            }}
          >
            <option value="default">Trier par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
            <option value="reviews">Plus commentés</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
              style={{
                padding: "7px 18px", borderRadius: 24,
                border: "1.5px solid",
                borderColor: activeCategory === cat.id ? cat.color : "var(--border)",
                background: activeCategory === cat.id ? cat.color : "#fff",
                color: activeCategory === cat.id ? "#fff" : "var(--text-secondary)",
                cursor: "pointer", fontSize: 13, fontWeight: 500,
                fontFamily: "var(--font-body)", transition: "all .15s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16 }}>Aucun produit trouvé pour cette recherche.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
