// ============================================================
// src/views/pages/AboutPage.jsx
// ============================================================
import useAppStore from "../../store/useAppStore";

const FONT = "'Raleway', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const C = {
  navy:    "#1B2559",
  magenta: "#E7398B",
  rose:    "#F472B6",
  lavender:"#E8EAF6",
  muted:   "#8892B0",
  white:   "#FFFFFF",
  offwhite:"#F8F9FF",
  blue:    "#2563EB",
  red:     "#DC2626",
};

/* ── ICÔNES SVG ── */
const IconLeaf = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);
const IconFlask = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M9 3v7l-4.5 9A2 2 0 0 0 6.31 22h11.38a2 2 0 0 0 1.81-3L15 10V3"/>
    <line x1="6" y1="16" x2="18" y2="16"/>
  </svg>
);
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);
const IconStar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconUser = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconDrop = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);
const IconZap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconSpray = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h4v4H3z"/>
    <path d="M7 5h3"/>
    <path d="M10 3v4"/>
    <path d="M12 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/>
    <path d="M12 4v5"/>
  </svg>
);
const IconWind = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>
);

/* ── VALEURS ── */
const VALUES = [
  { Icon: IconLeaf,   title: "Éco-responsabilité", desc: "Formules biodégradables, emballages recyclables, zéro déchet." },
  { Icon: IconFlask,  title: "Innovation",         desc: "R&D constante pour des formules toujours plus efficaces et sûres." },
  { Icon: IconShield, title: "Transparence",       desc: "Composition détaillée, sans ingrédients cachés ni allégations vagues." },
  { Icon: IconStar,   title: "Excellence",         desc: "Standards professionnels adaptés à l'usage quotidien domestique." },
];

// ── VALEURS — inchangées ──

// ── TEAM — remplacer par les vraies infos ──
const TEAM = [
  { name: "Bsema Brhomi",    role: "Gérante & Responsable"     },
  { name: "Direction R&D",   role: "Formulation & Innovation"  },
  { name: "Contrôle Qualité",role: "Certification & Standards" },
  { name: "Commercial",      role: "Distribution & Ventes"     },
];

/* ── MARQUES avec vrais logos + dégradés extraits des logos ── */
const BRANDS = [
  {
    name: "MBwaay",
    sub: "Perfect Clean",
    logo: "/logo MBwaay.png",
    /* Dégradé extrait du logo : bleu vif → rouge vif avec opacités */
    gradientBg: "linear-gradient(135deg, rgba(21, 101, 192, 0.41) 0%, rgba(146, 189, 227, 1) 40%, rgba(233, 158, 158, 1) 100%)",
    gradientBorder: "linear-gradient(135deg, #1565C0, #DC2626)",
    glowColor: "rgba(21,101,192,0.25)",
    desc: "Produits de nettoyage quotidien pour toute la maison.",
    textColor: "#1565C0",
  },
  {
    name: "Cleano",
    sub: "Fresh & Pure",
    logo: "/Logo Cleano.png",
    /* Dégradé extrait du logo : rose → rose clair → bleu → jaune avec opacités */
    gradientBg: "linear-gradient(135deg, rgba(231, 57, 139, 0.46) 0%, rgba(244, 114, 182, 0.40) 35%, rgba(96, 165, 250, 0.38) 70%, rgba(253, 230, 138, 0.70) 100%)",
    gradientBorder: "linear-gradient(135deg, #E7398B, #60A5FA)",
    glowColor: "rgba(231,57,139,0.25)",
    desc: "Gamme douce & écologique pour la famille.",
    textColor: "#1B2559",
  },
  {
    name: "Vortex",
    sub: "Power Clean",
    logo: "/Vortex-logo-fini.png",
    /* Dégradé extrait du logo : noir → vert foncé → vert vif → vert clair avec opacités */
    gradientBg: "linear-gradient(135deg, rgba(26, 26, 26, 0.53) 0%, rgba(45, 90, 27, 0.54) 40%, rgba(76, 175, 80, 0.65) 80%, rgba(139, 195, 74, 0.52) 100%)",
    gradientBorder: "linear-gradient(135deg, #4CAF50, #1a1a1a)",
    glowColor: "rgba(76,175,80,0.25)",
    desc: "Solutions professionnelles haute performance.",
    textColor: "#2E7D32",
  },

];

const AboutPage = () => {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="page-enter" style={{ fontFamily: FONT }}>

      {/* ── Hero banner ── */}
      <div style={{
        position: "relative",
        marginTop: "calc(-1 * var(--header-h, 72px))",
        minHeight: "clamp(320px, 53vw, 920px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/cleano usin.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      </div>

   {/* ── ABOUT US ── */}
   <div style={{ background: C.white, borderBottom: `1px solid ${C.lavender}` }}>
     <div className="container" style={{ padding: "72px 24px 64px", maxWidth: 1100, margin: "0 auto" }}>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
         <div>
           <p style={{ fontSize: 11, fontWeight: 700, color: C.magenta, letterSpacing: ".14em", textTransform: "uppercase", fontFamily: FONT, margin: "0 0 12px" }}>
             À propos de nous
           </p>
           <h1 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: C.navy, margin: "0 0 20px", lineHeight: 1.15 }}>
             STE Khbou Clean
           </h1>
           <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, fontFamily: FONT, margin: "0 0 16px" }}>
             Fondée et enregistrée officiellement en <strong>2021</strong> sous l'identifiant unique <strong>1741070V</strong>,
             la société <strong>STE KHBOU CLEAN</strong> est une entreprise tunisienne spécialisée dans la fabrication
             de produits de nettoyage et d'hygiène. Notre siège est situé à <strong>Hammam Sousse, Sousse</strong>.
           </p>
           <div style={{
             display: "inline-flex", alignItems: "center", gap: 10,
             padding: "10px 20px", borderRadius: 30,
             background: `linear-gradient(135deg, ${C.magenta}15, ${C.rose}10)`,
             border: `1.5px solid ${C.magenta}30`,
             marginBottom: 20,
           }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="2" strokeLinecap="round">
               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
               <circle cx="12" cy="10" r="3"/>
             </svg>
             <span style={{ fontSize: 12, fontWeight: 700, color: C.magenta, fontFamily: FONT }}>
               Route de la Plage, 1er étage — 4011 Hammam Sousse, Sousse
             </span>
           </div>
           <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
             <div style={{ padding: "8px 16px", borderRadius: 20, background: C.lavender, fontSize: 12, fontWeight: 700, color: C.navy, fontFamily: FONT }}>
               Capital : 60 000 TND
             </div>
             <div style={{ padding: "8px 16px", borderRadius: 20, background: `${C.magenta}15`, fontSize: 12, fontWeight: 700, color: C.magenta, fontFamily: FONT }}>
               Durée : 99 ans
             </div>
             <div style={{ padding: "8px 16px", borderRadius: 20, background: "#dcfce7", fontSize: 12, fontWeight: 700, color: "#16a34a", fontFamily: FONT }}>
               Immatriculée RNE ✓
             </div>
           </div>
         </div>
         <div>
           <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85, fontFamily: FONT, marginBottom: 24 }}>
             Nous fabriquons une gamme complète de détergents liquides pour usage domestique et professionnel,
             notamment des <strong>nettoyants multi-surfaces</strong>, <strong>dégraissants cuisine</strong>,
             <strong>produits sanitaires</strong>, <strong>nettoyants vitres</strong> et <strong>anti-calcaires</strong>.
           </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                ),
                label: "Production locale",
                val: "Fabriqué en Tunisie",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                ),
                label: "Bulletin N°",
                val: "216 — Annonce 2021104600",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                ),
                label: "1ère Responsable",
                val: "Bsema Brhomi — Gérante",
              },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 16px", borderRadius: 12,
                background: C.offwhite, border: `1px solid ${C.lavender}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `${C.magenta}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", fontFamily: FONT, margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONT, margin: 0 }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
         </div>
       </div>
     </div>
   </div>

      {/* ── NOS MARQUES ── */}
      <div style={{ background: C.offwhite, borderBottom: `1px solid ${C.lavender}`, padding: "72px 24px" }}>
        <div className="  " style={{ maxWidth: 1250, margin: "0 auto" }}>

          {/* Titre section */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 36, fontWeight: 700, color: C.magenta, letterSpacing: ".14em", textTransform: "uppercase", fontFamily: FONT, fontStyle: "normal", margin: "0 0 8px" }}>
              Nos marques
            </p>

            <p style={{ color: C.muted, fontSize: 15, fontFamily: FONT, fontStyle: "normal" }}>
              Trois marques, une seule mission : un foyer propre et sain
            </p>
          </div>

          {/* Cartes marques */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {BRANDS.map(({ name, sub, logo, gradientBg, gradientBorder, glowColor, desc, textColor }) => (
              <div key={name} style={{
                borderRadius: 24,
                overflow: "hidden",
                background: C.white,
                boxShadow: `0 8px 40px ${glowColor}, 0 2px 8px rgba(0,0,0,0.06)`,
                border: "1.5px solid transparent",
                position: "relative",
                transition: "transform .25s, box-shadow .25s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 60px ${glowColor}, 0 4px 16px rgba(0,0,0,0.10)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 8px 40px ${glowColor}, 0 2px 8px rgba(0,0,0,0.06)`;
                }}
              >
                {/* ── Zone logo avec fond dégradé (opacités comme demandé) ── */}
                <div style={{
                  position: "relative",
                  height: 180,
                  background: gradientBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {/* Effet brillance */}
                  <div style={{
                    position: "absolute",
                    top: -40, left: -40,
                    width: 180, height: 180,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    pointerEvents: "none",
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: -30, right: -30,
                    width: 140, height: 140,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    pointerEvents: "none",
                  }} />

                  {/* Logo image */}
                  <img
                    src={logo}
                    alt={name}
                    style={{
                      maxWidth: "75%",
                      maxHeight: "100rem",
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* ── Contenu texte ── */}
                <div style={{ padding: "24px 28px 28px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                    <h3 style={{
                      fontSize: 22, fontWeight: 900,
                      color: textColor,
                      fontFamily: FONT, fontStyle: "normal", margin: 0,
                    }}>
                      {name}
                    </h3>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: C.muted,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      fontFamily: FONT,
                    }}>
                      {sub}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 14, color: C.muted,
                    lineHeight: 1.75,
                    fontFamily: FONT, fontStyle: "normal", margin: 0,
                  }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    {/* ── BANNER CATALOGUE ── */}
    <div style={{ background: `linear-gradient(135deg, ${C.magenta} 0%, ${C.rose} 100%)`, padding: "72px 24px" }}>
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 40, alignItems: "center" }}>

        {/* Texte gauche */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: ".16em", textTransform: "uppercase", fontFamily: FONT, margin: "0 0 10px" }}>
            Notre catalogue
          </p>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: "#fff", margin: "0 0 10px", lineHeight: 1.1 }}>
            Chaque bouteille est une<br />
            <span style={{ color: "#FDE68A" }}>promesse de propreté</span>
          </h2>
          <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: FONT, margin: "0 0 18px" }}>
            Propre, efficace, fabriqué en Tunisie !
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontFamily: FONT, margin: "0 0 28px" }}>
            Chez Cleano, chaque produit est formulé avec soin à partir de matières premières
            de qualité, sélectionnées pour leur efficacité et leur respect de l'environnement.
            Découvrez notre gamme complète de détergents pour un foyer propre et sain.
          </p>

{/*            */}{/* Infos contact depuis le catalogue */}
{/*           <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}> */}
{/*             {[ */}
{/*               { */}
{/*                 d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z", */}
{/*                 text: "(+216) 54 444 428", */}
{/*               }, */}
{/*               { */}
{/*                 d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", */}
{/*                 text: "cleano@gmail.com", */}
{/*               }, */}
{/*               { */}
{/*                 d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0", */}
{/*                 text: "Hammam Sousse — Tunisie", */}
{/*               }, */}
{/*             ].map(({ d, text }) => ( */}
{/*               <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}> */}
{/*                 <div style={{ */}
{/*                   width: 30, height: 30, borderRadius: 8, flexShrink: 0, */}
{/*                   background: "rgba(255,255,255,0.2)", */}
{/*                   display: "flex", alignItems: "center", justifyContent: "center", */}
{/*                 }}> */}
{/*                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> */}
{/*                     <path d={d}/> */}
{/*                   </svg> */}
{/*                 </div> */}
{/*                 <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontFamily: FONT, fontWeight: 600 }}> */}
{/*                   {text} */}
{/*                 </span> */}
{/*               </div> */}
{/*             ))} */}
{/*           </div> */}

{/*           <button */}
{/*             onClick={() => navigate("products")} */}
{/*             style={{ */}
{/*               display: "inline-flex", alignItems: "center", gap: 8, */}
{/*               background: "#fff", color: C.magenta, */}
{/*               padding: "12px 28px", borderRadius: 30, */}
{/*               fontFamily: FONT, fontWeight: 800, fontSize: 13, */}
{/*               border: "none", cursor: "pointer", */}
{/*               boxShadow: "0 8px 24px rgba(0,0,0,0.15)", */}
{/*             }}> */}
{/*             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> */}
{/*               <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/> */}
{/*               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/> */}
{/*             </svg> */}
{/*             Découvrir nos produits */}
{/*           </button> */}
        </div>

        {/* Carte catalogue avec image */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: 24, overflow: "hidden",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}>
          {/* Image catalogue */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="/catalogue.jpg"
              alt="Catalogue de présentation Cleano"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
            {/* Overlay léger */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 60%, rgba(231,57,139,0.3) 100%)",
              pointerEvents: "none",
            }} />
          </div>

         {/* Pied de carte */}
         <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
           <div>
             <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: FONT, margin: "0 0 3px" }}>
               Catalogue de présentation
             </p>
             <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: FONT, margin: 0 }}>
               Gamme complète Cleano 2024
             </p>
           </div>
           <a
             href="/cataloguepdf.pdf"
             download="Catalogue_Cleano_2024.pdf"
             title="Télécharger le catalogue PDF"
             style={{
               width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
               background: "#fff",
               display: "flex", alignItems: "center", justifyContent: "center",
               textDecoration: "none",
               boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
               transition: "transform .2s, box-shadow .2s",
             }}
             onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)"; }}
             onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)"; }}
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
               <polyline points="7 10 12 15 17 10"/>
               <line x1="12" y1="15" x2="12" y2="3"/>
             </svg>
           </a>
         </div>
        </div>

      </div>
    </div>

      <div className="container" style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ── VALUES ── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.magenta, letterSpacing: ".14em", textTransform: "uppercase", fontFamily: FONT, fontStyle: "normal", margin: "0 0 8px" }}>Ce qui nous guide</p>
          <h2 style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: "var(--brand)", marginBottom: 8, fontStyle: "normal" }}>Nos valeurs</h2>
          <p style={{ color: C.muted, fontSize: 15, fontFamily: FONT, fontStyle: "normal" }}>Ce qui nous guide chaque jour</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 72 }}>
          {VALUES.map(({ Icon, title, desc }) => (
            <div key={title} style={{ padding: 28, background: C.white, borderRadius: 16, border: "1px solid var(--border)", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ color: C.magenta, display: "flex", justifyContent: "center", marginBottom: 14 }}><Icon /></div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--brand)", marginBottom: 10, fontFamily: FONT, fontStyle: "normal" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: FONT, fontStyle: "normal" }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ── TEAM ── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: FONT, fontSize: 32, fontWeight: 900, color: "var(--brand)", marginBottom: 8, fontStyle: "normal" }}>Notre équipe</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 72 }}>
          {TEAM.map(({ name, role }) => (
            <div key={name} style={{ textAlign: "center", padding: "28px 20px", background: C.white, borderRadius: 16, border: "1px solid var(--border)" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.lavender, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                <IconUser />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, fontFamily: FONT, fontStyle: "normal" }}>{name}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: FONT, fontStyle: "normal" }}>{role}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ background: "var(--brand)", borderRadius: 20, padding: "48px", textAlign: "center", color: "#fff" }}>
          <h2 style={{ fontFamily: FONT, fontSize: 30, marginBottom: 12, fontWeight: 900, fontStyle: "normal" }}>
            Prêt à essayer nos produits ?
          </h2>
          <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 28, fontSize: 15, fontFamily: FONT, fontStyle: "normal" }}>
            Découvrez nos gammes MBwaay, Vortex et Cleano
          </p>
          <button className="btn btn-accent" style={{ padding: "14px 32px", fontSize: 15, fontFamily: FONT, fontStyle: "normal" }} onClick={() => navigate("products")}>
            Voir nos produits
          </button>
        </div>

      </div>
      {/* ── NOTRE VÉHICULE ── */}
{/* ── NOTRE FLOTTE ── */}
<div style={{
//   background: `linear-gradient(135deg, #6B21A8 0%, #7C3AED 40%, ${C.magenta} 100%)`,
  padding: "0",
  position: "relative",
  overflow: "hidden",
  minHeight: 520,
}}>
  {/* Décos bulles fond */}
  <div style={{ position: "absolute", top: 40, left: "20%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", top: 20, left: "32%", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", bottom: 60, left: "15%", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", top: "30%", right: "5%", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

  <div style={{
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    alignItems: "center",
    minHeight: 520,
    position: "relative",
    zIndex: 1,
  }}>

    {/* ── GAUCHE : livreur + texte ── */}
    <div style={{
      padding: "52px 32px 52px 48px",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      position: "relative",
    }}>

      {/* Bulle "Questions ???" */}
      <div style={{
        position: "absolute",
        top: 36, right: 20,
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(255,255,255,0.3)",
        borderRadius: "50% 50% 50% 10%",
        padding: "12px 20px",
        zIndex: 3,
      }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: FONT, margin: 0, textAlign: "center" }}>
          Questions<br />???
        </p>
      </div>

      {/* Image livreur */}
      <div style={{ position: "relative" }}>
        <img
          src="/livreur.png"
          alt="Livreur Cleano"
          style={{
            width: "100%",
            maxWidth: 320,
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.25))",
            display: "block",
          }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      {/* Texte + infos contact */}
     {/* Texte + infos contact */}
     <div>
       <p style={{ fontSize: 11, fontWeight: 700, color: C.magenta, letterSpacing: ".14em", textTransform: "uppercase", fontFamily: FONT, margin: "0 0 8px" }}>
         Notre flotte
       </p>
       <h2 style={{ fontFamily: FONT, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: C.navy, margin: "0 0 12px", lineHeight: 1.2 }}>
         Livraison directe<br />
         <span style={{ color: C.magenta }}>chez vous</span>
       </h2>
       <p style={{ fontSize: 13, color: C.navy, fontFamily: FONT, margin: "0 0 20px", lineHeight: 1.7, opacity: 0.75 }}>
         Nos véhicules floqués Cleano sillonnent Hammam Sousse et ses environs pour vous livrer rapidement.
       </p>

       {/* Infos contact */}
       <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
         {[
           { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z", text: "(+216) 54 444 428  ·  (+216) 55 777 400", accent: true },
           { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0", text: "Hammam Sousse — Tunisie", accent: false },
           { d: "M1 6h1m1 0h14M1 6v12a2 2 0 002 2h14a2 2 0 002-2V6M1 6l2-3h14l2 3", text: "Livraison 24 à 48h", accent: false },
         ].map(({ d, text, accent }) => (
           <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
             <div style={{
               width: 32, height: 32, borderRadius: 8, flexShrink: 0,
               background: accent ? `${C.magenta}18` : `${C.navy}10`,
               border: `1.5px solid ${accent ? C.magenta : C.navy}30`,
               display: "flex", alignItems: "center", justifyContent: "center",
             }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke={accent ? C.magenta : C.navy}
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d={d}/>
               </svg>
             </div>
             <span style={{
               fontSize: 12,
               color: accent ? C.magenta : C.navy,
               fontFamily: FONT,
               fontWeight: 700,
             }}>
               {text}
             </span>
           </div>
         ))}
       </div>
     </div>
    </div>

    {/* ── DROITE : deux véhicules superposés ── */}
    <div style={{
      position: "relative",
      height: "100%",
      minHeight: 520,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 32,
      gap: 0,
    }}>

      {/* Véhicule 1 — arrière-plan (plus petit, décalé) */}
      <div style={{
        position: "absolute",
        top: "4%",
        right: "2%",
        width: "88%",
        zIndex: 1,
        opacity: 0.85,
      }}>
        <img
          src="/voiture2.png"
          alt="Toyota HiAce Cleano"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.3)) brightness(0.9)",
          }}
        />
      </div>

      {/* Véhicule 2 — premier plan (plus grand) */}
      <div style={{
        position: "absolute",
        bottom: "2%",
        right: 0,
        width: "95%",
        zIndex: 2,
      }}>
        <img
          src="/voiture1.png"
          alt="Fiat Ducato Cleano"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.35))",
          }}
        />
      </div>

    </div>
  </div>

{/*    */}{/* Bande d'infos en bas */}
{/*   <div style={{ */}
{/*     background: "rgba(0,0,0,0.2)", */}
{/*     borderTop: "1px solid rgba(255,255,255,0.1)", */}
{/*     padding: "18px 48px", */}
{/*     display: "grid", */}
{/*     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", */}
{/*     gap: 16, */}
{/*     position: "relative", */}
{/*     zIndex: 3, */}
{/*   }}> */}
{/*     {[ */}
{/*       { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8", label: "Livraison rapide", val: "24 à 48h" }, */}
{/*       { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0", label: "Zone de livraison", val: "Hammam Sousse & env." }, */}
{/*       { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Emballage soigné", val: "Produits protégés" }, */}
{/*       { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z", label: "Appelez-nous", val: "(+216) 54 444 428" }, */}
{/*     ].map(({ icon, label, val }) => ( */}
{/*       <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}> */}
{/*         <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}> */}
{/*           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"> */}
{/*             <path d={icon}/> */}
{/*           </svg> */}
{/*         </div> */}
{/*         <div> */}
{/*           <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".08em", fontFamily: FONT, margin: 0 }}>{label}</p> */}
{/*           <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: FONT, margin: 0 }}>{val}</p> */}
{/*         </div> */}
{/*       </div> */}
{/*     ))} */}
{/*   </div> */}
</div>
     </div>
  );
};

export default AboutPage;