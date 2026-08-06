// ============================================================
// src/views/pages/ContactPage.jsx
// ============================================================
import { useState } from "react";
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
};

const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-5"/>
  </svg>
);
const CONTACTS = [
  {
    Icon: IconPin,
    title: "Adresse",
    lines: [
      { text: "طريق الشاطئ الطابق الأول 4011 حمام سوسة", bold: true,  color: "#fff" },
      { text: "سوسة، تونس",   bold: false, color: "rgba(255,255,255,0.70)" },
    ],
  },
  {
    Icon: IconPhone,
    title: "Téléphone",
    lines: [
      { text: "+216 70 248 170", bold: true, color: "#fff" },
      { text: "Lun–Ven, 9h–18h",   bold: true, color: C.rose },
    ],
  },
  {
    Icon: IconMail,
    title: "Email",
    lines: [
      { text: "contact@registre-entreprises.tn", bold: true,  color: "#fff" },
      { text: "Identifiant: 1741070V", bold: false, color: "rgba(255,255,255,0.70)" },
    ],
  },
  {
    Icon: IconChat,
    title: "Chat en direct",
    lines: [
      { text: "Disponible sur notre site", bold: true,  color: "#fff" },
      { text: "Lun–Sam, 8h–20h",          bold: false, color: "rgba(255,255,255,0.70)" },
    ],
  },
];
const Field = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: FONT, letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        padding: "11px 16px",
        border: `1.5px solid ${C.lavender}`,
        borderRadius: 12,
        fontFamily: FONT, fontSize: 14,
        outline: "none", background: C.offwhite, color: C.navy,
        transition: "border-color .2s",
      }}
      onFocus={e => e.target.style.borderColor = C.magenta}
      onBlur={e => e.target.style.borderColor = C.lavender}
    />
  </div>
);

const ContactPage = () => {
  const addToast = useAppStore((s) => s.addToast);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast("Message envoyé avec succès !");
  };

  return (
    <div className="page-enter" style={{ fontFamily: FONT }}>

      <div style={{
        position: "relative",
        backgroundImage: `url('/v.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        marginTop: "calc(-1 * var(--header-h, 80px))",
        paddingTop: "var(--header-h, 80px)",
      }}>

        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* ── HERO ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          color: "#fff",
        }}>
          <div className="container">
            <p style={{
              fontSize: 12, fontWeight: 700,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: ".18em", textTransform: "uppercase",
              fontFamily: FONT,
            }}>
              Besoin d'aide ?
            </p>
            <h1 style={{
              fontFamily: FONT,
              fontSize: "clamp(32px, 4.5vw, 50px)",
              fontWeight: 900,
            }}>
              Contactez-nous
            </h1>
            <p style={{
              color: "rgba(255,255,255,.65)", fontSize: 17,
              fontFamily: FONT, margin: 0,
            }}>
              Notre équipe vous répond sous 24h
            </p>
          </div>
        </div>

        {/* ── DEUX COLONNES ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}>
          <div>
            {/* Grid responsive : 2 col sur desktop, 1 col sur mobile */}
            <div className="contact-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              alignItems: "stretch",
            }}>

              {/* Colonne gauche — image + "Réseaux sociaux" */}
              <div style={{ position: "relative", overflow: "hidden", minHeight: 440 }}>
                <img
                  src="/face.png"
                  alt="Réseaux sociaux"
                  style={{
                    width: "110%", height: "110%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
                }} />
                <div style={{ position: "absolute", bottom: 32, left: 32 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 700,
                    color: "rgba(255,255,255,0.72)",
                    letterSpacing: ".14em", textTransform: "uppercase",
                    fontFamily: FONT, margin: "0 0 6px",
                  }}>
                    Réseaux sociaux
                  </p>
                  <p style={{
                    fontSize: 22, fontWeight: 900, color: "#fff",
                    fontFamily: FONT, margin: 0,
                  }}>
                    Suivez-nous en ligne
                  </p>
                </div>
              </div>

              {/* Colonne droite — coordonnées */}
              <div className="contact-card" style={{
                padding: "52px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgb(255 255 255 / 55%) 0%, rgb(246 207 226 / 72%) 40%, rgb(58 68 148 / 34%) 100%)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "32px",
                position: "relative",
                top: "-5rem",
                right: "5rem"
              }}>
                <div>
                  <p style={{
                    fontSize: 13, fontWeight: 700, color: "#2c3573",
                    letterSpacing: ".16em", textTransform: "uppercase",
                    fontFamily: FONT, margin: "0 0 10px",
                  }}>
                    Nos coordonnées
                  </p>
                  <h2 style={{
                    fontFamily: FONT, fontSize: 30, fontWeight: 900,
                    color: "#e7398b", margin: 0,
                  }}>
                    Comment nous joindre
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {CONTACTS.map(({ Icon, title, lines }) => (
                    <div key={title} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 16,
                        background: "rgb(255 255 255 / 38%)",
                        border: "1px solid rgba(44, 53, 115, 0.18)",
                        flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#e83a8b",
                      }}>
                        <Icon />
                      </div>
                      <div>
                    <h3 style={{
                      fontSize: 18, fontWeight: 800, color: "#2a326e",
                      margin: "0 0 5px", fontFamily: FONT,
                    }}>
                      {title}
                    </h3>
                        {lines.map((line, i) => (
                          <p key={i} style={{
                            fontSize: 14,
                            fontWeight: line.bold ? 700 : 400,
                            color: line.color === "#fff" ? "#2c3573" : (line.color === C.rose ? "#e83a8b" : "rgba(44, 53, 115, 0.70)"),
                            lineHeight: 1.65,
                            margin: i < lines.length - 1 ? "0 0 2px" : 0,
                            fontFamily: FONT,
                          }}>
                            {line.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ── FORMULAIRE ── */}
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{
          maxWidth: 680, margin: "0 auto",
          background: C.white,
          borderRadius: 24,
          border: `1px solid ${C.lavender}`,
          boxShadow: "0 8px 40px rgba(27,37,89,0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            height: 5,
            background: `linear-gradient(90deg, ${C.magenta}, ${C.rose}, #a78bfa, ${C.magenta})`,
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }} />

          <div style={{ padding: "36px 40px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `${C.magenta}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", color: C.magenta,
                }}>
                  <IconCheck />
                </div>
                <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 900, color: C.navy, marginBottom: 10 }}>
                  Message envoyé !
                </h2>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 28, fontFamily: FONT, lineHeight: 1.7 }}>
                  Merci de nous avoir contactés.<br />Nous vous répondrons dans les 24h.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 24px", borderRadius: 30,
                    border: `1.5px solid ${C.lavender}`,
                    background: C.offwhite, color: C.navy,
                    fontFamily: FONT, fontWeight: 700, fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <IconRefresh /> Envoyer un autre message
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.magenta, letterSpacing: ".14em", textTransform: "uppercase", fontFamily: FONT, margin: "0 0 6px" }}>
                    Formulaire de contact
                  </p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, fontFamily: FONT, margin: 0 }}>
                    Envoyez-nous un message
                  </h2>
                </div>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Nom" value={form.name} onChange={update("name")} placeholder="KbouClean" />
                  <Field label="Email" type="email" value={form.email} onChange={update("email")} placeholder="KbouClean@email.fr" />
                </div>
                <Field label="Sujet" value={form.subject} onChange={update("subject")} placeholder="Mon sujet…" />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: FONT, letterSpacing: ".06em", textTransform: "uppercase" }}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Votre message…"
                    rows={5}
                    style={{
                      padding: "11px 16px",
                      border: `1.5px solid ${C.lavender}`,
                      borderRadius: 12,
                      fontFamily: FONT, fontSize: 14,
                      outline: "none", resize: "vertical",
                      background: C.offwhite, color: C.navy,
                      transition: "border-color .2s",
                    }}
                    onFocus={e => e.target.style.borderColor = C.magenta}
                    onBlur={e => e.target.style.borderColor = C.lavender}
                  />
                </div>
                <button
                  onClick={submit}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: `linear-gradient(135deg, ${C.magenta} 0%, ${C.rose} 100%)`,
                    color: "#fff", border: "none", borderRadius: 14,
                    padding: "15px", fontSize: 14, fontWeight: 700,
                    fontFamily: FONT, cursor: "pointer",
                    boxShadow: `0 8px 28px ${C.magenta}40`,
                    letterSpacing: ".02em",
                  }}
                >
                  <IconSend /> Envoyer le message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        /* ── RESPONSIVE ── */

        /* Tablette : ≤ 768px */
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-grid > div:first-child {
            min-height: 280px !important;
          }
          .contact-grid > div:first-child img {
            width: 100% !important;
            height: 100% !important;
          }
          .contact-grid > div:last-child {
            padding: 36px 28px !important;
          }
          /* Garder la carte arrondie sur tablette */
          .contact-card {
            border-radius: 28px !important;
            top: 0 !important;
            right: 0 !important;
            margin: 20px auto !important;
            width: calc(100% - 40px) !important;
            position: relative !important;
            background: rgba(255, 255, 255, 0.25) !important;
            backdropFilter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
          }
        }

        /* Mobile : ≤ 480px */
        @media (max-width: 480px) {
          .contact-grid > div:first-child {
            min-height: 220px !important;
          }
          .contact-grid > div:last-child {
            padding: 28px 20px !important;
          }
          .contact-grid > div:last-child h2 {
            font-size: 22px !important;
          }
          .contact-grid > div:last-child h3 {
            font-size: 15px !important;
          }
          .contact-grid > div:last-child p {
            font-size: 13px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          div[style*="padding: 36px 40px"] {
            padding: 24px 20px !important;
          }
          /* Garder la carte arrondie sur mobile */
          .contact-card {
            border-radius: 24px !important;
            top: 0 !important;
            right: 0 !important;
            margin: 16px auto !important;
            width: calc(100% - 32px) !important;
            padding: 28px 20px !important;
            position: relative !important;
            background: rgba(255, 255, 255, 0.2) !important;
            backdropFilter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;