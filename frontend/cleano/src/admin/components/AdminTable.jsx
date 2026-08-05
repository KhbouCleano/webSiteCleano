// src/admin/components/AdminTable.jsx
import { useState, useEffect } from "react";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy: "#1B2559", magenta: "#E7398B",
  lavender: "#E8EAF6", muted: "#8892B0",
  white: "#FFFFFF", offwhite: "#F8F9FF",
  danger: "#EF4444",
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
const IcoEdit = (c, s = 13) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcoTrash = (c, s = 13) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IcoPlus = (c, s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcoSearch = (c = "#8892B0", s = 15) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoEmpty = (s = 32) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#DDDEE8" strokeWidth="1.5" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// ── Vue carte (mobile) ────────────────────────────────────────
const MobileCard = ({ row, columns, onEdit, onDelete, onRowClick, color, idx }) => (
  <div
    onClick={() => onRowClick?.(row)}
    style={{
      background: C.white, border: `1px solid ${C.lavender}`,
      borderRadius: 14, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 10,
      cursor: onRowClick ? "pointer" : "default",
    }}
  >
    {/* Champs */}
    {columns.map(col => (
      <div key={col.key} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: C.muted,
          textTransform: "uppercase", letterSpacing: ".07em",
          minWidth: 84, paddingTop: 2, flexShrink: 0,
        }}>
          {col.label}
        </span>
        <span style={{ fontSize: 13, color: C.navy, flex: 1, wordBreak: "break-word" }}>
          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
        </span>
      </div>
    ))}

    {/* Actions */}
    {(onEdit || onDelete) && (
      <div style={{
        display: "flex", gap: 8, paddingTop: 8,
        borderTop: `1px solid ${C.lavender}`, justifyContent: "flex-end",
      }}>
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(row); }}
            title="Éditer"
            style={{
              width: 34, height: 34, background: `${color}12`, color,
              border: `1px solid ${color}30`,
              borderRadius: 8, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            {IcoEdit(color, 14)}
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); if (window.confirm("Supprimer cet enregistrement ?")) onDelete(row); }}
            title="Supprimer"
            style={{
              width: 34, height: 34, background: "#FEF2F2", color: C.danger,
              border: `1px solid #FCA5A5`,
              borderRadius: 8, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            {IcoTrash(C.danger, 14)}
          </button>
        )}
      </div>
    )}
  </div>
);

// ── Spinner ───────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48, color: C.muted }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.lavender} strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    <span style={{ fontSize: 13 }}>Chargement…</span>
  </div>
);

// ── AdminTable ────────────────────────────────────────────────
export default function AdminTable({
  title, icon, color = C.magenta,
  columns = [], rows = [], loading = false,
  onAdd, onEdit, onDelete, onRowClick,
  searchKeys = [],
  addLabel = "Ajouter",
  extra,
}) {
  const isMobile = useIsMobile(640);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = rows.filter(row => {
    if (!search) return true;
    return searchKeys.some(k =>
      String(row[k] ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ fontFamily: FONT }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${color}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {typeof icon === "string" ? <span style={{ fontSize: 20 }}>{icon}</span> : icon}
          </div>
          <div>
            <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 900, color: C.navy, margin: 0 }}>{title}</h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
              {filtered.length} enregistrement{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {extra}
          {onAdd && (
            <button onClick={onAdd} style={{
              background: `linear-gradient(135deg, ${color}, ${C.magenta})`,
              color: "#fff", border: "none", borderRadius: 10,
              padding: isMobile ? "9px 14px" : "9px 18px",
              fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: FONT,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {IcoPlus("#fff", 13)}
              {!isMobile && addLabel}
              {isMobile && "Ajouter"}
            </button>
          )}
        </div>
      </div>

      {/* ── Search ── */}
      {searchKeys.length > 0 && (
        <div style={{ marginBottom: 14, position: "relative", maxWidth: isMobile ? "100%" : 320 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            {IcoSearch()}
          </div>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher…"
            style={{
              padding: "10px 16px 10px 38px",
              border: `1.5px solid ${C.lavender}`,
              borderRadius: 10, fontFamily: FONT, fontSize: 13,
              outline: "none", background: C.white, color: C.navy,
              width: "100%", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = C.lavender}
          />
        </div>
      )}

      {/* ── MOBILE : cartes ── */}
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading ? (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.lavender}` }}>
              <Spinner />
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.lavender}`, padding: 48, textAlign: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: C.muted }}>
                {IcoEmpty(36)}
                <span style={{ fontSize: 13 }}>Aucun enregistrement trouvé</span>
              </div>
            </div>
          ) : (
            paginated.map((row, idx) => (
              <MobileCard
                key={row.id ?? idx}
                row={row} columns={columns}
                onEdit={onEdit} onDelete={onDelete}
                onRowClick={onRowClick}
                color={color} idx={idx}
              />
            ))
          )}

          {/* Pagination mobile */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              background: C.white, borderRadius: 12,
              border: `1px solid ${C.lavender}`,
              padding: "10px 16px",
            }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "7px 16px", borderRadius: 8, fontWeight: 700,
                  fontSize: 13, cursor: page === 1 ? "default" : "pointer",
                  border: `1px solid ${C.lavender}`,
                  background: page === 1 ? C.offwhite : C.white,
                  color: page === 1 ? C.lavender : C.navy,
                  fontFamily: FONT,
                }}>
                ← Préc.
              </button>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "7px 16px", borderRadius: 8, fontWeight: 700,
                  fontSize: 13, cursor: page === totalPages ? "default" : "pointer",
                  border: `1px solid ${C.lavender}`,
                  background: page === totalPages ? C.offwhite : C.white,
                  color: page === totalPages ? C.lavender : C.navy,
                  fontFamily: FONT,
                }}>
                Suiv. →
              </button>
            </div>
          )}
        </div>
      ) : (

        /* ── DESKTOP : table ── */
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.lavender}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(27,37,89,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: FONT }}>
              <thead>
                <tr style={{ background: C.offwhite, borderBottom: `2px solid ${C.lavender}` }}>
                  {columns.map(col => (
                    <th key={col.key} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: C.muted,
                      letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {col.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th style={{
                      padding: "12px 16px", textAlign: "right",
                      fontSize: 11, fontWeight: 700, color: C.muted,
                      letterSpacing: ".08em", textTransform: "uppercase",
                    }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <Spinner />
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: 48, color: C.muted }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        {IcoEmpty(36)}
                        <span style={{ fontSize: 13 }}>Aucun enregistrement trouvé</span>
                      </div>
                    </td>
                  </tr>
                ) : paginated.map((row, idx) => (
                  <tr key={row.id ?? idx}
                    onClick={() => onRowClick?.(row)}
                    style={{ borderBottom: `1px solid ${C.lavender}`, transition: "background .1s", cursor: onRowClick ? "pointer" : "default" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: "12px 16px", color: C.navy, verticalAlign: "middle" }}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          {onEdit && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                              title="Éditer"
                              style={{
                                width: 30, height: 30, background: `${color}12`, color,
                                border: `1px solid ${color}30`,
                                borderRadius: 8, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}>
                              {IcoEdit(color, 13)}
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => { e.stopPropagation(); if (window.confirm("Supprimer cet enregistrement ?")) onDelete(row); }}
                              title="Supprimer"
                              style={{
                                width: 30, height: 30, background: "#FEF2F2", color: C.danger,
                                border: `1px solid #FCA5A5`,
                                borderRadius: 8, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}>
                              {IcoTrash(C.danger, 13)}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination desktop */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 20px", borderTop: `1px solid ${C.lavender}`, background: C.offwhite,
            }}>
              <span style={{ fontSize: 12, color: C.muted }}>Page {page} / {totalPages}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: `1px solid ${C.lavender}`,
                  background: page === 1 ? C.offwhite : C.white,
                  color: page === 1 ? C.lavender : C.navy,
                  fontWeight: 700, fontSize: 14, cursor: page === 1 ? "default" : "pointer",
                  fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center",
                }}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 30, height: 30, borderRadius: 8,
                    border: `1px solid ${p === page ? color : C.lavender}`,
                    background: p === page ? color : C.white,
                    color: p === page ? "#fff" : C.navy,
                    fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT,
                  }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: `1px solid ${C.lavender}`,
                  background: page === totalPages ? C.offwhite : C.white,
                  color: page === totalPages ? C.lavender : C.navy,
                  fontWeight: 700, fontSize: 14, cursor: page === totalPages ? "default" : "pointer",
                  fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center",
                }}>›</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}