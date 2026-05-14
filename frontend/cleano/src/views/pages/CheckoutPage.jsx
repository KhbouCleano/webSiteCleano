// ============================================================
// src/views/pages/CheckoutPage.jsx
// ============================================================
import { useState } from "react";
import { useCartController } from "../../controllers/useCartController";
import useAppStore from "../../store/useAppStore";

const CheckoutPage = () => {
  const { cartItems, subtotal, shipping, total, clearCart } = useCartController();
  const { navigate, addToast } = useAppStore((s) => ({ navigate: s.navigate, addToast: s.addToast }));
  const [step, setStep] = useState(1); // 1: info, 2: payment, 3: confirmed
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "", expiry: "", cvv: "" });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const confirmOrder = () => {
    clearCart();
    setStep(3);
    addToast("Commande confirmée ! 🎉");
  };

  if (step === 3) {
    return (
      <div className="page-enter" style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--brand)", marginBottom: 12 }}>
          Commande confirmée !
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 8 }}>
          Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 36 }}>
          Numéro de commande : <strong>CMD-{Math.floor(Math.random() * 90000 + 10000)}</strong>
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => navigate("track")}>Suivre ma commande</button>
          <button className="btn btn-outline" onClick={() => navigate("home")}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div style={{ background: "var(--brand)", padding: "36px 0 44px", color: "#fff" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 6 }}>Commande</h1>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {[["1", "Informations"], ["2", "Paiement"]].map(([s, label]) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step >= Number(s) ? "var(--accent)" : "rgba(255,255,255,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>{s}</div>
                <span style={{ fontSize: 14, color: step >= Number(s) ? "#fff" : "rgba(255,255,255,.5)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
          {/* Form */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid var(--border)" }}>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Informations de livraison</h2>
                <Field label="Nom complet" value={form.name} onChange={update("name")} placeholder="Jean Dupont" />
                <Field label="Email" type="email" value={form.email} onChange={update("email")} placeholder="jean@email.fr" />
                <Field label="Adresse" value={form.address} onChange={update("address")} placeholder="12 Rue de la Paix" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Ville" value={form.city} onChange={update("city")} placeholder="Paris" />
                  <Field label="Code postal" value={form.zip} onChange={update("zip")} placeholder="75001" />
                </div>
                <button className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "12px 28px" }}
                  onClick={() => setStep(2)}>
                  Continuer →
                </button>
              </div>
            )}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Paiement sécurisé 🔒</h2>
                <Field label="Numéro de carte" value={form.card} onChange={update("card")} placeholder="1234 5678 9012 3456" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Expiration" value={form.expiry} onChange={update("expiry")} placeholder="MM/AA" />
                  <Field label="CVV" value={form.cvv} onChange={update("cvv")} placeholder="123" />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Retour</button>
                  <button className="btn btn-accent" style={{ flex: 1, justifyContent: "center", padding: "12px" }}
                    onClick={confirmOrder}>
                    Confirmer la commande ({total.toFixed(2)} €) →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Votre commande</h2>
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center" }}>
                <img src={product.image} alt={product.name}
                  style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{product.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Qté : {qty}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{(product.price * qty).toFixed(2)} €</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <SRow label="Sous-total" value={`${subtotal.toFixed(2)} €`} />
              <SRow label="Livraison" value={shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`} />
              <SRow label="Total" value={`${total.toFixed(2)} €`} bold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
      padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10,
      fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
    }} />
  </div>
);

const SRow = ({ label, value, bold }) => (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 400, color: bold ? "var(--text-primary)" : "var(--text-secondary)" }}>{label}</span>
    <span style={{ fontSize: bold ? 17 : 14, fontWeight: bold ? 700 : 500 }}>{value}</span>
  </div>
);

export default CheckoutPage;
