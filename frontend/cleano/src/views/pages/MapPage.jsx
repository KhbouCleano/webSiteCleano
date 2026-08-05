// ============================================================
// src/views/pages/MapPage.jsx — Responsive
// ============================================================
import { useState, useRef, useEffect, useMemo } from "react";
import { loadGouvernorats } from "../../data/gouvernoratsStore";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy:     "#1B2559",
  magenta:  "#E7398B",
  rose:     "#F472B6",
  lavender: "#E8EAF6",
  muted:    "#8892B0",
  white:    "#FFFFFF",
};

// ── Noms des gouvernorats (tels qu'utilisés dans le SVG) ────────
// Les points de vente eux-mêmes viennent maintenant du store admin
// (géré depuis "Gouvernorats" / "Points de vente" dans le tableau de bord),
// et non plus d'une liste codée en dur ici.
const GOV_META = {
  tunis:      "Tunis",
  ariana:     "Ariana",
  benarous:   "Ben Arous",
  manouba:    "Manouba",
  nabeul:     "Nabeul",
  zaghouan:   "Zaghouan",
  bizerte:    "Bizerte",
  beja:       "Béja",
  jendouba:   "Jendouba",
  lekef:      "Le Kef",
  siliana:    "Siliana",
  kairouan:   "Kairouan",
  sousse:     "Sousse",
  monastir:   "Monastir",
  mahdia:     "Mahdia",
  sfax:       "Sfax",
  kasserine:  "Kasserine",
  sididouzid: "Sidi Bouzid",
  gafsa:      "Gafsa",
  tozeur:     "Tozeur",
  kebili:     "Kébili",
  gabes:      "Gabès",
  mednine:    "Médenine",
  tataouine:  "Tataouine",
};

// Normalise un nom pour le comparer sans accents/espaces/casse
// (ex: "Béja" ↔ "beja", "Le Kef" ↔ "Kef", "Ben Arous" ↔ "BenArous")
const normalizeGovName = (s) =>
  (s ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^le\s+/, "")
    .replace(/[\s'-]/g, "");

const GOV_IDS = Object.keys(GOV_META);

const STYLES = `
  @keyframes pinDrop {
    0%   { transform: translate(-50%,-160%) scale(.5); opacity:0; }
    65%  { transform: translate(-50%,-92%)  scale(1.18); opacity:1; }
    82%  { transform: translate(-50%,-106%) scale(.94); }
    100% { transform: translate(-50%,-100%) scale(1); opacity:1; }
  }
  @keyframes pinPulse {
    0%,100% { transform:translateX(-50%) scale(1);   opacity:.4; }
    50%     { transform:translateX(-50%) scale(1.8); opacity:.1; }
  }
  @keyframes ripple {
    0%   { transform:translate(-50%,-50%) scale(0);   opacity:.65; }
    100% { transform:translate(-50%,-50%) scale(3.5); opacity:0; }
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .map-panel-card {
    background: rgba(255,255,255,0.97);
    border-radius: 16px;
    padding: 18px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(231,57,139,0.10);
    border: 1px solid rgba(255,255,255,0.8);
    animation: slideUp .3s ease both;
  }
  /* ── Mobile uniquement ── */
  @media (max-width: 768px) {
    .map-grid { grid-template-columns: 1fr !important; }
    .map-panel { padding-top: 0 !important; }
    .map-svg-wrap { width: 100% !important; left: 0 !important; top: 0 !important; }
    .map-svg-outer { width: 100% !important; overflow: hidden !important; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("map-page-styles")) {
  const s = document.createElement("style");
  s.id = "map-page-styles";
  s.textContent = STYLES;
  document.head.appendChild(s);
}

// ── TunisiaMap ──────────────────────────────────────────────
const TunisiaMap = ({ selected, hovered, onSelect, onHover, onLeave, isMobile }) => {
  const containerRef = useRef(null);
  const svgRef       = useRef(null);
  const wrapRef      = useRef(null);
  const loadedRef    = useRef(false);
  const [pinPos, setPinPos] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loadedRef.current) return;
    loadedRef.current = true;

    fetch("/tunisia-governorates.svg")
      .then(r => r.text())
      .then(svgText => {
        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (!svg) return;
        svgRef.current = svg;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.cssText = "width:100%;height:auto;display:block;";
        const cp = svg.querySelector("#Copyright");
        if (cp) cp.style.display = "none";

        GOV_IDS.forEach(id => {
          const el = svg.querySelector(`#${id}`);
          if (!el) return;
          el.style.fill        = "#ffffff";
          el.style.stroke      = "#1B2559";
          el.style.strokeWidth = "0.7";
          el.style.cursor      = "pointer";
          el.style.transition  = "fill .18s, filter .18s";
          el.addEventListener("mouseenter", () => onHover(id));
          el.addEventListener("mouseleave", onLeave);
          el.addEventListener("click",      () => onSelect(id));
          el.addEventListener("touchend",   (e) => { e.preventDefault(); onSelect(id); });
        });
      })
      .catch(() => {
        container.innerHTML = `<p style="color:#E7398B;text-align:center;padding:20px;font-size:13px;">
          Placez <strong>tunisia-governorates.svg</strong> dans <code>/public/</code></p>`;
      });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    GOV_IDS.forEach(id => {
      const el = svg.querySelector(`#${id}`);
      if (!el) return;
      if (id === selected) {
        el.style.fill = "#E7398B";
        el.style.filter = "drop-shadow(0 2px 10px rgba(231,57,139,0.5))";
        el.style.strokeWidth = "1.4";
      } else if (id === hovered) {
        el.style.fill = "#93C5FD";
        el.style.filter = "drop-shadow(0 1px 4px rgba(147,197,253,0.4))";
        el.style.strokeWidth = "1";
      } else {
        el.style.fill = "#FFFFFF";
        el.style.filter = "none";
        el.style.strokeWidth = "0.7";
      }
    });

    if (selected && svgRef.current && wrapRef.current) {
      const el = svg.querySelector(`#${selected}`);
      if (!el) return;
      requestAnimationFrame(() => {
        try {
          const bbox    = el.getBBox();
          const svgRect = svg.getBoundingClientRect();
          const wrap    = wrapRef.current.getBoundingClientRect();
          const vb      = svg.viewBox.baseVal;
          if (!vb || vb.width === 0) return;
          const scaleX = svgRect.width  / vb.width;
          const scaleY = svgRect.height / vb.height;
          const cx = (bbox.x + bbox.width  / 2) * scaleX + (svgRect.left - wrap.left);
          const cy = (bbox.y + bbox.height / 2) * scaleY + (svgRect.top  - wrap.top);
          setPinPos({ x: (cx / wrap.width) * 100, y: (cy / wrap.height) * 100 });
        } catch (_) {}
      });
    } else {
      setPinPos(null);
    }
  }, [selected, hovered]);

  // ── Desktop : positions hardcodées originales ──
  // ── Mobile  : centré, pas de débordement ──
  return (
    <div ref={wrapRef} style={{ position: "relative", width: isMobile ? "100%" : "110%", overflow: isMobile ? "hidden" : "visible" }}>
      <div
        ref={containerRef}
        className="map-svg-wrap"
        style={isMobile ? {
          width: "100%",
          position: "relative",
          left: 0,
          top: 0,
        } : {
          width: "120%",
          position: "relative",
          left: "-30%",
          top: "-10rem",
        }}
      />
      {pinPos && (
        <div key={selected} style={{ position:"absolute", left:`${pinPos.x}%`, top:`${pinPos.y}%`, pointerEvents:"none", zIndex:10 }}>
          <div style={{ position:"absolute", left:"50%", top:"50%", width:52, height:52, borderRadius:"50%", border:"2px solid #E7398B", animation:"ripple 0.65s ease-out forwards" }}/>
          <div style={{ position:"absolute", left:"50%", bottom:0, transform:"translate(-50%,-100%)", animation:"pinDrop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <svg width="28" height="38" viewBox="0 0 30 40" fill="none">
              <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 40 15 40C15 40 30 26.25 30 15C30 6.72 23.28 0 15 0Z" fill="#E7398B"/>
              <circle cx="15" cy="15" r="6.5" fill="white" opacity="0.95"/>
              <circle cx="15" cy="15" r="3.8" fill="#E7398B"/>
            </svg>
          </div>
          <div style={{ position:"absolute", left:"50%", bottom:-5, width:16, height:5, borderRadius:"50%", background:"rgba(231,57,139,0.22)", animation:"pinPulse 1.6s ease-in-out infinite" }}/>
        </div>
      )}
    </div>
  );
};

// ── MapPage ─────────────────────────────────────────────────
const MapPage = () => {
  const [selected,   setSelected]   = useState(null);
  const [hovered,    setHovered]    = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMobile,   setIsMobile]   = useState(false);
  const mapRef = useRef(null);

  // ── Points de vente gérés depuis l'admin (Gouvernorats / Points de vente) ──
  const [govs, setGovs] = useState(loadGouvernorats());
  useEffect(() => {
    const refresh = () => setGovs(loadGouvernorats());
    window.addEventListener("gouvernorats-updated", refresh);
    return () => window.removeEventListener("gouvernorats-updated", refresh);
  }, []);

  // Associe chaque id de région du SVG (ex: "beja") au gouvernorat admin
  // correspondant (ex: { name:"Béja", points:[...] }), par nom normalisé.
  const govById = useMemo(() => {
    const map = {};
    GOV_IDS.forEach(id => {
      const target = normalizeGovName(GOV_META[id]);
      map[id] = govs.find(g => normalizeGovName(g.name) === target) ?? null;
    });
    return map;
  }, [govs]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = (e) => {
    if (!mapRef.current) return;
    const r = mapRef.current.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const data = selected ? { name: GOV_META[selected], points: govById[selected]?.points ?? [] } : null;

  return (
    <div style={{
      fontFamily:           FONT,
      minHeight:            "100vh",
      position:             "relative",
      marginTop:            "-72px",
      backgroundImage:      "url('/aze.png')",
      backgroundSize:       "cover",
      backgroundPosition:   "center",
      backgroundAttachment: isMobile ? "scroll" : "fixed",
    }}>

      {/* Voile */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "linear-gradient(160deg, rgba(27,37,89,0.72) 0%, rgba(27,37,89,0.55) 40%, rgba(231,57,139,0.28) 100%)",
      }}/>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          padding: isMobile ? "100px 20px 20px" : "120px 40px 16px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: FONT,
            fontSize: isMobile ? 26 : 36,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 8px",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            Nos points de vente
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: isMobile ? 13 : 15,
            margin: 0,
          }}>
            {isMobile ? "Tapez" : "Cliquez"} sur un gouvernorat pour voir les points disponibles
          </p>
        </div>

        {/* Grille carte + panel */}
        <div className="map-grid" style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "0 16px 40px" : "0 24px 64px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "65fr 35fr",
          gap: isMobile ? 20 : 28,
          alignItems: "start",
        }}>

          {/* Carte */}
          <div style={{ overflow: isMobile ? "hidden" : "visible" }}>
            <div ref={mapRef} style={{ position: "relative" }} onMouseMove={handleMouseMove}>
              <TunisiaMap
                selected={selected}
                hovered={hovered}
                isMobile={isMobile}
                onSelect={(key) => setSelected(key === selected ? null : key)}
                onHover={(key) => setHovered(key)}
                onLeave={() => setHovered(null)}
              />
              {hovered && !isMobile && (
                <div style={{
                  position: "absolute",
                  left: tooltipPos.x + 14,
                  top: Math.max(4, tooltipPos.y - 10),
                  background: "#fff",
                  border: `2px solid ${C.magenta}`,
                  borderRadius: 10, padding: "7px 12px",
                  boxShadow: "0 4px 20px rgba(231,57,139,0.18)",
                  pointerEvents: "none", zIndex: 30, minWidth: 170,
                }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: C.magenta, margin: "0 0 2px", fontFamily: FONT }}>
                    {GOV_META[hovered]}
                  </p>
                  <p style={{ fontSize: 10, color: C.muted, margin: 0, fontFamily: FONT }}>
                    {govById[hovered]?.points.length ?? 0} point{(govById[hovered]?.points.length ?? 0) > 1 ? "s" : ""} de vente
                  </p>
                </div>
              )}
            </div>

            {/* Légende */}
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
              {[{ color: "#E7398B", label: "Sélectionné" }, { color: "#93C5FD", label: "Survolé" }, { color: "#FFFFFF", label: "Disponible" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color, border: "1px solid rgba(255,255,255,0.3)" }}/>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel info */}
          <div className="map-panel" style={{ paddingTop: isMobile ? 0 : 20 }}>
            {!selected ? (
              <div className="map-panel-card" style={{ textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `${C.magenta}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3,7 9,4 15,7 21,4 21,17 15,20 9,17 3,20"/>
                    <line x1="9" y1="4" x2="9" y2="17"/>
                    <line x1="15" y1="7" x2="15" y2="20"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: C.navy, margin: "0 0 8px", fontFamily: FONT }}>
                  Choisissez un gouvernorat
                </h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                  {isMobile ? "Tapez" : "Cliquez"} sur une région pour voir les points de vente Cleano.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
                  borderRadius: 16, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 12,
                  boxShadow: "0 12px 36px rgba(231,57,139,0.35)",
                  animation: "slideUp .3s ease both",
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: ".1em" }}>
                      Gouvernorat
                    </p>
                    <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: "#fff", margin: 0, fontFamily: FONT }}>
                      {data.name}
                    </h2>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "2px 0 0" }}>
                      {data.points.length} point{data.points.length > 1 ? "s" : ""} de vente
                    </p>
                  </div>
                </div>

                {data.points.length === 0 ? (
                  <div className="map-panel-card" style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 12.5, color: C.muted, margin: 0, lineHeight: 1.6 }}>
                      Aucun point de vente enregistré pour ce gouvernorat pour le moment.
                    </p>
                  </div>
                ) : data.points.map((pt, i) => (
                  <div key={i} className="map-panel-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: `${C.magenta}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, color: C.magenta, flexShrink: 0,
                      }}>{i + 1}</div>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: C.navy, margin: 0 }}>{pt.ville}</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingLeft: 34, marginBottom: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{pt.adresse}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 34 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <a href={`tel:${pt.tel.replace(/\s|\+/g, "")}`} style={{ fontSize: 12, color: C.magenta, fontWeight: 700, textDecoration: "none" }}>
                        {pt.tel}
                      </a>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1.5px solid rgba(255,255,255,0.6)",
                    borderRadius: 50, padding: "9px 20px",
                    fontSize: 12, fontWeight: 600, color: C.muted,
                    cursor: "pointer", fontFamily: FONT, width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Effacer la sélection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;