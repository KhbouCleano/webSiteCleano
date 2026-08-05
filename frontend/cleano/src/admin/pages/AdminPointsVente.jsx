// ============================================================
// src/admin/pages/AdminPointsVente.jsx — "Gestion des points de vente"
// ============================================================
import { useState, useEffect, useMemo } from "react";
import useAppStore from "../../store/useAppStore";
import {
  loadGouvernorats, addPoint, updatePoint, deletePoint,
} from "../../data/gouvernoratsStore";
import {
  AdminModal, AdminConfirm, inputStyle, labelStyle, btnPrimary, btnGhost, FONT, C,
} from "../components/AdminModal";

const emptyForm = { govId: "", ville: "", adresse: "", tel: "" };

// ── Hook responsive (identique pattern que Header.jsx) ─────────
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

export default function AdminPointsVente() {
  // Si votre store de navigation transmet des paramètres (navigate(page, params)),
  // on récupère ici un gouvernorat pré-sélectionné venant de la page "Gouvernorats".
  const pageParams = useAppStore((s) => s.pageParams) ?? {};
  const isMobile = useIsMobile();

  const [data, setData] = useState(loadGouvernorats());
  const [govFilter, setGovFilter] = useState(pageParams.gouvernoratId || "all");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null); // { govId, pointId } | null
  const [formError, setFormError] = useState("");

  const [toDelete, setToDelete] = useState(null); // { govId, point }

  useEffect(() => {
    const refresh = () => setData(loadGouvernorats());
    window.addEventListener("gouvernorats-updated", refresh);
    return () => window.removeEventListener("gouvernorats-updated", refresh);
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [];
    data.forEach(g => {
      if (govFilter !== "all" && g.id !== govFilter) return;
      g.points.forEach(p => {
        if (q && !`${p.ville} ${p.adresse} ${p.tel}`.toLowerCase().includes(q)) return;
        list.push({ ...p, govId: g.id, govName: g.name });
      });
    });
    return list;
  }, [data, govFilter, search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, govId: govFilter !== "all" ? govFilter : (data[0]?.id ?? "") });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing({ govId: row.govId, pointId: row.id });
    setForm({ govId: row.govId, ville: row.ville, adresse: row.adresse, tel: row.tel });
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.govId) { setFormError("Choisissez un gouvernorat."); return; }
    if (!form.ville.trim()) { setFormError("La ville est obligatoire."); return; }
    if (!form.adresse.trim()) { setFormError("L'adresse est obligatoire."); return; }
    if (!form.tel.trim()) { setFormError("Le téléphone est obligatoire."); return; }

    const payload = { ville: form.ville.trim(), adresse: form.adresse.trim(), tel: form.tel.trim() };

    if (editing) {
      setData(updatePoint(editing.govId, editing.pointId, payload));
    } else {
      setData(addPoint(form.govId, payload));
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setData(deletePoint(toDelete.govId, toDelete.point.id));
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        .apv-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; margin-bottom: 22px; flex-wrap: wrap;
        }
        .apv-add-btn { white-space: nowrap; }
        .apv-filters { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
        .apv-gov-select { width: auto; min-width: 200px; }
        .apv-search-wrap { position: relative; flex: 1 1 240px; max-width: 320px; }

        @media (max-width: 640px) {
          .apv-header { flex-direction: column; align-items: stretch; gap: 12px; }
          .apv-add-btn { width: 100%; text-align: center; }
          .apv-filters { flex-direction: column; }
          .apv-gov-select { width: 100%; min-width: 0; }
          .apv-search-wrap { max-width: 100%; flex: 1 1 auto; }
        }
      `}</style>

      {/* Header */}
      <div className="apv-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: "0 0 4px" }}>Points de vente</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            {rows.length} résultat{rows.length > 1 ? "s" : ""} {govFilter !== "all" ? `— ${data.find(g => g.id === govFilter)?.name ?? ""}` : "— tous gouvernorats"}
          </p>
        </div>
        <button onClick={openAdd} className="apv-add-btn" style={btnPrimary}>+ Ajouter un point de vente</button>
      </div>

      {/* Filtres */}
      <div className="apv-filters">
        <select value={govFilter} onChange={(e) => setGovFilter(e.target.value)} className="apv-gov-select" style={inputStyle}>
          <option value="all">Tous les gouvernorats</option>
          {data.map(g => <option key={g.id} value={g.id}>{g.name} ({g.points.length})</option>)}
        </select>
        <div className="apv-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher ville, adresse, tél…"
            style={{ ...inputStyle, paddingLeft: 34, width: "100%", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* ── Contenu : cartes empilées sur mobile, tableau sur desktop ── */}
      {isMobile ? (
        rows.length === 0 ? (
          <div style={{ background: "#fff", border: `1px solid ${C.lavender}`, borderRadius: 16, textAlign: "center", padding: "40px 16px", color: C.muted, fontSize: 13 }}>
            Aucun point de vente ne correspond à ces filtres.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map(row => (
              <div key={row.id} style={{ background: "#fff", border: `1px solid ${C.lavender}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.magenta, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 3 }}>
                      {row.govName}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{row.ville}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button title="Modifier" onClick={() => openEdit(row)} style={iconBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
                      </svg>
                    </button>
                    <button title="Supprimer" onClick={() => setToDelete({ govId: row.govId, point: row })} style={iconBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 6, lineHeight: 1.4 }}>{row.adresse}</div>
                <a href={`tel:${row.tel.replace(/\s|\+/g, "")}`} style={{ fontSize: 13, color: C.magenta, fontWeight: 700, textDecoration: "none" }}>
                  {row.tel}
                </a>
              </div>
            ))}
          </div>
        )
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${C.lavender}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFBFF", borderBottom: `1px solid ${C.lavender}` }}>
                  {["Gouvernorat", "Ville", "Adresse", "Téléphone", ""].map((h, i) => (
                    <th key={i} style={{
                      textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700,
                      color: C.muted, textTransform: "uppercase", letterSpacing: ".05em", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "48px 16px", color: C.muted }}>
                      Aucun point de vente ne correspond à ces filtres.
                    </td>
                  </tr>
                ) : rows.map(row => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${C.lavender}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: C.navy, whiteSpace: "nowrap" }}>{row.govName}</td>
                    <td style={{ padding: "12px 16px", color: C.navy, whiteSpace: "nowrap" }}>{row.ville}</td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>{row.adresse}</td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <a href={`tel:${row.tel.replace(/\s|\+/g, "")}`} style={{ color: C.magenta, fontWeight: 700, textDecoration: "none" }}>
                        {row.tel}
                      </a>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button title="Modifier" onClick={() => openEdit(row)} style={iconBtn}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
                          </svg>
                        </button>
                        <button title="Supprimer" onClick={() => setToDelete({ govId: row.govId, point: row })} style={iconBtn}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal — ajout / édition */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le point de vente" : "Ajouter un point de vente"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Gouvernorat</label>
            <select
              value={form.govId} disabled={!!editing}
              onChange={(e) => setForm(f => ({ ...f, govId: e.target.value }))}
              style={{ ...inputStyle, opacity: editing ? 0.6 : 1 }}
            >
              {!form.govId && <option value="">— Choisir —</option>}
              {data.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ville</label>
            <input value={form.ville} onChange={(e) => setForm(f => ({ ...f, ville: e.target.value }))}
              placeholder="Ex : La Marsa" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Adresse</label>
            <input value={form.adresse} onChange={(e) => setForm(f => ({ ...f, adresse: e.target.value }))}
              placeholder="Ex : Rue de la Corniche, La Marsa" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input value={form.tel} onChange={(e) => setForm(f => ({ ...f, tel: e.target.value }))}
              placeholder="Ex : (+216) 54 444 428" style={inputStyle} />
          </div>
          {formError && <p style={{ color: "#EF4444", fontSize: 12, margin: 0 }}>{formError}</p>}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={() => setModalOpen(false)} style={btnGhost}>Annuler</button>
          <button onClick={handleSubmit} style={btnPrimary}>{editing ? "Enregistrer" : "Ajouter"}</button>
        </div>
      </AdminModal>

      {/* Confirm — suppression */}
      <AdminConfirm
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer ce point de vente ?"
        message={toDelete ? `« ${toDelete.point.ville} » sera définitivement supprimé.` : ""}
      />
    </div>
  );
}

const iconBtn = {
  width: 28, height: 28, borderRadius: 8, border: "none",
  background: C.offwhite, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};