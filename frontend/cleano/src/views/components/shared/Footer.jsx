// ============================================================
// src/views/components/shared/Footer.jsx
// ============================================================
import useAppStore from "../../../store/useAppStore";

const Footer = () => {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <footer style={{
      background: "var(--brand)", color: "#fff",
      padding: "56px 0 28px",
    }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--accent)", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>🧼</div>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700,
              }}>Cleano</span>
            </div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              Des produits de nettoyage premium, écologiques et performants pour un intérieur impeccable.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["📘", "📸", "🐦"].map((icon, i) => (
                <button key={i} style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,.1)", border: "none",
                  cursor: "pointer", fontSize: 16, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  transition: "background .15s",
                }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <FooterCol title="Navigation" links={[
            { label: "Accueil",  target: "home" },
            { label: "Produits", target: "products" },
            { label: "À propos", target: "about" },
            { label: "Contact",  target: "contact" },
          ]} navigate={navigate} />

          {/* Services */}
          <FooterCol title="Services" links={[
            { label: "Suivi commande",  target: "track" },
            { label: "Favoris",         target: "favorites" },
            { label: "Mon panier",      target: "cart" },
          ]} navigate={navigate} />

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em",
                         textTransform: "uppercase", opacity: .5, marginBottom: 16 }}>
              Contact
            </h4>
            {[
              { icon: "📍", text: "12 Rue de la Propreté, Paris" },
              { icon: "📞", text: "+33 1 23 45 67 89" },
              { icon: "✉️", text: "bonjour@cleano.fr" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 24,
                      display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>
            © 2025 Cleano. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {["🌱 Éco", "🔒 Sécurisé", "🚚 Livraison rapide"].map((tag) => (
              <span key={tag} style={{
                fontSize: 11, color: "rgba(255,255,255,.4)",
                background: "rgba(255,255,255,.06)",
                padding: "3px 10px", borderRadius: 20,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, links, navigate }) => (
  <div>
    <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em",
                 textTransform: "uppercase", opacity: .5, marginBottom: 16 }}>
      {title}
    </h4>
    {links.map(({ label, target }) => (
      <button key={target} onClick={() => navigate(target)} style={{
        display: "block", background: "none", border: "none",
        cursor: "pointer", color: "rgba(255,255,255,.65)",
        fontSize: 14, marginBottom: 10, padding: 0,
        fontFamily: "var(--font-body)", transition: "color .15s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,.65)"; }}
      >{label}</button>
    ))}
  </div>
);

export default Footer;
