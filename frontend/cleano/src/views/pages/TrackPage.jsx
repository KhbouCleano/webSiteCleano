// ============================================================
// src/views/pages/TrackPage.jsx
// ============================================================
import { useState } from "react";
import { findOrderByNumber, ORDER_STATUSES } from "../../models/Order";

const FONT = "'Raleway', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const C = {
  navy:    "#1B2559",
  magenta: "#E7398B",
  rose:    "#F472B6",
  lavender:"#E8EAF6",
  muted:   "#8892B0",
  white:   "#FFFFFF",
  offwhite:"#F8F9FF",
  darkBlue: "#2a326e", // Nouvelle couleur ajoutée
};

const TrackPage = () => {
  const [input, setInput]       = useState("");
  const [order, setOrder]       = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);

  const search = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setOrder(findOrderByNumber(input));
      setSearched(true);
      setLoading(false);
    }, 600);
  };

  const currentIdx = order
    ? ORDER_STATUSES.findIndex((s) => s.key === order.status)
    : -1;

  // Fonction pour générer l'URL Google Maps Static API avec l'adresse
  const getGoogleMapsUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
  };

  return (
    <>
      {/* ── IMAGE DE FOND TOTALE (derrière TOUT le contenu y compris le menu) ── */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/colis.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }} />

      {/* Overlay dégradé pour la lisibilité du texte */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgb(189 189 189) 0%, rgba(196, 196, 219, 0) 45%, rgba(42, 58, 143, 0) 5%, rgb(231 57 139 / 32%) 100%)",
        zIndex: -1,
      }} />

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="page-enter" style={{
        fontFamily: FONT,
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        background: "transparent",
      }}>

        {/* Espace pour compenser le header (le menu est au-dessus) */}
        <div style={{ height: "var(--header-h, 80px)" }} />

        {/* ── HERO SECTION ── */}
        <div style={{
          padding: "40px 0 60px",
        }}>
          <div className="container" style={{  }}>

            {/* Titre modifié avec couleur #2a326e */}
            <h1 style={{
              fontFamily: FONT, fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900, color: "#2a326e", margin: "0 0 12px",
              textShadow: "0 2px 20px rgba(0,0,0,0.1)",
            }}>
              Suivre ma commande
            </h1>

            {/* Description modifiée avec couleur #2a326e */}
            <p style={{
              color: "#2a326e",
              fontSize: 16,
              margin: "0 0 40px",
              fontFamily: FONT,
              lineHeight: 1.5,
              fontWeight: 500,
              opacity: 0.9,
            }}>
              Entrez votre numéro de commande pour voir son statut en temps réel.
            </p>

            {/* ── Barre de recherche flottante ── */}
            <div style={{
              display: "flex", gap: 12,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.5)",
              borderRadius: 18,
              padding: "8px 8px 8px 20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            }}>
              <svg style={{ flexShrink: 0, alignSelf: "center" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a326e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Ex : CMD-12345"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#2a326e", fontSize: 16, fontFamily: FONT,
                }}
              />
              <button
                onClick={search}
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
                  color: "#fff", border: "none", borderRadius: 12,
                  padding: "13px 28px", fontSize: 14, fontWeight: 700,
                  fontFamily: FONT, cursor: "pointer",
                  boxShadow: `0 4px 20px ${C.magenta}55`,
                  flexShrink: 0,
                  transition: "opacity .2s",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "..." : "Rechercher"}
              </button>
            </div>

            {/* Style pour le placeholder avec la couleur #2a326e */}
            <style>{`
              input::placeholder {
                color: rgba(42,50,110,0.5);
              }
            `}</style>
          </div>
        </div>

        {/* ── CONTENU RÉSULTATS ── */}
        <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 60px" }}>

          {/* Aucun résultat */}
          {searched && !order && !loading && (
            <div style={{
              textAlign: "center", padding: "56px 32px",
              background: "rgba(255,255,255,0.95)",
              borderRadius: 24,
              border: `1px solid ${C.lavender}`,
              boxShadow: "0 4px 24px rgba(27,37,89,0.07)",
              backdropFilter: "blur(4px)",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `${C.lavender}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 36,
              }}>
                📦
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: C.navy, margin: "0 0 10px", fontFamily: FONT }}>
                Commande introuvable
              </h3>
              <p style={{ fontSize: 14, color: C.muted, fontFamily: FONT, lineHeight: 1.7, margin: 0 }}>
                Aucune commande trouvée pour <strong style={{ color: C.navy }}>"{input}"</strong>.<br />
                Vérifiez le numéro et réessayez.
              </p>
            </div>
          )}

          {/* Résultat trouvé */}
          {order && !loading && (
            <div style={{ animation: "fadeIn .4s ease" }}>

              {/* ── Carte header commande ── */}
              <div style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: 24,
                border: `1px solid ${C.lavender}`,
                boxShadow: "0 8px 40px rgba(27,37,89,0.08)",
                overflow: "hidden",
                marginBottom: 20,
                backdropFilter: "blur(4px)",
              }}>
                {/* Bande colorée top */}
                <div style={{
                  height: 5,
                  background: `linear-gradient(90deg, ${C.magenta}, ${C.rose}, #a78bfa, ${C.magenta})`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }} />

                <div style={{
                  padding: "24px 28px",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: `1px solid ${C.lavender}`,
                  flexWrap: "wrap", gap: 16,
                }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: ".1em", textTransform: "uppercase", fontFamily: FONT, margin: "0 0 6px" }}>
                      Commande
                    </p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: C.navy, fontFamily: FONT, margin: 0 }}>
                      #{order.number}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: ".1em", textTransform: "uppercase", fontFamily: FONT, margin: "0 0 6px" }}>
                      Livraison estimée
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: C.magenta, fontFamily: FONT, margin: 0 }}>
                      {order.estimatedDelivery}
                    </p>
                  </div>
                </div>

                {/* ── STEPPER ── */}
                <div style={{ padding: "36px 28px 32px" }}>
                  <div style={{ position: "relative" }}>

                    {/* Ligne de progression background */}
                    <div style={{
                      position: "absolute",
                      top: 22, left: `calc(100% / ${ORDER_STATUSES.length} / 2)`,
                      right: `calc(100% / ${ORDER_STATUSES.length} / 2)`,
                      height: 3, background: C.lavender, borderRadius: 2, zIndex: 0,
                    }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        background: `linear-gradient(90deg, ${C.magenta}, ${C.rose})`,
                        width: `${(currentIdx / (ORDER_STATUSES.length - 1)) * 100}%`,
                        transition: "width .8s cubic-bezier(.4,0,.2,1)",
                        boxShadow: `0 0 8px ${C.magenta}60`,
                      }} />
                    </div>

                    {/* Steps */}
                    <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                      {ORDER_STATUSES.map((s, i) => {
                        const done    = i <= currentIdx;
                        const current = i === currentIdx;
                        return (
                          <div key={s.key} style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 12,
                            flex: 1,
                          }}>
                            {/* Cercle step */}
                            <div style={{
                              width: 44, height: 44, borderRadius: "50%",
                              background: done
                                ? `linear-gradient(135deg, ${C.magenta}, ${C.rose})`
                                : C.white,
                              border: `2.5px solid ${done ? C.magenta : C.lavender}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 18,
                              boxShadow: current
                                ? `0 0 0 6px ${C.magenta}22, 0 4px 16px ${C.magenta}44`
                                : done
                                ? `0 4px 12px ${C.magenta}30`
                                : "none",
                              transition: "all .4s ease",
                            }}>
                              {s.icon}
                            </div>

                            {/* Label */}
                            <span style={{
                              fontSize: 11, fontWeight: done ? 700 : 500,
                              color: done ? C.navy : C.muted,
                              fontFamily: FONT, textAlign: "center",
                              letterSpacing: ".02em",
                              lineHeight: 1.3,
                            }}>
                              {s.label}
                            </span>

                            {/* Point "actuel" */}
                            {current && (
                              <div style={{
                                fontSize: 10, fontWeight: 800,
                                color: C.magenta,
                                background: `${C.magenta}15`,
                                padding: "2px 10px", borderRadius: 20,
                                fontFamily: FONT,
                                letterSpacing: ".06em",
                                textTransform: "uppercase",
                                marginTop: -6,
                              }}>
                                En cours
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Détails de livraison AVEC MAPS ── */}
                <div style={{
                  padding: "20px 28px 24px",
                  background: "rgba(248,249,255,0.8)",
                  borderTop: `1px solid ${C.lavender}`,
                }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: C.muted,
                    letterSpacing: ".12em", textTransform: "uppercase",
                    fontFamily: FONT, margin: "0 0 14px"
                  }}>
                    Détails de livraison
                  </p>

                  {/* Cartes info transporteur et suivi */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}>
                    {/* Transporteur */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px",
                      background: C.white,
                      borderRadius: 12,
                      border: `1px solid ${C.lavender}`,
                    }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>🚚</span>
                      <div>
                        <p style={{
                          fontSize: 10, fontWeight: 700, color: C.muted,
                          margin: "0 0 2px", textTransform: "uppercase",
                          letterSpacing: ".06em"
                        }}>
                          Transporteur
                        </p>
                        <p style={{
                          fontSize: 13, fontWeight: 600, color: C.navy,
                          margin: 0, fontFamily: FONT
                        }}>
                          {order.carrier}
                        </p>
                      </div>
                    </div>

                    {/* N° de suivi */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px",
                      background: C.white,
                      borderRadius: 12,
                      border: `1px solid ${C.lavender}`,
                    }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>🔍</span>
                      <div>
                        <p style={{
                          fontSize: 10, fontWeight: 700, color: C.muted,
                          margin: "0 0 2px", textTransform: "uppercase",
                          letterSpacing: ".06em"
                        }}>
                          N° de suivi
                        </p>
                        <p style={{
                          fontSize: 13, fontWeight: 600, color: C.navy,
                          margin: 0, fontFamily: FONT
                        }}>
                          {order.trackingCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Adresse avec puce */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px",
                    background: C.white,
                    borderRadius: 12,
                    border: `1px solid ${C.lavender}`,
                    marginBottom: 16,
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>📍</span>
                    <div>
                      <p style={{
                        fontSize: 10, fontWeight: 700, color: C.muted,
                        margin: "0 0 2px", textTransform: "uppercase",
                        letterSpacing: ".06em"
                      }}>
                        Adresse de livraison
                      </p>
                      <p style={{
                        fontSize: 13, fontWeight: 600, color: C.navy,
                        margin: 0, fontFamily: FONT, lineHeight: 1.4
                      }}>
                        {order.address}
                      </p>
                    </div>
                  </div>

                  {/* Carte Google Maps intégrée */}
                  <div style={{
                    width: "100%",
                    height: 280,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: `2px solid ${C.white}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}>
                    <iframe
                      title="Carte de livraison"
                      src={getGoogleMapsUrl(order.address)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Lien "Ouvrir dans Google Maps" */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 12,
                      padding: "8px 16px",
                      background: `${C.magenta}10`,
                      borderRadius: 20,
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.magenta,
                      fontFamily: FONT,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${C.magenta}20`;
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${C.magenta}10`;
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span>🗺️</span>
                    Ouvrir dans Google Maps
                    <span>→</span>
                  </a>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .container > div:first-child {
            margin: 0 16px;
          }
        }
      `}</style>
    </>
  );
};

export { TrackPage };
export default TrackPage;