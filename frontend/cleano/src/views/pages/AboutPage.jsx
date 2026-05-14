// ============================================================
// src/views/pages/AboutPage.jsx
// ============================================================
import useAppStore from "../../store/useAppStore";

const AboutPage = () => {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{ background: "var(--brand)", padding: "60px 0 70px", color: "#fff" }}>
        <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, marginBottom: 16 }}>
            Notre <em>mission</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            Chez Cleano, nous croyons qu'un foyer propre est un foyer sain. Depuis 2018, nous formulons des produits
            d'entretien professionnels, efficaces et respectueux de l'environnement.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "60px 24px" }}>
        {/* Values */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--brand)", marginBottom: 8 }}>Nos valeurs</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Ce qui nous guide chaque jour</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 72 }}>
          {[
            { icon: "🌱", title: "Éco-responsabilité", desc: "Formules biodégradables, emballages recyclables, zéro déchet." },
            { icon: "🔬", title: "Innovation", desc: "R&D constante pour des formules toujours plus efficaces et sûres." },
            { icon: "🤝", title: "Transparence", desc: "Composition détaillée, sans ingrédients cachés ni allégations vagues." },
            { icon: "⭐", title: "Excellence", desc: "Standards professionnels adaptés à l'usage quotidien domestique." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              padding: 28, background: "#fff", borderRadius: 16,
              border: "1px solid var(--border)", textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--brand)", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--brand)", marginBottom: 8 }}>Notre équipe</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 72 }}>
          {[
            { name: "Sophie Martin", role: "Fondatrice & CEO", emoji: "👩‍💼" },
            { name: "Thomas Roux",   role: "Directeur R&D",   emoji: "👨‍🔬" },
            { name: "Clara Petit",   role: "Responsable Qualité", emoji: "👩‍🔬" },
            { name: "Marc Durand",   role: "Directeur Commercial", emoji: "👨‍💼" },
          ].map(({ name, role, emoji }) => (
            <div key={name} style={{
              textAlign: "center", padding: "28px 20px",
              background: "#fff", borderRadius: 16, border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "var(--surface-3)", margin: "0 auto 14px",
                fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center",
              }}>{emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{name}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{role}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: "var(--brand)", borderRadius: 20, padding: "48px",
          textAlign: "center", color: "#fff",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 12 }}>
            Prêt à essayer Cleano ?
          </h2>
          <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 28, fontSize: 15 }}>
            Découvrez notre gamme complète de produits premium
          </p>
          <button className="btn btn-accent" style={{ padding: "14px 32px", fontSize: 15 }}
            onClick={() => navigate("products")}>
            Voir nos produits →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
