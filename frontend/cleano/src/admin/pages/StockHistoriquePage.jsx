// src/admin/pages/StockHistoriquePage.jsx
import { useState, useEffect, useCallback, useMemo } from "react";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy:     "#1B2559",
  magenta:  "#E7398B",
  lavender: "#E8EAF6",
  muted:    "#8892B0",
  white:    "#FFFFFF",
  offwhite: "#F8F9FF",
  green:    "#10B981",
  amber:    "#F59E0B",
  red:      "#EF4444",
  blue:     "#3B82F6",
  purple:   "#8B5CF6",
};

// ── Hook responsive ───────────────────────────────────────────
const useIsMobile = (bp = 640) => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return mobile;
};

// ── Icons ─────────────────────────────────────────────────────
const IcoHistory = (color = C.purple, s = 22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="12 8 12 12 14 14"/>
    <path d="M3.05 11a9 9 0 1 0 .5-4"/>
    <polyline points="3 3 3 7 7 7"/>
  </svg>
);
const IcoSearch = (s = 15) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoFilter = (s = 15) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const IcoCalendar = (color = C.muted, s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoClock = (color = C.muted, s = 13) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoTrend = (up, s = 12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={up ? C.green : C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {up
      ? <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>
      : <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>
    }
  </svg>
);
const IcoEmpty = (s = 36) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#DDDEE8" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcoExport = (s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoSpinner = (s = 26) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.lavender} strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IcoChevronRight = (s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Type badges ──────────────────────────────────────────────
const TYPE_CONFIG = {
  entree:     { label: "Entrée",     bg: "#D1FAE5", color: C.green,  border: "#6EE7B7" },
  sortie:     { label: "Sortie",     bg: "#FEE2E2", color: C.red,    border: "#FCA5A5" },
  correction: { label: "Correction", bg: "#FEF3C7", color: C.amber,  border: "#FCD34D" },
};

const TypeBadge = ({ type }) => {
  const cfg = TYPE_CONFIG[type] ?? { label: type, bg: C.lavender, color: C.muted, border: C.lavender };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: 6, padding: "3px 9px",
      fontSize: 11, fontWeight: 700, fontFamily: FONT,
    }}>
      {cfg.label}
    </span>
  );
};

const PER_PAGE = 8;

// ── Stat card ─────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: C.white, borderRadius: 14, border: `1px solid ${C.lavender}`,
    padding: "18px 20px", position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "14px 14px 0 0" }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 900, color: C.navy, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</div>}
  </div>
);

// ── Mobile Card ──────────────────────────────────────────────
const MobileCard = ({ row }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_CONFIG[row.type] ?? { label: row.type, bg: C.lavender, color: C.muted };

  return (
    <div style={{
      background: C.white, borderRadius: 12, border: `1px solid ${C.lavender}`,
      padding: "14px 16px", marginBottom: 10,
      cursor: "pointer",
    }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Image */}
        {row.image && (
          <img src={row.image} alt={row.produit} style={{
            width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0,
          }} onError={e => e.target.style.display = "none"} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {row.produit}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.muted }}>{row.ref}</span>
            <TypeBadge type={row.type} />
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontSize: 16, fontWeight: 800,
            color: row.qte > 0 ? C.green : row.qte < 0 ? C.red : C.muted,
          }}>
            {row.qte > 0 ? `+${row.qte}` : row.qte === 0 ? "—" : row.qte}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Stock: {row.stock}</div>
        </div>
        <div style={{ flexShrink: 0, color: C.muted, transition: "transform .2s", transform: expanded ? "rotate(90deg)" : "none" }}>
          {IcoChevronRight(16)}
        </div>
      </div>

      {expanded && (
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.lavender}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>Date</div>
            <div style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>
              {new Date(row.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>Heure</div>
            <div style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>{row.time}</div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>Motif</div>
            <div style={{ fontSize: 13, color: C.navy }}>{row.motif}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>Opérateur</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.magenta}, ${C.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 9, fontWeight: 700, flexShrink: 0,
              }}>
                {row.user.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <span style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>{row.user}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>Stock après</div>
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: row.stock <= 10 ? "#FEF2F2" : row.stock <= 20 ? "#FEF3C7" : "#F0FDF4",
              color: row.stock <= 10 ? C.red : row.stock <= 20 ? C.amber : C.green,
              border: `1px solid ${row.stock <= 10 ? "#FCA5A5" : row.stock <= 20 ? "#FCD34D" : "#86EFAC"}`,
              borderRadius: 6, padding: "2px 10px",
              fontSize: 13, fontWeight: 700,
            }}>
              {row.stock}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Adapter : ligne API → ligne d'affichage ──────────────────
const toRow = (m) => {
  const dt = new Date(m.created_at);
  const qte =
    m.type === "entree" ? m.quantity :
    m.type === "sortie" ? -m.quantity :
    (m.stock_after - m.stock_before);

  return {
    id:      m.id,
    date:    dt.toISOString().slice(0, 10),
    time:    dt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    produit: m.product_name ?? "Produit supprimé",
    image:   m.product_image ?? "",
    ref:     `PRD-${String(m.product_id).padStart(3, "0")}`,
    type:    m.type,
    qte,
    stock:   m.stock_after,
    motif:   m.note || (m.type === "entree" ? "Entrée de stock" : m.type === "sortie" ? "Sortie de stock" : "Correction d'inventaire"),
    user:    "Admin",
  };
};

// ── Main page ─────────────────────────────────────────────────
export default function StockHistoriquePage() {
  const isMobile = useIsMobile(640);
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const [search, setSearch]   = useState("");
  const [typeFilter, setType] = useState("tous");
  const [dateFrom, setFrom]   = useState("");
  const [dateTo, setTo]       = useState("");
  const [page, setPage]       = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/stock/historique?limit=500");
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setRows((data.movements ?? []).map(toRow));
    } catch (_) {
      setRows([]);
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return rows.filter(row => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || row.produit.toLowerCase().includes(q)
        || row.ref.toLowerCase().includes(q)
        || row.motif.toLowerCase().includes(q)
        || row.user.toLowerCase().includes(q);
      const matchType = typeFilter === "tous" || row.type === typeFilter;
      const matchFrom = !dateFrom || row.date >= dateFrom;
      const matchTo   = !dateTo   || row.date <= dateTo;
      return matchSearch && matchType && matchFrom && matchTo;
    });
  }, [rows, search, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalEntrees = rows.filter(r => r.type === "entree").reduce((a, r) => a + r.qte, 0);
  const totalSorties = Math.abs(rows.filter(r => r.type === "sortie").reduce((a, r) => a + r.qte, 0));
  const totalMouvements = rows.length;

  // Group paginated rows by date (for desktop)
  const grouped = paginated.reduce((acc, row) => {
    (acc[row.date] = acc[row.date] ?? []).push(row);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatDate = (d) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const resetFilters = () => { setSearch(""); setType("tous"); setFrom(""); setTo(""); setPage(1); };

  const exportCsv = () => {
    const header = ["Date", "Heure", "Produit", "Référence", "Type", "Quantité", "Stock après", "Motif", "Opérateur"];
    const lines = filtered.map(r => [
      r.date, r.time, r.produit, r.ref, TYPE_CONFIG[r.type]?.label ?? r.type,
      r.qte, r.stock, r.motif, r.user,
    ]);
    const csv = [header, ...lines]
      .map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historique-stock-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: `${C.purple}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {IcoHistory(C.purple, 22)}
            </div>
            <div>
              <h1 style={{ fontSize: isMobile ? 18 : 21, fontWeight: 900, color: C.navy, margin: 0 }}>Historique du stock</h1>
              <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>
                {filtered.length} mouvement{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button onClick={exportCsv} disabled={filtered.length === 0} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: C.offwhite, border: `1.5px solid ${C.lavender}`,
            borderRadius: 10, padding: "9px 16px",
            fontSize: 12, fontWeight: 700, color: C.muted,
            cursor: filtered.length === 0 ? "default" : "pointer",
            opacity: filtered.length === 0 ? 0.5 : 1,
            fontFamily: FONT, width: isMobile ? "100%" : "auto",
            justifyContent: "center",
          }}>
            {IcoExport(13)} Exporter CSV
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, marginBottom: 28,
      }}>
        <StatCard label="Mouvements" value={totalMouvements} sub="total enregistrés" color={C.purple} icon={IcoHistory(C.purple, 17)} />
        <StatCard label="Entrées" value={`+${totalEntrees}`} sub="unités reçues" color={C.green} icon={IcoTrend(true, 17)} />
        <StatCard label="Sorties" value={`-${totalSorties}`} sub="unités sorties" color={C.red} icon={IcoTrend(false, 17)} />
        <StatCard
          label="Solde net"
          value={totalEntrees - totalSorties > 0 ? `+${totalEntrees - totalSorties}` : totalEntrees - totalSorties}
          sub="variation totale"
          color={C.amber}
          icon={IcoCalendar(C.amber, 17)}
        />
      </div>

      {/* ── Filters ── */}
      <div style={{
        background: C.white, borderRadius: 14, border: `1px solid ${C.lavender}`,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      }}>
        <div style={{ position: "relative", flex: isMobile ? "1 1 100%" : "1 1 200px", minWidth: isMobile ? "100%" : 180 }}>
          <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}>{IcoSearch()}</div>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Produit, référence, motif…"
            style={{
              padding: "9px 14px 9px 34px", border: `1.5px solid ${C.lavender}`,
              borderRadius: 10, fontFamily: FONT, fontSize: 13,
              outline: "none", background: C.offwhite, color: C.navy,
              width: "100%", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = C.purple}
            onBlur={e => e.target.style.borderColor = C.lavender}
          />
        </div>

        <div style={{ position: "relative", flex: isMobile ? "1 1 calc(50% - 6px)" : "0 0 auto" }}>
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>{IcoFilter()}</div>
          <select
            value={typeFilter}
            onChange={e => { setType(e.target.value); setPage(1); }}
            style={{
              padding: "9px 14px 9px 32px", border: `1.5px solid ${C.lavender}`,
              borderRadius: 10, fontFamily: FONT, fontSize: 13,
              outline: "none", background: C.offwhite, color: C.navy,
              cursor: "pointer", appearance: "none", paddingRight: 28,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <option value="tous">Tous les types</option>
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.muted, fontWeight: 600 }}>
              {IcoCalendar(C.muted, 14)} Du
            </span>
            <input
              type="date" value={dateFrom}
              onChange={e => { setFrom(e.target.value); setPage(1); }}
              style={{
                padding: "8px 12px", border: `1.5px solid ${C.lavender}`,
                borderRadius: 10, fontFamily: FONT, fontSize: 12,
                outline: "none", background: C.offwhite, color: C.navy,
              }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.lavender}
            />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>au</span>
            <input
              type="date" value={dateTo}
              onChange={e => { setTo(e.target.value); setPage(1); }}
              style={{
                padding: "8px 12px", border: `1.5px solid ${C.lavender}`,
                borderRadius: 10, fontFamily: FONT, fontSize: 12,
                outline: "none", background: C.offwhite, color: C.navy,
              }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.lavender}
            />
          </div>
        )}

        {(search || typeFilter !== "tous" || dateFrom || dateTo) && (
          <button onClick={resetFilters} style={{
            background: "none", border: `1px solid ${C.lavender}`,
            borderRadius: 8, padding: "8px 14px",
            fontSize: 12, fontWeight: 700, color: C.muted,
            cursor: "pointer", fontFamily: FONT,
            width: isMobile ? "100%" : "auto",
          }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* ── Date filters (mobile) ── */}
      {isMobile && (
        <div style={{
          display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Du</span>
            <input
              type="date" value={dateFrom}
              onChange={e => { setFrom(e.target.value); setPage(1); }}
              style={{
                padding: "6px 8px", border: `1.5px solid ${C.lavender}`,
                borderRadius: 8, fontFamily: FONT, fontSize: 12,
                outline: "none", background: C.offwhite, color: C.navy,
                flex: 1, minWidth: 0,
              }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.lavender}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>au</span>
            <input
              type="date" value={dateTo}
              onChange={e => { setTo(e.target.value); setPage(1); }}
              style={{
                padding: "6px 8px", border: `1.5px solid ${C.lavender}`,
                borderRadius: 8, fontFamily: FONT, fontSize: 12,
                outline: "none", background: C.offwhite, color: C.navy,
                flex: 1, minWidth: 0,
              }}
              onFocus={e => e.target.style.borderColor = C.purple}
              onBlur={e => e.target.style.borderColor = C.lavender}
            />
          </div>
        </div>
      )}

      {/* ── Erreur API ── */}
      {error && !loading && (
        <div style={{
          background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12,
          padding: "12px 16px", marginBottom: 16, fontSize: 12, color: C.red, fontWeight: 600,
        }}>
          Impossible de charger l'historique depuis l'API (/api/stock/historique). Vérifiez que la route est bien montée et que la table stock_movements existe.
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.lavender}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(27,37,89,0.05)" }}>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 60, color: C.muted }}>
            {IcoSpinner(28)}
            <span style={{ fontSize: 13 }}>Chargement…</span>
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: C.muted }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              {IcoEmpty(40)}
              <span style={{ fontSize: 14, fontWeight: 600 }}>Aucun mouvement trouvé</span>
              <span style={{ fontSize: 12 }}>Essayez de modifier vos filtres, ou ajustez un stock pour créer le premier mouvement</span>
            </div>
          </div>
        ) : isMobile ? (
          /* ── MOBILE : Cartes ── */
          <div style={{ padding: 12 }}>
            {paginated.map((row) => (
              <MobileCard key={row.id} row={row} />
            ))}
          </div>
        ) : (
          /* ── DESKTOP : Table ── */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: FONT }}>
              <thead>
                <tr style={{ background: C.offwhite, borderBottom: `2px solid ${C.lavender}` }}>
                  {[
                    { w: 120, label: "Date" },
                    { w: 72,  label: "Heure" },
                    { w: 200, label: "Produit" },
                    { w: 100, label: "Référence" },
                    { w: 100, label: "Type" },
                    { w: 80,  label: "Quantité" },
                    { w: 80,  label: "Stock après" },
                    { w: 180, label: "Motif" },
                    { w: 100, label: "Opérateur" },
                  ].map(col => (
                    <th key={col.label} style={{
                      padding: "11px 16px", textAlign: "left",
                      fontSize: 10, fontWeight: 700, color: C.muted,
                      letterSpacing: ".09em", textTransform: "uppercase",
                      whiteSpace: "nowrap", minWidth: col.w,
                    }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dates.map(date => (
                  <>
                    <tr key={`sep-${date}`}>
                      <td colSpan={9} style={{ padding: "10px 16px 6px", background: `${C.purple}08`, borderTop: `1px solid ${C.lavender}`, borderBottom: `1px solid ${C.lavender}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {IcoCalendar(C.purple, 13)}
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.purple, textTransform: "capitalize", letterSpacing: ".04em" }}>
                            {formatDate(date)}
                          </span>
                          <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>
                            — {grouped[date].length} mouvement{grouped[date].length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {grouped[date].map((row) => (
                      <tr key={row.id}
                        style={{ borderBottom: `1px solid ${C.lavender}`, transition: "background .1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "11px 16px", color: C.muted, fontSize: 12 }}>
                          {new Date(date + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </td>

                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            {IcoClock(C.muted, 12)}
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{row.time}</span>
                          </div>
                        </td>

                        <td style={{ padding: "11px 16px", color: C.navy, fontWeight: 600, maxWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {row.image && (
                              <img src={row.image} alt={row.produit} style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                            )}
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                              {row.produit}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "11px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: C.purple,
                            background: `${C.purple}10`, borderRadius: 5, padding: "2px 7px",
                          }}>
                            {row.ref}
                          </span>
                        </td>

                        <td style={{ padding: "11px 16px" }}>
                          <TypeBadge type={row.type} />
                        </td>

                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            {row.qte !== 0 && IcoTrend(row.qte > 0, 12)}
                            <span style={{
                              fontSize: 13, fontWeight: 800,
                              color: row.qte > 0 ? C.green : row.qte < 0 ? C.red : C.muted,
                            }}>
                              {row.qte > 0 ? `+${row.qte}` : row.qte === 0 ? "—" : row.qte}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: "11px 16px" }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center",
                            background: row.stock <= 10 ? "#FEF2F2" : row.stock <= 20 ? "#FEF3C7" : "#F0FDF4",
                            color: row.stock <= 10 ? C.red : row.stock <= 20 ? C.amber : C.green,
                            border: `1px solid ${row.stock <= 10 ? "#FCA5A5" : row.stock <= 20 ? "#FCD34D" : "#86EFAC"}`,
                            borderRadius: 6, padding: "2px 8px",
                            fontSize: 12, fontWeight: 800,
                          }}>
                            {row.stock}
                          </div>
                        </td>

                        <td style={{ padding: "11px 16px", color: C.muted, fontSize: 12, maxWidth: 180 }}>
                          <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.motif}
                          </span>
                        </td>

                        <td style={{ padding: "11px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: "50%",
                              background: `linear-gradient(135deg, ${C.magenta}, ${C.purple})`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: 9, fontWeight: 700, flexShrink: 0,
                            }}>
                              {row.user.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <span style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>{row.user}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px", borderTop: `1px solid ${C.lavender}`, background: C.offwhite,
            flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: 12, color: C.muted }}>
              Page {page} / {totalPages} — {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1px solid ${C.lavender}`, background: C.white,
                color: page === 1 ? C.lavender : C.navy,
                fontWeight: 700, fontSize: 14, cursor: page === 1 ? "default" : "pointer",
                fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center",
              }}>‹</button>

              {!isMobile ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 30, height: 30, borderRadius: 8,
                    border: `1px solid ${p === page ? C.purple : C.lavender}`,
                    background: p === page ? C.purple : C.white,
                    color: p === page ? "#fff" : C.navy,
                    fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT,
                  }}>
                    {p}
                  </button>
                ))
              ) : (
                /* ── Mobile: limited page numbers ── */
                <>
                  {page > 2 && (
                    <button onClick={() => setPage(1)} style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: `1px solid ${C.lavender}`, background: C.white,
                      color: C.navy, fontWeight: 700, fontSize: 12, cursor: "pointer",
                      fontFamily: FONT,
                    }}>1</button>
                  )}
                  {page > 3 && <span style={{ color: C.muted, display: "flex", alignItems: "center" }}>…</span>}
                  {page > 1 && (
                    <button onClick={() => setPage(page - 1)} style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: `1px solid ${C.lavender}`, background: C.white,
                      color: C.navy, fontWeight: 700, fontSize: 12, cursor: "pointer",
                      fontFamily: FONT,
                    }}>{page - 1}</button>
                  )}
                  <button style={{
                    width: 30, height: 30, borderRadius: 8,
                    border: `1px solid ${C.purple}`, background: C.purple,
                    color: "#fff", fontWeight: 700, fontSize: 12,
                    fontFamily: FONT,
                  }}>{page}</button>
                  {page < totalPages && (
                    <button onClick={() => setPage(page + 1)} style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: `1px solid ${C.lavender}`, background: C.white,
                      color: C.navy, fontWeight: 700, fontSize: 12, cursor: "pointer",
                      fontFamily: FONT,
                    }}>{page + 1}</button>
                  )}
                  {page < totalPages - 2 && <span style={{ color: C.muted, display: "flex", alignItems: "center" }}>…</span>}
                  {page < totalPages - 1 && (
                    <button onClick={() => setPage(totalPages)} style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: `1px solid ${C.lavender}`, background: C.white,
                      color: C.navy, fontWeight: 700, fontSize: 12, cursor: "pointer",
                      fontFamily: FONT,
                    }}>{totalPages}</button>
                  )}
                </>
              )}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1px solid ${C.lavender}`, background: C.white,
                color: page === totalPages ? C.lavender : C.navy,
                fontWeight: 700, fontSize: 14, cursor: page === totalPages ? "default" : "pointer",
                fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center",
              }}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}