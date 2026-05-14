// ============================================================
// src/views/pages/CartPage.jsx
// ============================================================
import { useCartController } from "../../controllers/useCartController";
import useAppStore from "../../store/useAppStore";

const CartPage = () => {
  const { cartItems, handleRemove, handleQtyChange, clearCart,
          subtotal, shipping, total, count } = useCartController();
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="page-enter">
      <div style={{ background: "var(--brand)", padding: "36px 0 44px", color: "#fff" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 6 }}>Mon Panier</h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15 }}>{count} article{count !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="container" style={{ padding: "32px 24px" }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
            <p style={{ fontSize: 18, marginBottom: 20 }}>Votre panier est vide</p>
            <button className="btn btn-primary" onClick={() => navigate("products")}>Découvrir nos produits</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Articles ({count})</h2>
                <button style={{ fontSize: 13, color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}
                  onClick={clearCart}>Vider le panier</button>
              </div>
              {cartItems.map(({ product, qty }) => (
                <div key={product.id} style={{
                  display: "flex", gap: 16, padding: 20,
                  background: "#fff", borderRadius: 14, border: "1px solid var(--border)",
                }}>
                  <img src={product.image} alt={product.name}
                    style={{ width: 90, height: 90, borderRadius: 10, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{product.name}</h3>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "var(--brand)", marginBottom: 12 }}>
                      {product.price.toFixed(2)} €
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)",
                                    borderRadius: 8, overflow: "hidden" }}>
                        <button onClick={() => handleQtyChange(product.id, qty - 1)}
                          style={{ width: 34, height: 34, background: "var(--surface-3)", border: "none", cursor: "pointer", fontSize: 18 }}>−</button>
                        <span style={{ width: 40, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                        <button onClick={() => handleQtyChange(product.id, qty + 1)}
                          style={{ width: 34, height: 34, background: "var(--surface-3)", border: "none", cursor: "pointer", fontSize: 18 }}>+</button>
                      </div>
                      <button onClick={() => handleRemove(product)}
                        style={{ fontSize: 13, color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--brand)", whiteSpace: "nowrap" }}>
                    {(product.price * qty).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid var(--border)", position: "sticky", top: 90 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Récapitulatif</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <Row label="Sous-total" value={`${subtotal.toFixed(2)} €`} />
                <Row label="Livraison" value={shipping === 0 ? "Gratuite 🎉" : `${shipping.toFixed(2)} €`} />
                <div style={{ height: 1, background: "var(--border)" }} />
                <Row label="Total" value={`${total.toFixed(2)} €`} bold />
              </div>
              <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: "13px" }}
                onClick={() => navigate("checkout")}>
                Passer la commande →
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
                onClick={() => navigate("products")}>
                ← Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value, bold }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ fontSize: 14, color: bold ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: bold ? 700 : 400 }}>{label}</span>
    <span style={{ fontSize: bold ? 18 : 14, fontWeight: bold ? 700 : 500 }}>{value}</span>
  </div>
);

export default CartPage;
