// ============================================================
// src/views/components/cart/CartDrawer.jsx
// ============================================================
import { useCartController } from "../../../controllers/useCartController";
import useAppStore from "../../../store/useAppStore";

const CartDrawer = () => {
  const { cartItems, cartOpen, closeCart, handleRemove,
          handleQtyChange, subtotal, shipping, total, count } = useCartController();
  const navigate = useAppStore((s) => s.navigate);

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={closeCart} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,.4)", backdropFilter: "blur(2px)",
      }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "min(420px, 100vw)",
        background: "#fff", boxShadow: "var(--shadow-lg)",
        display: "flex", flexDirection: "column",
        animation: "slideInRight .28s ease both",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)",
                      display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--brand)" }}>
              Mon Panier
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{count} article{count !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={closeCart} style={{
            width: 34, height: 34, borderRadius: 8,
            background: "var(--surface-3)", border: "none",
            cursor: "pointer", fontSize: 16,
          }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px",
                      display: "flex", flexDirection: "column", gap: 12 }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p style={{ fontSize: 15 }}>Votre panier est vide</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }}
                onClick={() => { closeCart(); navigate("products"); }}>
                Découvrir nos produits
              </button>
            </div>
          ) : cartItems.map(({ product, qty }) => (
            <CartItem key={product.id} product={product} qty={qty}
              onRemove={handleRemove} onQtyChange={handleQtyChange} />
          ))}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <Row label="Sous-total" value={`${subtotal.toFixed(2)} €`} />
              <Row label="Livraison" value={shipping === 0 ? "Gratuite 🎉" : `${shipping.toFixed(2)} €`} />
              {shipping > 0 && (
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Livraison gratuite à partir de 35 €
                </p>
              )}
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
              <Row label="Total" value={`${total.toFixed(2)} €`} bold />
            </div>
            <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: "13px" }}
              onClick={() => { closeCart(); navigate("checkout"); }}>
              Passer la commande →
            </button>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={() => { closeCart(); navigate("cart"); }}>
              Voir le panier complet
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const CartItem = ({ product, qty, onRemove, onQtyChange }) => (
  <div style={{ display: "flex", gap: 12, padding: "12px 0",
                borderBottom: "1px solid var(--border)" }}>
    <img src={product.image} alt={product.name}
      style={{ width: 68, height: 68, borderRadius: 10, objectFit: "cover",
               flexShrink: 0, background: "var(--surface-3)" }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35,
                  marginBottom: 6, color: "var(--text-primary)" }}>
        {product.name}
      </p>
      <p style={{ fontSize: 15, fontWeight: 700, color: "var(--brand)", marginBottom: 8 }}>
        {product.price.toFixed(2)} €
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <QtyControl qty={qty}
          onDec={() => onQtyChange(product.id, qty - 1)}
          onInc={() => onQtyChange(product.id, qty + 1)} />
        <button onClick={() => onRemove(product)}
          style={{ fontSize: 12, color: "var(--danger)", background: "none",
                   border: "none", cursor: "pointer", padding: "4px 6px" }}>
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

const QtyControl = ({ qty, onDec, onInc }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6,
                background: "var(--surface-3)", borderRadius: 8, padding: "2px 4px" }}>
    <button onClick={onDec} style={{
      width: 26, height: 26, border: "none", background: "#fff",
      borderRadius: 6, cursor: "pointer", fontSize: 16, fontWeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>−</button>
    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{qty}</span>
    <button onClick={onInc} style={{
      width: 26, height: 26, border: "none", background: "#fff",
      borderRadius: 6, cursor: "pointer", fontSize: 16, fontWeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>+</button>
  </div>
);

const Row = ({ label, value, bold }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 14, color: bold ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: bold ? 700 : 400 }}>{label}</span>
    <span style={{ fontSize: bold ? 17 : 14, fontWeight: bold ? 700 : 500, color: bold ? "var(--brand)" : "var(--text-primary)" }}>{value}</span>
  </div>
);

export default CartDrawer;
