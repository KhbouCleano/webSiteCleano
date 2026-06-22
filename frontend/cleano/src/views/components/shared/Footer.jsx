// ============================================================
// src/views/components/shared/Footer.jsx
// ============================================================
import useAppStore from "../../../store/useAppStore";

const Footer = () => {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <footer style={{
      position: "relative",
      overflow: "hidden",
      color: "#fff",
      padding: "64px 0 28px",
    }}>

      {/* ── 1. Couleur de fond de base ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "rgba(253, 235, 244, 1)",
        zIndex: 0,
      }} />

      {/* ── 2. Dégradé ── */}
      <div style={{
        position: "absolute", inset: 0,
  background: "linear-gradient(rgb(250 250 253) 0%, rgb(246 207 226 / 46%) 10%, rgb(180 60 120 / 74%) 50% 40% , rgba(39, 47, 103, 0.94) 80%, rgb(39, 47, 103) 100%)",


        zIndex: 1,
      }} />

      {/* ── 3. Image de mousse PAR-DESSUS le dégradé ── */}
{/* ── 2. Image de mousse unique centrée ── */}
<div style={{
  position: "absolute", inset: 0,
  backgroundImage: "url('/mousse.png')",
  backgroundSize: "cover",        // ← couvre tout le footer
  backgroundPosition: "end",
  backgroundRepeat: "no-repeat",  // ← UNE seule image
  opacity: 1.18,
  zIndex: 1,
}} />

      {/* ── 4. Contenu ── */}
      <div className="container" style={{ position: "relative", zIndex: 3 }}>

        {/* Ligne décorative top */}
        <div style={{
          width: "100%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(231,57,139,0.4), transparent)",
          marginBottom: 48,
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 48,
        }}>

          {/* ── Brand ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <img
        src="/Logo Cleano.png"
        alt="Cleano"
        style={{
          width: 60, height: 60,
          borderRadius: 12,
          objectFit: "contain",
          objectPosition: "center",
        }}
      />

            </div>
            <p style={{
              color: "rgba(39,47,103,0.80)",
              fontSize: 13,
              lineHeight: 1.75,
              maxWidth: 240,
              fontFamily: "'Rubik', sans-serif",
            }}>
              Des produits de nettoyage premium, écologiques et performants pour un intérieur impeccable.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <SocialIcon type="facebook" />
              <SocialIcon type="instagram" />
              <SocialIcon type="twitter" />
            </div>
          </div>

          {/* ── Navigation ── */}
          <FooterCol title="Navigation" links={[
            { label: "Accueil",  target: "home" },
            { label: "Produits", target: "products" },
            { label: "À propos", target: "about" },
            { label: "Contact",  target: "contact" },
          ]} navigate={navigate} />

          {/* ── Services ── */}
          <FooterCol title="Services" links={[
            { label: "Suivi commande", target: "track" },
            { label: "Favoris",        target: "favorites" },
            { label: "Mon panier",     target: "cart" },
          ]} navigate={navigate} />

          {/* ── Contact ── */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "#E7398B",
              marginBottom: 18,
              fontFamily: "'Raleway', sans-serif",
            }}>Contact</h4>
            {[
              { icon: "location", text: "12 Rue de la Propreté, Paris" },
              { icon: "phone", text: "+33 1 23 45 67 89" },
              { icon: "email", text: "bonjour@cleano.fr" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <span style={{
                  fontSize: 14, flexShrink: 0,
                  width: 28, height: 28, borderRadius: 8,
                  background: "rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icon === "location" && <LocationIcon />}
                  {icon === "phone" && <PhoneIcon />}
                  {icon === "email" && <EmailIcon />}
                </span>
                <span style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.80)",
                  lineHeight: 1.55,
                  fontFamily: "'Rubik', sans-serif",
                }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bas de page ── */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <p style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'Rubik', sans-serif",
          }}>
            © 2025 Cleano. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <BadgeIcon icon="leaf" label="Éco" />
            <BadgeIcon icon="lock" label="Sécurisé" />
            <BadgeIcon icon="truck" label="Livraison rapide" />
          </div>
        </div>

      </div>
    </footer>
  );
};

// ── Icônes SVG ─────────────────────────────────────────────────

const SprayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 14C4 9.58172 7.58172 6 12 6C16.4183 6 20 9.58172 20 14V20H4V14Z" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.3)"/>
    <path d="M8 4L9 2H15L16 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="6" r="1.5" fill="white"/>
    <path d="M12 10V18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SocialIcon = ({ type }) => {
  const getIcon = () => {
    switch(type) {
      case "facebook":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "instagram":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.3"/>
            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.3"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
          </svg>
        );
      case "twitter":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34668 17.567 3.12393C16.6767 2.90118 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60509 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default: return null;
    }
  };

  return (
    <button title={type} style={{
      width: 38, height: 38, borderRadius: 10,
      background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.35)",
      cursor: "pointer", fontSize: 16,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s",
      backdropFilter: "blur(6px)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(231,57,139,0.3)";
      e.currentTarget.style.borderColor = "rgba(231,57,139,0.6)";
      e.currentTarget.style.transform = "translateY(-3px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.18)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
      e.currentTarget.style.transform = "translateY(0)";
    }}>
      {getIcon()}
    </button>
  );
};

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="9" r="3" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19C22.0011 19.7899 21.7903 20.566 21.389 21.2412C20.9876 21.9163 20.4123 22.4631 19.7296 22.819C19.047 23.1749 18.282 23.3271 17.5212 23.2591C16.7604 23.1912 16.0324 22.9057 15.42 22.44C12.8768 20.6225 10.6681 18.3756 8.9 15.8C8.43401 15.1868 8.14777 14.4573 8.07961 13.6948C8.01145 12.9324 8.16399 12.1658 8.52079 11.4818C8.8776 10.7978 9.42583 10.2215 10.1029 9.81969C10.78 9.41787 11.5585 9.20729 12.35 9.21001H14.5C15.0347 9.20817 15.56 9.34173 16.0198 9.59543C16.4796 9.84913 16.8552 10.2129 17.1041 10.6529L18.32 12.74C18.5308 13.1055 18.8438 13.3975 19.2208 13.5762C19.5978 13.7549 20.0217 13.8115 20.43 13.74L22.09 13.46C22.5318 13.3874 22.9828 13.4588 23.3765 13.6641C23.7701 13.8694 24.0819 14.1963 24.26 14.59C24.5967 15.3408 24.7736 16.1564 24.78 16.98L22 16.92Z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" fill="none"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" fill="none"/>
    <path d="M22 7L12 13L2 7" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BadgeIcon = ({ icon, label }) => {
  const getIcon = () => {
    switch(icon) {
      case "leaf":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 7M12 2C9.23858 2 7 4.23858 7 7L12 7M12 2C14.7614 2 17 4.23858 17 7L12 7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 22V15M12 22C9.23858 22 7 19.7614 7 17L12 17M12 22C14.7614 22 17 19.7614 17 17L12 17" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case "lock":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="11" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
            <path d="M8 11V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="rgba(255,255,255,0.7)"/>
          </svg>
        );
      case "truck":
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 17H2V5C2 3.89543 2.89543 3 4 3H17V17H15" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 17H14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="7" cy="17" r="2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
            <circle cx="17" cy="17" r="2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
            <path d="M17 6H20L22 9V15H19.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      default: return null;
    }
  };

  return (
    <span style={{
      fontSize: 11,
      color: "rgba(255,255,255,0.7)",
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.18)",
      padding: "4px 12px",
      borderRadius: 20,
      fontFamily: "'Rubik', sans-serif",
      backdropFilter: "blur(4px)",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }}>
      {getIcon()} {label}
    </span>
  );
};

// ── FooterCol ─────────────────────────────────────────────────
const FooterCol = ({ title, links, navigate }) => (
  <div>
    <h4 style={{
      fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "#E7398B",
      marginBottom: 18,
      fontFamily: "'Raleway', sans-serif",
    }}>{title}</h4>
    {links.map(({ label, target }) => (
      <button key={target} onClick={() => navigate(target)} style={{
        display: "block",
        background: "none", border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.72)",
        fontSize: 13,
        marginBottom: 11,
        padding: 0,
        fontFamily: "'Rubik', sans-serif",
        transition: "color 0.2s, transform 0.2s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#E7398B";
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.72)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
      >{label}</button>
    ))}
  </div>
);

export default Footer;