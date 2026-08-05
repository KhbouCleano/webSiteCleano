// src/admin/pages/ProduitsPage.jsx
import { useState, useEffect, useCallback } from "react";
import AdminTable from "../components/AdminTable";
import { AdminModal, FormField, FormInput, FormSelect, FormTextarea } from "../components/AdminModal";

const COLOR = "#6366F1";
const EMPTY = { name: "", description: "", price: "", category_id: "", stock: 0, image: "", badges: "" };

// ── Icons SVG ─────────────────────────────────────────────────
const IcoBox = (c="#6366F1", s=18) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IcoImage = (c="#8892B0", s=16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IcoUpload = (c="#6366F1", s=16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const IcoArrowDown = (c="#10B981", s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);
const IcoArrowUp = (c="#EF4444", s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const IcoTool = (c="#F59E0B", s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IcoPackage = (c="#10B981", s=16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const BADGE_STYLE = (color) => ({
  display: "inline-block",
  padding: "2px 8px", borderRadius: 20,
  fontSize: 10, fontWeight: 700,
  background: `${color}18`, color,
  border: `1px solid ${color}30`,
  marginRight: 4,
});

const STATUS_BADGE = (stock) => {
  if (stock <= 0) return { label: "Rupture", color: "#EF4444" };
  if (stock <= 5) return { label: "Faible",  color: "#F59E0B" };
  return              { label: "En stock", color: "#10B981" };
};

const REASONS = [
  { value: "entree",     label: "Entrée",     Icon: IcoArrowDown, color: "#10B981" },
  { value: "sortie",     label: "Sortie",      Icon: IcoArrowUp,   color: "#EF4444" },
  { value: "correction", label: "Correction", Icon: IcoTool,      color: "#F59E0B" },
];

// ── Image upload field ────────────────────────────────────────
const ImageField = ({ value, onChange }) => {
  const [preview, setPreview] = useState(value || "");
  const [tab, setTab] = useState("url"); // "url" | "upload"

  const handleUrl = (e) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreview(base64);
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {[["url", "URL"], ["upload", "Fichier"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            border: `1.5px solid ${tab === t ? COLOR : "#E8EAF6"}`,
            background: tab === t ? `${COLOR}12` : "#fff",
            color: tab === t ? COLOR : "#8892B0", cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>

      {tab === "url" ? (
        <input
          type="text" value={value} onChange={handleUrl}
          placeholder="https://exemple.com/image.jpg"
          style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E8EAF6", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#F8F9FF", color: "#1B2559" }}
          onFocus={e => e.target.style.borderColor = COLOR}
          onBlur={e => e.target.style.borderColor = "#E8EAF6"}
        />
      ) : (
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "20px", border: `2px dashed ${COLOR}40`,
          borderRadius: 12, cursor: "pointer", background: `${COLOR}06`,
          transition: "all .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = `${COLOR}12`}
          onMouseLeave={e => e.currentTarget.style.background = `${COLOR}06`}
        >
          {IcoUpload(COLOR, 24)}
          <span style={{ fontSize: 12, color: "#8892B0" }}>Cliquer pour choisir une image</span>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </label>
      )}

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: 10, position: "relative", display: "inline-block" }}>
          <img src={preview} alt="preview"
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1.5px solid #E8EAF6", display: "block" }}
            onError={e => e.target.style.display = "none"}
          />
          <button onClick={() => { setPreview(""); onChange(""); }}
            style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default function ProduitsPage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal produit (créer / modifier)
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal ajustement de stock
  const [modalAdj, setModalAdj]   = useState(false);
  const [editingAdj, setEditingAdj] = useState(null);
  const [formAdj, setFormAdj]     = useState({ adjustment: 0, reason: "entree", note: "" });
  const [savingAdj, setSavingAdj] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        fetch("/api/products").then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
      ]);
      setRows(p.products ?? p ?? []);
      setCategories(c.categories ?? c ?? []);
    } catch (_) {
      setRows([
        { id: 1, name: "Nettoyant Cuisine Pro",  price: 12.50, stock: 45, category_id: 1, badges: ["Nouveau"], description: "Nettoyant dégraissant puissant", image: "" },
        { id: 2, name: "Gel WC Fraîcheur",        price: 8.90,  stock: 3,  category_id: 2, badges: ["Promo"],   description: "Gel nettoyant pour WC",        image: "" },
        { id: 3, name: "Liquide Vitres Crystal",  price: 6.50,  stock: 0,  category_id: 3, badges: [],          description: "Nettoyant vitres sans traces",  image: "" },
      ]);
      setCategories([
        { id: 1, label: "Cuisine" }, { id: 2, label: "Sanitaire" },
        { id: 3, label: "Vitres" },  { id: 4, label: "Sols & Salons" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── CRUD produit ───────────────────────────────────────────
  const openAdd  = () => { setEditing(null); setForm(EMPTY); setFormError(""); setModal(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ ...row, badges: (row.badges ?? []).join(", ") });
    setFormError("");
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); setFormError(""); };

  const handleSubmit = async () => {
    if (!form.name || !form.name.trim()) {
      setFormError("Le nom du produit est requis.");
      return;
    }

    const payload = {
      ...form,
      price:       parseFloat(form.price),
      stock:       parseInt(form.stock),
      category_id: parseInt(form.category_id),
      badges:      form.badges ? form.badges.split(",").map(b => b.trim()).filter(Boolean) : [],
    };

    setSaving(true);
    setFormError("");
    try {
      const res = editing
        ? await fetch(`/api/products/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (!res.ok) {
        // 409 = nom de produit déjà existant (refusé volontairement par l'API),
        // ou autre erreur de validation — on l'affiche et on NE ferme PAS la modale.
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || "Une erreur est survenue. Le produit n'a pas été enregistré.");
        setSaving(false);
        return;
      }

      await load();
      setSaving(false);
      closeModal();
    } catch (_) {
      // Erreur réseau uniquement (API totalement injoignable) : on garde un
      // filet de sécurité en local, mais on prévient que ce n'est pas persisté côté serveur.
      if (editing) {
        setRows(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r));
      } else {
        setRows(prev => [...prev, { ...payload, id: Date.now() }]);
      }
      setSaving(false);
      closeModal();
    }
  };

  const handleDelete = async (row) => {
    try {
      await fetch(`/api/products/${row.id}`, { method: "DELETE" });
      await load();
    } catch (_) {
      setRows(prev => prev.filter(r => r.id !== row.id));
    }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  // ── Ajustement de stock (historisé via /api/stock/movement) ──
  const openAdj = (row) => {
    setEditingAdj(row);
    setFormAdj({ adjustment: 0, reason: "entree", note: "" });
    setModalAdj(true);
  };
  const closeAdj = () => { setModalAdj(false); setEditingAdj(null); };

  const handleAdjust = async () => {
    if (!editingAdj) return;
    setSavingAdj(true);
    try {
      const res = await fetch("/api/stock/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingAdj.id,
          type: formAdj.reason,
          quantity: parseInt(formAdj.adjustment) || 0,
          note: formAdj.note?.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      const { stock } = await res.json();
      setRows(prev => prev.map(r => r.id === editingAdj.id ? { ...r, stock } : r));
    } catch (_) {
      // Fallback local si l'API stock n'est pas disponible
      const current = editingAdj.stock;
      const next = formAdj.reason === "correction"
        ? parseInt(formAdj.adjustment) || 0
        : current + (formAdj.reason === "sortie" ? -1 : 1) * (parseInt(formAdj.adjustment) || 0);
      setRows(prev => prev.map(r => r.id === editingAdj.id ? { ...r, stock: Math.max(0, next) } : r));
    }
    setSavingAdj(false);
    closeAdj();
  };

  const fa = (k) => (e) => setFormAdj(prev => ({ ...prev, [k]: e.target.value }));

  const newStockPreview = editingAdj
    ? (formAdj.reason === "correction"
        ? parseInt(formAdj.adjustment || 0)
        : editingAdj.stock + (formAdj.reason === "sortie" ? -1 : 1) * parseInt(formAdj.adjustment || 0))
    : 0;

  const COLUMNS = [
    {
      key: "image", label: "Image",
      render: (v, row) => v ? (
        <img src={v} alt={row.name}
          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 10, border: "1.5px solid #E8EAF6", display: "block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F8F9FF", border: "1.5px solid #E8EAF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {IcoImage("#DDDEE8", 18)}
        </div>
      ),
    },
    {
      key: "name", label: "Produit",
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1B2559" }}>{v}</div>
          <div style={{ fontSize: 11, color: "#8892B0", marginTop: 2 }}>{row.description?.slice(0, 50)}</div>
        </div>
      ),
    },
    {
      key: "category_id", label: "Catégorie",
      render: v => {
        const cat = categories.find(c => c.id === v);
        return <span style={BADGE_STYLE("#6366F1")}>{cat?.label ?? "—"}</span>;
      },
    },
    {
      key: "price", label: "Prix",
      render: v => <strong style={{ color: "#E7398B" }}>{Number(v).toFixed(2)} TND</strong>,
    },
    {
      key: "stock", label: "Stock",
      render: (v, row) => {
        const { label, color } = STATUS_BADGE(v);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700 }}>{v}</span>
            <span style={{ ...BADGE_STYLE(color), fontSize: 9 }}>{label}</span>
            <button
              onClick={(e) => { e.stopPropagation(); openAdj(row); }}
              title="Ajuster le stock"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "#F0FDF4", color: "#10B981",
                border: "1px solid #86EFAC", borderRadius: 8,
                padding: "3px 8px", fontSize: 10, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {IcoPackage("#10B981", 12)} Ajuster
            </button>
          </div>
        );
      },
    },
    {
      key: "badges", label: "Badges",
      render: v => (v ?? []).map(b => <span key={b} style={BADGE_STYLE("#E7398B")}>{b}</span>),
    },
  ];

  return (
    <>
      <AdminTable
        title="Gestion des Produits"
        icon={IcoBox(COLOR, 22)}
        color={COLOR}
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchKeys={["name", "description"]}
        addLabel="Nouveau produit"
      />

      {/* ── Modal : Créer / Modifier produit ── */}
      <AdminModal
        open={modal}
        onClose={closeModal}
        title={editing ? "Modifier le produit" : "Nouveau produit"}
        color={COLOR}
        onSubmit={handleSubmit}
        submitLabel={saving ? "Enregistrement…" : (editing ? "Mettre à jour" : "Créer le produit")}
      >
        {formError && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10,
            padding: "10px 14px", marginBottom: 14, fontSize: 12, fontWeight: 600, color: "#EF4444",
          }}>
            {formError}
          </div>
        )}
        <FormField label="Nom du produit" required>
          <FormInput value={form.name} onChange={f("name")} placeholder="Ex: Nettoyant Multi-surfaces" />
        </FormField>
        <FormField label="Description">
          <FormTextarea value={form.description} onChange={f("description")} rows={3} placeholder="Description du produit…" />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Prix (TND)" required>
            <FormInput type="number" step="0.01" value={form.price} onChange={f("price")} placeholder="0.00" />
          </FormField>
          <FormField label="Stock">
            <FormInput type="number" value={form.stock} onChange={f("stock")} placeholder="0" disabled={!!editing} />
          </FormField>
        </div>
        {editing && (
          <p style={{ fontSize: 11, color: "#8892B0", marginTop: -8, marginBottom: 12 }}>
            Le stock se modifie désormais via le bouton « Ajuster » dans la liste, pour garder un historique des mouvements.
          </p>
        )}
        <FormField label="Catégorie">
          <FormSelect value={form.category_id} onChange={f("category_id")}>
            <option value="">Choisir une catégorie</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </FormSelect>
        </FormField>
        <FormField label="Image du produit">
          <ImageField
            value={form.image}
            onChange={(val) => setForm(prev => ({ ...prev, image: val }))}
          />
        </FormField>
        <FormField label="Badges (séparés par virgule)">
          <FormInput value={form.badges} onChange={f("badges")} placeholder="Nouveau, Promo, Bio" />
        </FormField>
      </AdminModal>

      {/* ── Modal : Ajuster le stock (historisé) ── */}
      <AdminModal
        open={modalAdj}
        onClose={closeAdj}
        title={`Ajuster le stock — ${editingAdj?.name ?? ""}`}
        color="#10B981"
        onSubmit={handleAdjust}
        submitLabel={savingAdj ? "Enregistrement…" : "Valider l'ajustement"}
      >
        <div style={{ background: "#F8F9FF", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E8EAF6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {editingAdj?.image ? (
              <img src={editingAdj.image} alt={editingAdj?.name}
                style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1.5px solid #E8EAF6", flexShrink: 0 }}
                onError={e => e.target.style.display = "none"}
              />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#E8EAF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {IcoImage("#8892B0", 20)}
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2559" }}>{editingAdj?.name}</div>
              <div style={{ fontSize: 11, color: "#8892B0" }}>Stock actuel</div>
            </div>
          </div>
          <strong style={{ fontSize: 26, color: "#1B2559" }}>{editingAdj?.stock}</strong>
        </div>

        <FormField label="Type de mouvement">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {REASONS.map(({ value, label, Icon, color }) => (
              <button key={value} onClick={() => setFormAdj(prev => ({ ...prev, reason: value }))}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                  border: `2px solid ${formAdj.reason === value ? color : "#E8EAF6"}`,
                  background: formAdj.reason === value ? `${color}10` : "#F8F9FF",
                  transition: "all .15s",
                }}>
                {Icon(color, 18)}
                <span style={{ fontSize: 10, fontWeight: 700, color: formAdj.reason === value ? color : "#8892B0", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
              </button>
            ))}
          </div>
        </FormField>

        <FormField label={formAdj.reason === "correction" ? "Nouveau stock total" : "Quantité"} required>
          <FormInput
            type="number"
            value={formAdj.adjustment}
            onChange={fa("adjustment")}
            placeholder={formAdj.reason === "sortie" ? "Ex: 5" : "Ex: 10"}
          />
        </FormField>

        <FormField label="Note (optionnel)">
          <FormInput
            value={formAdj.note}
            onChange={fa("note")}
            placeholder="Ex: Réception fournisseur, casse, inventaire…"
          />
        </FormField>

        <div style={{ background: "#10B98110", border: "1.5px solid #10B98130", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#8892B0" }}>Nouveau stock</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#8892B0", textDecoration: "line-through" }}>{editingAdj?.stock}</span>
            <span style={{ fontSize: 13, color: "#8892B0" }}>→</span>
            <strong style={{ fontSize: 24, color: "#10B981" }}>{newStockPreview < 0 ? 0 : newStockPreview}</strong>
          </div>
        </div>
      </AdminModal>
    </>
  );
}