// ============================================================
// src/views/pages/TrackPage.jsx — Responsive (CORRIGÉ)
// ============================================================
import { useState, useEffect } from "react";
import useAppStore from "../../store/useAppStore";

const FONT = "'Raleway', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
<<<<<<< HEAD

const C = {
  navy:     "#1B2559",
  magenta:  "#E7398B",
  rose:     "#F472B6",
  lavender: "#E8EAF6",
  muted:    "#8892B0",
  white:    "#FFFFFF",
  darkBlue: "#2a326e",
};

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;
// ── Fetch du statut — ALIGNÉ sur la réponse réelle de backend/routes/track.js ──
// Le backend renvoie : { code, reference, client, adresse, ville, etat_brut,
//                         pct, label, color, date_creation, agence_actuelle, raw }
const fetchTrackingStatus = async (trackingCode) => {
  try {
    const res = await fetch(`${API_URL}/api/track/${trackingCode.trim()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.code) return data; // ✅ champ réellement renvoyé par le backend
    return null;
  } catch (err) {
    console.error("Track fetch error:", err);
    return null;
  }
};

const WAYPOINTS = [
  { pct: 0,   x: 8,  y: 72, label: "Départ"  },
  { pct: 33,  x: 32, y: 45, label: "En route" },
  { pct: 66,  x: 62, y: 30, label: "Proche"   },
  { pct: 100, x: 88, y: 55, label: "Arrivée"  },
];

const getMotoPosition = (pct) => {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    if (pct >= a.pct && pct <= b.pct) {
      const t = (pct - a.pct) / (b.pct - a.pct);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return { x: WAYPOINTS[WAYPOINTS.length - 1].x, y: WAYPOINTS[WAYPOINTS.length - 1].y };
};

const MotoTracker = ({ pct }) => {
  const [displayPct, setDisplayPct] = useState(0);
  const [isMobile,   setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPct(pct), 400);
    return () => clearTimeout(timer);
  }, [pct]);

  const motoPos  = getMotoPosition(displayPct);
  const isMoving = displayPct > 0 && displayPct < 100;
  const isDone   = displayPct >= 100;

  const motoW   = isMobile ? 120 : 480;
  const shadowW = isMobile ? 50  : 180;
  const shadowH = isMobile ? 6   : 14;

  return (
    <div style={{
      background: "rgba(255,255,255,0.97)",
      borderRadius: 24,
      border: `1px solid ${C.lavender}`,
      boxShadow: "0 8px 40px rgba(27,37,89,0.08)",
      overflow: "hidden",
      marginBottom: 20,
    }}>
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${C.magenta}, ${C.rose}, #a78bfa, ${C.magenta})`,
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
      }}/>

      <div style={{ position: "relative", width: "100%", paddingBottom: isMobile ? "75%" : "65%", overflow: "hidden" }}>

        <img
          src="/cart.png"
          alt="carte"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }}
        />

        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.05)" }}/>

        {/* ✅ FIX : viewBox 0-100 + coordonnées SANS % */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <polyline
            points={WAYPOINTS.map(w => `${w.x},${w.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth={isMobile ? "0.6" : "1"}
            strokeDasharray={isMobile ? "2,1.5" : "3,2"}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {WAYPOINTS.slice(0, -1).map((a, i) => {
            const b = WAYPOINTS[i + 1];
            if (displayPct < a.pct) return null;
            const t  = Math.min(1, (displayPct - a.pct) / (b.pct - a.pct));
            const ex = a.x + (b.x - a.x) * t;
            const ey = a.y + (b.y - a.y) * t;
            return (
              <line key={i}
                x1={a.x} y1={a.y}
                x2={ex}  y2={ey}
                stroke={C.magenta}
                strokeWidth={isMobile ? "0.7" : "1.2"}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {WAYPOINTS.map((wp, i) => {
          const reached = displayPct >= wp.pct;
          const dotSize = isMobile ? 20 : 32;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${wp.x}%`, top: `${wp.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}>
              <div style={{
                width: dotSize, height: dotSize, borderRadius: "50%",
                background: reached
                  ? `linear-gradient(135deg, ${C.magenta}, ${C.rose})`
                  : "rgba(255,255,255,0.92)",
                border: `${isMobile ? 2 : 3}px solid ${reached ? C.magenta : "rgba(255,255,255,0.7)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMobile ? 8 : 12, fontWeight: 800,
                color: reached ? "#fff" : C.muted,
                boxShadow: reached
                  ? `0 0 0 ${isMobile ? 3 : 5}px ${C.magenta}30, 0 2px 8px rgba(0,0,0,0.2)`
                  : "0 2px 6px rgba(0,0,0,0.15)",
                transition: "all .5s ease",
              }}>
                {reached ? "✓" : i + 1}
              </div>

              <div style={{
                position: "absolute",
                top: dotSize + (isMobile ? 4 : 8),
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.95)",
                borderRadius: isMobile ? 5 : 8,
                padding: isMobile ? "2px 6px" : "4px 12px",
                fontSize: isMobile ? 9 : 13,
                fontWeight: 800,
                color: reached ? C.magenta : C.muted,
                fontFamily: FONT,
                whiteSpace: "nowrap",
                boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
              }}>
                {wp.label}
              </div>
            </div>
          );
        })}

        <div style={{
          position: "absolute",
          left: `${motoPos.x}%`,
          top:  `${motoPos.y}%`,
          transform: "translate(-50%, -100%)",
          transition: "left 1.4s cubic-bezier(.4,0,.2,1), top 1.4s cubic-bezier(.4,0,.2,1)",
          zIndex: 10,
          filter: "drop-shadow(0 10px 20px rgba(231,57,139,0.65))",
          animation: isMoving ? "motoBounce 0.7s ease-in-out infinite" : "none",
        }}>
          <img
            src="/moto.png"
            alt="moto"
            style={{ width: motoW, height: "auto", display: "block" }}
          />
          <div style={{
            width: shadowW, height: shadowH,
            background: "rgba(231,57,139,0.25)",
            borderRadius: "50%",
            filter: "blur(8px)",
            margin: "4px auto 0",
          }}/>
        </div>

        {isMoving && (
          <div style={{
            position: "absolute",
            left: `${Math.max(2, motoPos.x - 8)}%`,
            top:  `${motoPos.y}%`,
            transform: "translate(-50%, -75%)",
            fontSize: isMobile ? 14 : 28,
            opacity: 0.65,
            animation: "puffAway 1.2s ease-out infinite",
            zIndex: 9,
          }}>💨</div>
        )}

        {isDone && (
          <div style={{
            position: "absolute",
            bottom: isMobile ? 10 : 16, left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(16,185,129,0.95)",
            color: "#fff", borderRadius: 20,
            padding: isMobile ? "6px 14px" : "10px 24px",
            fontSize: isMobile ? 11 : 14, fontWeight: 800,
            fontFamily: FONT,
            boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
            zIndex: 10, whiteSpace: "nowrap",
            letterSpacing: ".02em",
          }}>
            Colis livré avec succès !
=======

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
>>>>>>> frontend
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
<<<<<<< HEAD
        @keyframes motoBounce { 0%,100%{transform:translate(-50%,-100%);} 50%{transform:translate(-50%,-112%);} }
        @keyframes puffAway   { 0%{opacity:.65;transform:translate(-50%,-75%) scale(1);} 100%{opacity:0;transform:translate(-120%,-130%) scale(1.6);} }
        @keyframes shimmer    { 0%{background-position:0% 0%;} 100%{background-position:200% 0%;} }
        @keyframes fadeIn     { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
=======
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
>>>>>>> frontend
  );
};

// ── PAGE PRINCIPALE ───────────────────────────────────────
const TrackPage = () => {
  const trackingNumber    = useAppStore(s => s.trackingNumber);
  const setTrackingNumber = useAppStore(s => s.setTrackingNumber);

  const [input,    setInput]    = useState(trackingNumber || "");
  const [adexData, setAdexData] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const doSearch = async (code) => {
    if (!code?.trim()) return;
    setLoading(true);
    setError(null);
    setAdexData(null);
    const result = await fetchTrackingStatus(code.trim());
    if (result) setAdexData(result);
    else setError("Commande introuvable. Vérifiez le numéro et réessayez.");
    setLoading(false);
  };

  useEffect(() => {
    if (trackingNumber) {
      setInput(trackingNumber);
      setTrackingNumber(null);
      doSearch(trackingNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ pct/label/color viennent DÉJÀ calculés depuis le backend (mapEtat côté track.js)
  const statusInfo = adexData
    ? { pct: adexData.pct ?? 0, label: adexData.label ?? "", color: adexData.color ?? C.muted }
    : { pct: 0, label: "", color: C.muted };

  return (
    <>
      <div style={{
        position:"fixed",top:0,left:0,right:0,bottom:0,
        backgroundImage:"url('/colis.png')",
        backgroundSize:"cover",backgroundPosition:"center",
        backgroundRepeat:"no-repeat",zIndex:-1,
      }}/>
      <div style={{
        position:"fixed",top:0,left:0,right:0,bottom:0,
        background:"linear-gradient(135deg, rgba(189,189,189,0.5) 0%, rgba(196,196,219,0) 45%, rgba(231,57,139,0.32) 100%)",
        zIndex:-1,
      }}/>

      <div style={{fontFamily:FONT,minHeight:"100vh",position:"relative",zIndex:1}}>
        <div style={{height:"var(--header-h, 80px)"}}/>

        {/* HERO */}
        <div style={{padding:isMobile ? "5px 16px 24px" : "5px 24px 40px"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <h1 style={{
              fontFamily:FONT,
              fontSize: isMobile ? "clamp(22px,6vw,28px)" : "clamp(28px,5vw,44px)",
              fontWeight:700,color:C.darkBlue,margin:"0 0 8px",
            }}>
              Suivre ma commande
            </h1>
            <p style={{color:C.darkBlue,fontSize:isMobile ? 13 : 15,margin:"0 0 20px",lineHeight:1.5,opacity:0.85}}>
              Entrez votre numéro de colis.
            </p>

            <div style={{
              display:"flex",gap:8,
              background:"rgba(255,255,255,0.93)",
              backdropFilter:"blur(12px)",
              border:"1.5px solid rgba(255,255,255,0.5)",
              borderRadius:16,
              padding:isMobile ? "6px 6px 6px 14px" : "8px 8px 8px 20px",
              boxShadow:"0 8px 40px rgba(0,0,0,0.13)",
            }}>
              <svg style={{flexShrink:0,alignSelf:"center"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.darkBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(input)}
                placeholder={isMobile ? "N° de colis" : "Ex : 26062202140013"}
                style={{
                  flex:1,background:"transparent",border:"none",outline:"none",
                  color:C.darkBlue,
                  fontSize: isMobile ? 13 : 16,
                  fontFamily:FONT,
                  minWidth:0,
                }}
              />
              <button
                onClick={() => doSearch(input)}
                disabled={loading}
                style={{
                  background:`linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
                  color:"#fff",border:"none",
                  borderRadius:12,
                  padding: isMobile ? "10px 14px" : "13px 28px",
                  fontSize: isMobile ? 12 : 14,
                  fontWeight:700,
                  fontFamily:FONT,cursor:"pointer",
                  boxShadow:`0 4px 20px ${C.magenta}55`,
                  flexShrink:0,opacity:loading?0.7:1,
                  transition:"opacity .2s",
                  whiteSpace:"nowrap",
                }}
              >
                {loading ? "..." : "Rechercher"}
              </button>
            </div>
            <style>{`input::placeholder{color:rgba(42,50,110,0.5);}`}</style>
          </div>
        </div>

        {/* Résultats */}
        <div style={{maxWidth:900,margin:"0 auto",padding: isMobile ? "0 16px 40px" : "0 24px 60px"}}>

          {loading && (
            <div style={{textAlign:"center",padding:"40px",color:C.magenta,fontFamily:FONT,fontSize:15,fontWeight:700}}>
              Localisation du colis...
            </div>
          )}

          {error && !loading && (
            <div style={{
              textAlign:"center",padding: isMobile ? "32px 20px" : "48px 32px",
              background:"rgba(255,255,255,0.95)",
              borderRadius:24,border:`1px solid ${C.lavender}`,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:12}}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <h3 style={{fontSize: isMobile ? 16 : 18,fontWeight:800,color:C.navy,margin:"0 0 8px",fontFamily:FONT}}>
                Commande introuvable
              </h3>
              <p style={{fontSize: isMobile ? 13 : 14,color:C.muted,fontFamily:FONT,margin:0,lineHeight:1.6}}>
                {error}
              </p>
            </div>
          )}

          {adexData && !loading && (
            <div style={{animation:"fadeIn .4s ease"}}>
              <div style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                marginBottom:12,flexWrap:"wrap",gap:6,
              }}>
                <p style={{fontSize: isMobile ? 12 : 13,fontWeight:700,color:C.darkBlue,fontFamily:FONT,margin:0}}>
                  Colis <strong style={{color:C.magenta}}>#{adexData.code || input}</strong>
                </p>
                {adexData.date_creation && (
                  <p style={{fontSize:11,color:C.muted,fontFamily:FONT,margin:0}}>
                    Créé le : {new Date(adexData.date_creation).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>

              <MotoTracker pct={statusInfo.pct} />

              <div style={{display:"grid",gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",gap:10}}>
                {adexData.etat_brut && (
                  <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.95)",borderRadius:12,border:`1px solid ${C.lavender}`}}>
                    <p style={{fontSize:9,fontWeight:700,color:C.muted,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".06em"}}>État</p>
                    <p style={{fontSize: isMobile ? 12 : 13,fontWeight:700,color:C.navy,margin:0,fontFamily:FONT}}>{adexData.etat_brut}</p>
                  </div>
                )}
                {adexData.ville && (
                  <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.95)",borderRadius:12,border:`1px solid ${C.lavender}`}}>
                    <p style={{fontSize:9,fontWeight:700,color:C.muted,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".06em"}}>Ville</p>
                    <p style={{fontSize: isMobile ? 12 : 13,fontWeight:700,color:C.navy,margin:0,fontFamily:FONT}}>{adexData.ville}</p>
                  </div>
                )}
                {adexData.agence_actuelle && (
                  <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.95)",borderRadius:12,border:`1px solid ${C.lavender}`,gridColumn:"1/-1"}}>
                    <p style={{fontSize:9,fontWeight:700,color:C.muted,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".06em"}}>Agence actuelle</p>
                    <p style={{fontSize: isMobile ? 12 : 13,fontWeight:600,color:C.navy,margin:0,fontFamily:FONT}}>{adexData.agence_actuelle}</p>
                  </div>
                )}
                {adexData.adresse && (
                  <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.95)",borderRadius:12,border:`1px solid ${C.lavender}`,gridColumn:"1/-1"}}>
                    <p style={{fontSize:9,fontWeight:700,color:C.muted,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:".06em"}}>Adresse</p>
                    <p style={{fontSize: isMobile ? 12 : 13,fontWeight:600,color:C.navy,margin:0,fontFamily:FONT}}>{adexData.adresse}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { TrackPage };
export default TrackPage;