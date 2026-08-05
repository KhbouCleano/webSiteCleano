// src/admin/pages/StockPage.jsx
import { useState, useEffect, useCallback } from "react";
import AdminTable from "../components/AdminTable";
import { AdminModal, FormField, FormInput, FormSelect } from "../components/AdminModal";

const COLOR = "#8B5CF6";

// ── Icons ─────────────────────────────────────────────────────
const IcoWarehouse = (c=COLOR, s=22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35z"/>
    <path d="M6 18h12"/><path d="M6 14h12"/><rect x="8" y="18" width="8" height="4" rx="1"/>
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
const IcoPackagePlus = (c=COLOR, s=18) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16h6m-3-3v6"/>
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l4-2.22"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IcoCube = (c="#8892B0", s=16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IcoAlert = (c="#EF4444", s=16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// 4 paliers de couleur, alignés entre le badge texte et la barre de progression :
//   [0, 20]   → rouge  "Rupture"
//   ]20, 40]  → orange "Critique"
//   ]40, 60]  → jaune  "Faible"
//   ]60, +∞[  → vert   "Normal"
const STOCK_BADGE = (stock) => {
  if (stock <= 20) return { label: "Rupture",  color: "#B91C1C", bg: "#FEE2E2" };
  if (stock <= 40) return { label: "Critique", color: "#F97316", bg: "#FFF7ED" };
  if (stock <= 60) return { label: "Faible",   color: "#F59E0B", bg: "#FFFBEB" };
  return               { label: "Normal",   color: "#10B981", bg: "#F0FDF4" };
};

// Référence pour la largeur de la barre : on cale l'échelle sur 100 unités
// (le dernier palier "vert" reste visuellement plein à partir de 60, avec
// une marge de progression jusqu'à 100 pour rester lisible même au-delà).
const STOCK_BAR_MAX = 100;

const REASONS = [
  { value: "entree",     label: "Entrée de stock",       Icon: IcoArrowDown, color: "#10B981" },
  { value: "sortie",     label: "Sortie de stock",        Icon: IcoArrowUp,   color: "#EF4444" },
  { value: "correction", label: "Correction d'inventaire", Icon: IcoTool,      color: "#F59E0B" },
];

// Petit bandeau d'erreur réutilisable pour les modals
const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10,
      padding: "10px 14px", marginBottom: 14,
    }}>
      {IcoAlert("#EF4444", 16)}
      <span style={{ fontSize: 12, color: "#B91C1C", fontWeight: 600, lineHeight: 1.4 }}>{message}</span>
    </div>
  );
};

export default function StockPage() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Modal ajuster stock existant
  const [modalAdj, setModalAdj] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [formAdj,  setFormAdj]  = useState({ stock: 0, adjustment: 0, reason: "entree", note: "" });
  const [savingAdj, setSavingAdj] = useState(false);
  const [errorAdj,  setErrorAdj]  = useState(null);

  // Modal ajouter nouveau produit en stock
  const [modalNew, setModalNew] = useState(false);
  const [formNew,  setFormNew]  = useState({ productId: null, name: "", price: "", stock: "", description: "", image: "" });
  const [loadingNew, setLoadingNew] = useState(false);
  const [errorNew,   setErrorNew]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erreur ${res.status} lors du chargement des produits.`);
      }
      const data = await res.json();
      setRows(data.products ?? data ?? []);
    } catch (err) {
      console.error("Erreur chargement /api/products:", err);
      setLoadError(err.message || "Impossible de charger les produits depuis le serveur.");
      // On ne remplace plus les données par un jeu de démo silencieux :
      // ça masquait des vraies pannes d'API. On garde la liste vide et on
      // affiche l'erreur, plutôt que de faire croire que tout va bien.
      setRows([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Ajuster stock existant (avec historisation) ──────────
  const openAdj = (row) => {
    setEditing(row);
    setFormAdj({ stock: row.stock, adjustment: 0, reason: "entree", note: "" });
    setErrorAdj(null);
    setModalAdj(true);
  };

  const handleAdjust = async () => {
    if (!editing) return;
    setSavingAdj(true);
    setErrorAdj(null);
    try {
      const res = await fetch("/api/stock/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editing.id,
          type: formAdj.reason,
          quantity: parseInt(formAdj.adjustment) || 0,
          note: formAdj.note?.trim() || undefined,
        }),
      });

      // On lit toujours le corps JSON, même en cas d'erreur, pour
      // remonter le vrai message envoyé par le backend (ex: "Produit non trouvé").
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Le serveur a répondu ${res.status}.`);
      }

      setRows(prev => prev.map(r => r.id === editing.id ? { ...r, stock: data.stock } : r));
      setSavingAdj(false);
      setModalAdj(false);
    } catch (err) {
      console.error("Erreur POST /api/stock/movement:", err);
      // IMPORTANT : on n'écrit plus le stock en local ici. Un ajustement qui
      // échoue en base ne doit JAMAIS apparaître comme réussi dans l'écran :
      // ça donnait l'illusion que le stock était mis à jour alors que la
      // base de données restait inchangée.
      setErrorAdj(
        err.message.includes("Failed to fetch") || err.message.includes("NetworkError")
          ? "Impossible de contacter le serveur (route /api/stock/movement introuvable ou serveur backend arrêté)."
          : err.message
      );
      setSavingAdj(false);
      // Le modal reste ouvert pour que l'utilisateur voie l'erreur et puisse réessayer.
    }
  };

  // ── Ajouter nouveau produit ───────────────────────────────
  const handleNewProduct = async () => {
    if (!formNew.productId || !formNew.stock) return;
    setLoadingNew(true);
    setErrorNew(null);
    const payload = {
      name:        formNew.name.trim(),
      price:       parseFloat(formNew.price) || 0,
      stock:       parseInt(formNew.stock) || 0,
      description: formNew.description.trim(),
      image:       formNew.image.trim(),
    };
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Le serveur a répondu ${res.status}.`);
      }
      await load();
      setFormNew({ productId: null, name: "", price: "", stock: "", description: "", image: "" });
      setLoadingNew(false);
      setModalNew(false);
    } catch (err) {
      console.error("Erreur POST /api/products:", err);
      setErrorNew(
        err.message.includes("Failed to fetch") || err.message.includes("NetworkError")
          ? "Impossible de contacter le serveur (route /api/products introuvable ou serveur backend arrêté)."
          : err.message
      );
      setLoadingNew(false);
      // Le modal reste ouvert, plus d'ajout fantôme uniquement local.
    }
  };

  const fa = (k) => (e) => setFormAdj(prev => ({ ...prev, [k]: e.target.value }));
  const fn = (k) => (e) => setFormNew(prev => ({ ...prev, [k]: e.target.value }));

  const newStock = formAdj.reason === "correction"
    ? parseInt(formAdj.adjustment || 0)
    : formAdj.reason === "sortie"
      ? parseInt(formAdj.stock ?? 0) - parseInt(formAdj.adjustment || 0)
      : parseInt(formAdj.stock ?? 0) + parseInt(formAdj.adjustment || 0);

  const COLUMNS = [
    { key: "name", label: "Produit", render: (v, row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {row.image
          ? <img src={row.image} alt={v} style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: "1.5px solid #E8EAF6", flexShrink: 0 }} onError={e => e.target.style.display="none"} />
          : <div style={{ width: 56, height: 56, borderRadius: 10, background: "#F8F9FF", border: "1.5px solid #E8EAF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{IcoCube("#C4C9D8", 22)}</div>
        }
        <strong style={{ color: "#1B2559" }}>{v}</strong>
      </div>
    )},
    { key: "stock", label: "Quantité en stock", render: v => {
      const { label, color, bg } = STOCK_BADGE(v);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 120, height: 7, background: "#E8EAF6", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, (v / STOCK_BAR_MAX) * 100)}%`, height: "100%", background: color, borderRadius: 4, transition: "width .3s" }} />
          </div>
          <strong style={{ minWidth: 28, fontSize: 13 }}>{v}</strong>
          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: bg, color }}>{label}</span>
        </div>
      );
    }},
    { key: "price", label: "Prix unit.", render: v => `${Number(v).toFixed(2)} TND` },
    { key: "stockValue", label: "Valeur stock", render: (_v, row) => (
      <strong style={{ color: "#E83A8B" }}>{(row.stock * Number(row.price)).toFixed(2)} TND</strong>
    )},
  ];

  const FONT = "'Raleway', system-ui, sans-serif";

  return (
    <>
      {loadError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10,
          padding: "12px 16px", marginBottom: 16,
        }}>
          {IcoAlert("#EF4444", 18)}
          <span style={{ fontSize: 13, color: "#B91C1C", fontWeight: 600 }}>
            {loadError}
          </span>
          <button
            onClick={load}
            style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 8, border: "1px solid #FCA5A5", background: "#fff", color: "#B91C1C", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <AdminTable
        title="Gestion du Stock"
        icon={IcoWarehouse(COLOR, 22)}
        color={COLOR}
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        onEdit={openAdj}
        searchKeys={["name"]}
        addLabel="Nouveau produit"
        onAdd={() => { setErrorNew(null); setModalNew(true); }}
      />

      {/* ── Modal : Ajuster stock ── */}
      <AdminModal
        open={modalAdj}
        onClose={() => setModalAdj(false)}
        title={`Ajuster le stock — ${editing?.name}`}
        color={COLOR}
        onSubmit={handleAdjust}
        submitLabel={savingAdj ? "Enregistrement…" : "Valider l'ajustement"}
      >
        <ErrorBanner message={errorAdj} />

        {/* Produit + Stock actuel */}
        <div style={{ background: "#F8F9FF", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #E8EAF6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {editing?.image ? (
              <img src={editing.image} alt={editing?.name}
                style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1.5px solid #E8EAF6", flexShrink: 0 }}
                onError={e => e.target.style.display="none"}
              />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#E8EAF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {IcoCube("#8892B0", 20)}
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2559", fontFamily: FONT }}>{editing?.name}</div>
              <div style={{ fontSize: 11, color: "#8892B0", fontFamily: FONT }}>Stock actuel</div>
            </div>
          </div>
          <strong style={{ fontSize: 26, color: "#1B2559", fontFamily: FONT }}>{editing?.stock}</strong>
        </div>

        {/* Type de mouvement */}
        <FormField label="Type de mouvement">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {REASONS.map(({ value, label, Icon, color }) => (
              <button key={value} onClick={() => setFormAdj(prev => ({ ...prev, reason: value }))}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "12px 8px", borderRadius: 12, cursor: "pointer", fontFamily: FONT,
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

        {/* Quantité */}
        <FormField label={formAdj.reason === "correction" ? "Nouveau stock total" : "Quantité"} required>
          <FormInput
            type="number"
            value={formAdj.adjustment}
            onChange={fa("adjustment")}
            placeholder={formAdj.reason === "sortie" ? "Ex: 5" : "Ex: 10"}
          />
        </FormField>

        {/* Note (optionnel, enregistrée dans l'historique) */}
        <FormField label="Note (optionnel)">
          <FormInput
            value={formAdj.note}
            onChange={fa("note")}
            placeholder="Ex: Réception fournisseur, casse, inventaire annuel…"
          />
        </FormField>

        {/* Nouveau stock calculé */}
        <div style={{ background: `${COLOR}10`, border: `1.5px solid ${COLOR}30`, borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#8892B0", fontFamily: FONT }}>Nouveau stock</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#8892B0", textDecoration: "line-through" }}>{editing?.stock}</span>
            <span style={{ fontSize: 13, color: "#8892B0" }}>→</span>
            <strong style={{ fontSize: 24, color: COLOR, fontFamily: FONT }}>{newStock < 0 ? 0 : newStock}</strong>
          </div>
        </div>
      </AdminModal>

      {/* ── Modal : Nouveau produit ── */}
      <AdminModal
        open={modalNew}
        onClose={() => setModalNew(false)}
        title="Ajouter un nouveau produit en stock"
        color="#10B981"
        onSubmit={handleNewProduct}
        submitLabel={loadingNew ? "Enregistrement…" : "Ajouter au stock"}
      >
        <ErrorBanner message={errorNew} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          {IcoPackagePlus("#10B981", 20)}
          <span style={{ fontSize: 12, color: "#15803D", fontWeight: 600, fontFamily: FONT }}>
            Ce produit sera ajouté à la liste des produits avec le stock initial indiqué.
          </span>
        </div>

        <FormField label="Produit" required>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {rows.map(row => {
              const { label: stockLabel, color: stockColor, bg: stockBg } = STOCK_BADGE(row.stock);
              const selected = formNew.productId === row.id;
              return (
                <div
                  key={row.id}
                  onClick={() => setFormNew(prev => ({ ...prev, productId: row.id, name: row.name, price: String(row.price), image: row.image ?? "" }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${selected ? COLOR : "#E8EAF6"}`,
                    background: selected ? `${COLOR}08` : "#F8F9FF",
                    transition: "all .15s",
                  }}
                >
                  {row.image
                    ? <img src={row.image} alt={row.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1.5px solid #E8EAF6", flexShrink: 0 }} onError={e => e.target.style.display="none"} />
                    : <div style={{ width: 44, height: 44, borderRadius: 8, background: "#E8EAF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{IcoCube("#8892B0", 18)}</div>
                  }
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#1B2559", fontFamily: FONT }}>{row.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: "#8892B0", fontWeight: 600 }}>{row.stock} unités</span>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: stockBg, color: stockColor, border: `1px solid ${stockColor}30` }}>
                      {stockLabel}
                    </span>
                  </div>
                  {selected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Prix unitaire (TND)">
            <FormInput type="number" step="0.01" value={formNew.price} onChange={fn("price")} placeholder="0.00" />
          </FormField>
          <FormField label="Quantité initiale" required>
            <FormInput type="number" value={formNew.stock} onChange={fn("stock")} placeholder="Ex: 50" />
          </FormField>
        </div>

        <FormField label="Description (optionnel)">
          <FormInput value={formNew.description} onChange={fn("description")} placeholder="Description courte du produit" />
        </FormField>

        <FormField label="Image du produit (URL)">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <FormInput
              value={formNew.image}
              onChange={fn("image")}
              placeholder="https://exemple.com/image.jpg"
            />
            {formNew.image && (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={formNew.image} alt="preview"
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: "1.5px solid #E8EAF6", display: "block" }}
                  onError={e => e.target.style.display = "none"}
                />
                <button
                  onClick={() => setFormNew(prev => ({ ...prev, image: "" }))}
                  style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >×</button>
              </div>
            )}
          </div>
        </FormField>

        {formNew.name && formNew.stock && (
          <div style={{ background: "#F8F9FF", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8EAF6", marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "#8892B0", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10, fontFamily: FONT }}>Résumé</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {formNew.image ? (
                <img src={formNew.image} alt={formNew.name}
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1.5px solid #E8EAF6", flexShrink: 0 }}
                  onError={e => e.target.style.display="none"}
                />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "#E8EAF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {IcoCube("#8892B0", 20)}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1B2559", fontFamily: FONT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{formNew.name}</span>
                  <strong style={{ color: "#10B981", flexShrink: 0, marginLeft: 8 }}>{formNew.stock} unités</strong>
                </div>
                {formNew.price && (
                  <div style={{ fontSize: 12, color: "#8892B0", fontFamily: FONT }}>
                    Valeur initiale : <strong style={{ color: "#1B2559" }}>{(parseFloat(formNew.price) * parseInt(formNew.stock)).toFixed(2)} TND</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}