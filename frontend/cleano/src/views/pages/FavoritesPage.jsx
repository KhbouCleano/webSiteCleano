// ============================================================
// src/views/pages/FavoritesPage.jsx
// ============================================================
import ProductCard from "../components/shared/ProductCard";
import { useFavoritesController } from "../../controllers/useFavoritesController";
import useAppStore from "../../store/useAppStore";

const FavoritesPage = () => {
  const { favoriteProducts } = useFavoritesController();
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="page-enter">
      <div style={{ background: "var(--brand)", padding: "36px 0 44px", color: "#fff" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 6 }}>Mes Favoris</h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15 }}>{favoriteProducts.length} produit{favoriteProducts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="container" style={{ padding: "32px 24px" }}>
        {favoriteProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>❤️</div>
            <p style={{ fontSize: 18, marginBottom: 20 }}>Aucun favori pour l'instant</p>
            <button className="btn btn-primary" onClick={() => navigate("products")}>
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {favoriteProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
