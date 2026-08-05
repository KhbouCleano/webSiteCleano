// ── Composant MotoTracker avec vraie carte ────────────────
// Remplace l'ancien MotoTracker dans TrackPage.jsx

const MotoTracker = ({ pct, statusInfo }) => {
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPct(pct), 400);
    return () => clearTimeout(timer);
  }, [pct]);

  // ── 4 positions sur la carte (en %) ──────────────────────
  // Position X (gauche→droite) et Y (haut→bas) sur l'image
  const WAYPOINTS = [
    { pct: 0,   x: 8,   y: 72, label: "Départ",   icon: "🏭" },
    { pct: 33,  x: 32,  y: 45, label: "En route",  icon: "🛣️" },
    { pct: 66,  x: 62,  y: 30, label: "Proche",    icon: "📍" },
    { pct: 100, x: 88,  y: 55, label: "Arrivée",   icon: "🏠" },
  ];

  // Interpoler la position de la moto entre les waypoints
  const getMotoPosition = (pct) => {
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      const a = WAYPOINTS[i];
      const b = WAYPOINTS[i + 1];
      if (pct >= a.pct && pct <= b.pct) {
        const t = (pct - a.pct) / (b.pct - a.pct);
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        };
      }
    }
    return { x: WAYPOINTS[WAYPOINTS.length - 1].x, y: WAYPOINTS[WAYPOINTS.length - 1].y };
  };

  const motoPos = getMotoPosition(displayPct);
  const isMoving = displayPct > 0 && displayPct < 100;
  const isDone   = displayPct >= 100;

  return (
    <div style={{
      background: "rgba(255,255,255,0.97)",
      borderRadius: 24,
      border: `1px solid ${C.lavender}`,
      boxShadow: "0 8px 40px rgba(27,37,89,0.08)",
      overflow: "hidden",
      marginBottom: 20,
    }}>
      {/* Bande colorée animée */}
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${C.magenta}, ${C.rose}, #a78bfa, ${C.magenta})`,
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
      }}/>

      {/* Header statut */}
      <div style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${C.lavender}`,
        flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: `${statusInfo.color}20`,
            border: `2px solid ${statusInfo.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            {statusInfo.icon}
          </div>
          <div>
            <p style={{ fontSize: 11, color: C.muted, margin: "0 0 2px", fontFamily: FONT, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
              Statut actuel
            </p>
            <p style={{ fontSize: 17, fontWeight: 900, color: statusInfo.color, margin: 0, fontFamily: FONT }}>
              {statusInfo.label}
            </p>
          </div>
        </div>
        <div style={{
          background: `${statusInfo.color}15`,
          borderRadius: 20, padding: "5px 14px",
          fontSize: 13, fontWeight: 700, color: statusInfo.color, fontFamily: FONT,
        }}>
          {Math.round(displayPct)}% du trajet
        </div>
      </div>

      {/* ── CARTE avec moto ── */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "52%", overflow: "hidden" }}>

        {/* Image carte en background */}
        <img
          src="/map-bg.jpg"
          alt="carte"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Overlay léger pour lisibilité */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(0.5px)",
        }}/>

        {/* Ligne de trajet entre les waypoints */}
        <svg style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          overflow: "visible",
        }}>
          {/* Ligne totale (grise) */}
          <polyline
            points={WAYPOINTS.map(w => `${w.x}%,${w.y}%`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="3"
            strokeDasharray="8,6"
          />
          {/* Ligne progressée (magenta) */}
          {WAYPOINTS.slice(0, -1).map((a, i) => {
            const b = WAYPOINTS[i + 1];
            if (displayPct < a.pct) return null;
            const segPct = Math.min(1, (displayPct - a.pct) / (b.pct - a.pct));
            const ex = a.x + (b.x - a.x) * segPct;
            const ey = a.y + (b.y - a.y) * segPct;
            return (
              <line
                key={i}
                x1={`${a.x}%`} y1={`${a.y}%`}
                x2={`${ex}%`}  y2={`${ey}%`}
                stroke={C.magenta}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Points d'étape sur la carte */}
        {WAYPOINTS.map((wp, i) => {
          const reached = displayPct >= wp.pct;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${wp.x}%`, top: `${wp.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}>
              {/* Cercle point */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: reached ? `linear-gradient(135deg, ${C.magenta}, ${C.rose})` : "rgba(255,255,255,0.9)",
                border: `2.5px solid ${reached ? C.magenta : "rgba(255,255,255,0.8)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: reached ? "#fff" : C.muted,
                boxShadow: reached ? `0 0 0 4px ${C.magenta}33, 0 2px 8px rgba(0,0,0,0.2)` : "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all .5s ease",
                backdropFilter: "blur(4px)",
              }}>
                {reached ? "✓" : wp.icon}
              </div>
              {/* Label */}
              <div style={{
                position: "absolute",
                top: 32, left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.92)",
                borderRadius: 6,
                padding: "2px 6px",
                fontSize: 9, fontWeight: 700,
                color: reached ? C.magenta : C.muted,
                fontFamily: FONT,
                whiteSpace: "nowrap",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                backdropFilter: "blur(4px)",
              }}>
                {wp.label}
              </div>
            </div>
          );
        })}

        {/* 🛵 MOTO image qui se déplace */}
        <div style={{
          position: "absolute",
          left: `${motoPos.x}%`,
          top:  `${motoPos.y}%`,
          transform: "translate(-50%, -100%)",
          transition: "left 1.4s cubic-bezier(.4,0,.2,1), top 1.4s cubic-bezier(.4,0,.2,1)",
          zIndex: 10,
          filter: "drop-shadow(0 6px 12px rgba(231,57,139,0.5))",
          animation: isMoving ? "motoBounce 0.7s ease-in-out infinite" : "none",
        }}>
          <img
            src="/moto.png"
            alt="moto livraison"
            style={{
              width: 70,
              height: "auto",
              display: "block",
            }}
            onError={(e) => {
              // Fallback emoji si l'image n'existe pas
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          {/* Fallback emoji */}
          <div style={{ display: "none", fontSize: 36 }}>🛵</div>

          {/* Ombre sous la moto */}
          <div style={{
            width: 50, height: 8,
            background: "rgba(231,57,139,0.3)",
            borderRadius: "50%",
            filter: "blur(4px)",
            margin: "0 auto",
            transform: "scaleX(0.8)",
          }}/>
        </div>

        {/* Nuage de poussière */}
        {isMoving && (
          <div style={{
            position: "absolute",
            left: `${Math.max(2, motoPos.x - 6)}%`,
            top:  `${motoPos.y}%`,
            transform: "translate(-50%, -80%)",
            fontSize: 16, opacity: 0.7,
            animation: "puffAway 1.2s ease-out infinite",
            zIndex: 9,
          }}>
            💨
          </div>
        )}

        {/* Badge livré */}
        {isDone && (
          <div style={{
            position: "absolute",
            bottom: 16, left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(16,185,129,0.95)",
            color: "#fff",
            borderRadius: 20,
            padding: "8px 20px",
            fontSize: 13, fontWeight: 800,
            fontFamily: FONT,
            boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}>
            🎉 Colis livré avec succès !
          </div>
        )}
      </div>

      <style>{`
        @keyframes motoBounce {
          0%,100% { transform: translate(-50%, -100%); }
          50%      { transform: translate(-50%, -108%); }
        }
        @keyframes puffAway {
          0%   { opacity: 0.7; transform: translate(-50%, -80%) scale(1); }
          100% { opacity: 0;   transform: translate(-120%, -120%) scale(1.5); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
