// ============================================================
// src/admin/pages/AdminGouvernorats.jsx — "Liste des gouvernorats"
// ============================================================
import { useState, useEffect, useMemo } from "react";
import useAppStore from "../../store/useAppStore";
import {
  loadGouvernorats, addGouvernorat, renameGouvernorat, deleteGouvernorat,
} from "../../data/gouvernoratsStore";
import {
  AdminModal, AdminConfirm, inputStyle, labelStyle, btnPrimary, btnGhost, FONT, C,
} from "../components/AdminModal";

const GovIcon = (color, size = 20) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function AdminGouvernorats() {
  const navigate = useAppStore((s) => s.navigate);
  const [data, setData] = useState(loadGouvernorats());
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");

  const [editing, setEditing] = useState(null); // gov being renamed
  const [renameValue, setRenameValue] = useState("");

  const [toDelete, setToDelete] = useState(null); // gov pending delete confirm

  useEffect(() => {
    const refresh = () => setData(loadGouvernorats());
    window.addEventListener("gouvernorats-updated", refresh);
    return () => window.removeEventListener("gouvernorats-updated", refresh);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(g => g.name.toLowerCase().includes(q));
  }, [data, search]);

  const totalPoints = data.reduce((sum, g) => sum + g.points.length, 0);

  const handleAdd = () => {
    if (!newName.trim()) { setAddError("Le nom est obligatoire."); return; }
    const res = addGouvernorat(newName);
    if (res.error) { setAddError(res.error); return; }
    setData(res.data);
    setNewName(""); setAddError(""); setAddOpen(false);
  };

  const handleRename = () => {
    if (!renameValue.trim() || !editing) return;
    setData(renameGouvernorat(editing.id, renameValue));
    setEditing(null);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setData(deleteGouvernorat(toDelete.id));
  };

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, margin: "0 0 4px" }}>Gouvernorats</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            {data.length} gouvernorat{data.length > 1 ? "s" : ""} · {totalPoints} point{totalPoints > 1 ? "s" : ""} de vente au total
          </p>
        </div>
        <button onClick={() => setAddOpen(true)} style={btnPrimary}>
          + Ajouter un gouvernorat
        </button>
      </div>

      {/* Search + shortcut */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 340 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un gouvernorat…"
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>
        <button onClick={() => navigate("admin-points-vente")} style={{ ...btnGhost, display: "flex", alignItems: "center", gap: 6 }}>
          Voir tous les points de vente
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted, fontSize: 13 }}>
          Aucun gouvernorat ne correspond à « {search} ».
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {filtered.map(g => (
            <div key={g.id} style={{
              background: "#fff", border: `1px solid ${C.lavender}`, borderRadius: 16,
              padding: 18, display: "flex", flexDirection: "column", gap: 12,
              transition: "box-shadow .15s, transform .15s", cursor: "pointer",
            }}
              onClick={() => navigate("admin-points-vente", { gouvernoratId: g.id })}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 28px rgba(27,37,89,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: `${C.magenta}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {GovIcon(C.magenta)}
                </div>
                <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button title="Renommer" onClick={() => { setEditing(g); setRenameValue(g.name); }} style={iconBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>
                    </svg>
                  </button>
                  <button title="Supprimer" onClick={() => setToDelete(g)} style={iconBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{g.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {g.points.length} point{g.points.length > 1 ? "s" : ""} de vente
                </div>
              </div>

              <div style={{ height: 5, borderRadius: 3, background: C.lavender, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${Math.min(100, (g.points.length / Math.max(1, Math.max(...data.map(d => d.points.length)))) * 100)}%`,
                  background: `linear-gradient(90deg, ${C.magenta}, ${C.rose})`,
                }}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal — ajout */}
      <AdminModal open={addOpen} onClose={() => { setAddOpen(false); setAddError(""); setNewName(""); }} title="Ajouter un gouvernorat">
        <label style={labelStyle}>Nom du gouvernorat</label>
        <input
          autoFocus value={newName}
          onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Ex : Kairouan"
          style={{ ...inputStyle, marginBottom: 6 }}
        />
        {addError && <p style={{ color: "#EF4444", fontSize: 12, margin: "0 0 10px" }}>{addError}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
          <button onClick={() => setAddOpen(false)} style={btnGhost}>Annuler</button>
          <button onClick={handleAdd} style={btnPrimary}>Ajouter</button>
        </div>
      </AdminModal>

      {/* Modal — renommer */}
      <AdminModal open={!!editing} onClose={() => setEditing(null)} title="Renommer le gouvernorat">
        <label style={labelStyle}>Nom</label>
        <input
          autoFocus value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRename()}
          style={{ ...inputStyle, marginBottom: 14 }}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => setEditing(null)} style={btnGhost}>Annuler</button>
          <button onClick={handleRename} style={btnPrimary}>Enregistrer</button>
        </div>
      </AdminModal>

      {/* Confirm — suppression */}
      <AdminConfirm
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer ce gouvernorat ?"
        message={toDelete ? `« ${toDelete.name} » et ${toDelete.points.length > 0 ? `ses ${toDelete.points.length} point(s) de vente seront` : "sera"} définitivement supprimé(s). Cette action est irréversible.` : ""}
      />
    </div>
  );
}

const iconBtn = {
  width: 28, height: 28, borderRadius: 8, border: "none",
  background: C.offwhite, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};
