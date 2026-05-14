// ============================================================
// src/views/pages/ContactPage.jsx
// ============================================================
import { useState } from "react";
import useAppStore from "../../store/useAppStore";

const ContactPage = () => {
  const addToast = useAppStore((s) => s.addToast);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast("Message envoyé avec succès ! 📨");
  };

  return (
    <div className="page-enter">
      <div style={{ background: "var(--brand)", padding: "36px 0 44px", color: "#fff" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 6 }}>Contactez-nous</h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15 }}>Nous répondons sous 24h</p>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          {/* Info */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--brand)", marginBottom: 24 }}>
              Nos coordonnées
            </h2>
            {[
              { icon: "📍", title: "Adresse", detail: "12 Rue de la Propreté\n75001 Paris, France" },
              { icon: "📞", title: "Téléphone", detail: "+33 1 23 45 67 89\nLun–Ven, 9h–18h" },
              { icon: "✉️", title: "Email", detail: "bonjour@cleano.fr\nsupport@cleano.fr" },
              { icon: "💬", title: "Chat en direct", detail: "Disponible sur notre site\nLun–Sam, 8h–20h" },
            ].map(({ icon, title, detail }) => (
              <div key={title} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "var(--surface-3)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--brand)", marginBottom: 4 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7,
                               whiteSpace: "pre-line" }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📨</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--brand)", marginBottom: 10 }}>
                  Message envoyé !
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 24 }}>
                  Nous vous répondrons dans les 24h.
                </p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--brand)" }}>Envoyez-nous un message</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Nom" value={form.name} onChange={update("name")} placeholder="Jean Dupont" />
                  <Field label="Email" type="email" value={form.email} onChange={update("email")} placeholder="jean@email.fr" />
                </div>
                <Field label="Sujet" value={form.subject} onChange={update("subject")} placeholder="Mon sujet…" />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Votre message…"
                    rows={5}
                    style={{
                      padding: "10px 14px", border: "1.5px solid var(--border)",
                      borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 14,
                      outline: "none", resize: "vertical",
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", padding: "13px" }}>
                  Envoyer le message →
                </button>
              </form>
            )}
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

export default ContactPage;
