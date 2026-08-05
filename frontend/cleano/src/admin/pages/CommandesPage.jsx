// src/admin/pages/CommandesPage.jsx
import { useState, useEffect, useCallback } from "react";
import AdminTable from "../components/AdminTable";
import { AdminModal, FormField, FormSelect } from "../components/AdminModal";

const COLOR = "#F59E0B";
const FONT  = "'Raleway', system-ui, sans-serif";

const VILLES_ADEX = [
  {id:"1",name:"Ariana"},{id:"2",name:"Béja"},{id:"3",name:"Ben Arous"},
  {id:"4",name:"Bizerte"},{id:"5",name:"Gabès"},{id:"6",name:"Gafsa"},
  {id:"7",name:"Jendouba"},{id:"8",name:"Kairouan"},{id:"9",name:"Kasserine"},
  {id:"10",name:"Kébili"},{id:"11",name:"Le Kef"},{id:"12",name:"Mahdia"},
  {id:"13",name:"Manouba"},{id:"14",name:"Médenine"},{id:"15",name:"Monastir"},
  {id:"16",name:"Nabeul"},{id:"17",name:"Sfax"},{id:"18",name:"Sidi Bouzid"},
  {id:"19",name:"Siliana"},{id:"20",name:"Sousse"},{id:"21",name:"Tataouine"},
  {id:"22",name:"Tozeur"},{id:"23",name:"Tunis"},{id:"24",name:"Zaghouan"},
];

// ── Icons ─────────────────────────────────────────────────────
const IcoCommandes = (c=COLOR,s=22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IcoCheck = (s=12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoX = (s=12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoAdex = (s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IcoUser = (c="#8892B0",s=15) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoPackage = (c="#8892B0",s=15) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IcoRefresh = (s=12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IcoSearch = (s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IcoMinus = (s=12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcoPlus = (s=12) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IcoPrinter = (s=13) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const IcoManifest = (s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IcoSync = (s=14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const STATUS_MAP = {
  pending:    { label:"En attente", color:"#F59E0B", bg:"#FFFBEB" },
  processing: { label:"En cours",   color:"#6366F1", bg:"#EEF2FF" },
  shipped:    { label:"Expédié",    color:"#3B82F6", bg:"#EFF6FF" },
  delivered:  { label:"Livré",      color:"#10B981", bg:"#F0FDF4" },
  cancelled:  { label:"Annulé",     color:"#EF4444", bg:"#FEF2F2" },
};

const ADEX_COLORS = {
  "En Attente":            { color:"#F59E0B", bg:"#FFFBEB" },
  "En attente":            { color:"#F59E0B", bg:"#FFFBEB" },
  "Ramassé":               { color:"#6366F1", bg:"#EEF2FF" },
  "Au Dépôt":              { color:"#3B82F6", bg:"#EFF6FF" },
  "En Cours de Livraison": { color:"#8B5CF6", bg:"#F5F3FF" },
  "Reporté":               { color:"#F97316", bg:"#FFF7ED" },
  "Livré":                 { color:"#10B981", bg:"#F0FDF4" },
  "Retour":                { color:"#EF4444", bg:"#FEF2F2" },
};

const stockBadge = (stock) => {
  if (stock <= 0) return { label:"Rupture", color:"#EF4444", bg:"#FEF2F2" };
  if (stock <= 5) return { label:"Faible",  color:"#F59E0B", bg:"#FFFBEB" };
  return               { label:"En stock", color:"#10B981", bg:"#F0FDF4" };
};

const avatarColors = ["#E7398B","#6366F1","#10B981","#F59E0B","#3B82F6","#8B5CF6"];
const getAvatar = (name="") => ({
  initials: name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"?",
  color: avatarColors[name.charCodeAt(0) % avatarColors.length] ?? "#8892B0",
});

const EMPTY_ADEX = {
  nom_cli:"", ville_cli:"23", ContenuColis:"",
  nbr_colis:"1", type_colis_tab:"1",
  adr_cli:"", tel_cli:"", tel_cli2:"", tel_cli3:"",
  ttc_cmd:"", echange_cmd:"0", ancienne_commande_echange:"",
  produit_arecevoir:"", commentaire_cmd:"", code_barres_ext:"", fragile:"0",
};

const IS = {
  padding:"9px 13px", border:"1.5px solid #E8EAF6", borderRadius:10,
  fontSize:13, outline:"none", background:"#F8F9FF", color:"#1B2559",
  width:"100%", boxSizing:"border-box", fontFamily:FONT,
};
const focus = e => e.target.style.borderColor = COLOR;
const blur  = e => e.target.style.borderColor = "#E8EAF6";

// ══════════════════════════════════════════════════════════════
// ── Multi-select produits ─────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const ProductMultiSelect = ({ selected, onChange }) => {
  const [products,  setProducts]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => { setProducts(d.products ?? d ?? []); setLoading(false); })
      .catch(() => {
        setProducts([
          { id:1, name:"Anti-Calcaire",          price:15, stock:100, image:"/image00001.png", badges:["Nouveau"] },
          { id:2, name:"Nettoyant Vitres",        price:15, stock:100, image:"/image00002.png", badges:["Nouveau"] },
          { id:3, name:"Super Dégraissant",       price:15, stock:100, image:"/image00003.png", badges:["Nouveau"] },
          { id:4, name:"Spécial Tissu",           price:15, stock:5,   image:"/image00004.png", badges:[] },
          { id:5, name:"Multi-Usage Sanitaire",   price:15, stock:0,   image:"/image00005.png", badges:[] },
          { id:6, name:"Super Anti-Tache",        price:15, stock:100, image:"/product-vitres.png", badges:[] },
        ]);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (id) => selected.some(s => s.id === id);

  const toggle = (product) => {
    if (isSelected(product.id)) {
      onChange(selected.filter(s => s.id !== product.id));
    } else {
      onChange([...selected, { ...product, qty: 1 }]);
    }
  };

  const setQty = (id, qty) => {
    if (qty < 1) return;
    onChange(selected.map(s => s.id === id ? { ...s, qty } : s));
  };

  const totalAmount = selected.reduce((sum, s) => sum + (parseFloat(s.price) * s.qty), 0);

  return (
    <div>
      {/* ── Produits sélectionnés ── */}
      {selected.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:600, color:"#10B981", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>
            {selected.length} produit{selected.length>1?"s":""} sélectionné{selected.length>1?"s":""}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {selected.map(s => {
              const sb = stockBadge(s.stock ?? 0);
              return (
                <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10, background:"#F0FDF4", border:"1.5px solid #86EFAC", borderRadius:10, padding:"8px 12px" }}>
                  {/* Image */}
                  <div style={{ width:36, height:36, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#E8EAF6", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {s.image
                      ? <img src={s.image} alt={s.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
                      : <span style={{ fontSize:10, color:"#8892B0" }}>?</span>
                    }
                  </div>
                  {/* Nom + stock */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1B2559", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                      <span style={{ fontSize:10, fontWeight:600, color:"#E7398B" }}>{Number(s.price).toFixed(2)} TND</span>
                      <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:sb.bg, color:sb.color }}>{sb.label}</span>
                    </div>
                  </div>
                  {/* Quantité */}
                  <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                    <button type="button" onClick={() => setQty(s.id, s.qty - 1)}
                      style={{ width:22, height:22, borderRadius:6, border:"1.5px solid #86EFAC", background:"#fff", color:"#10B981", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {IcoMinus(10)}
                    </button>
                    <span style={{ fontSize:12, fontWeight:700, color:"#1B2559", minWidth:20, textAlign:"center" }}>{s.qty}</span>
                    <button type="button" onClick={() => setQty(s.id, s.qty + 1)}
                      style={{ width:22, height:22, borderRadius:6, border:"1.5px solid #86EFAC", background:"#fff", color:"#10B981", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {IcoPlus(10)}
                    </button>
                  </div>
                  {/* Sous-total */}
                  <div style={{ fontSize:12, fontWeight:700, color:"#10B981", minWidth:56, textAlign:"right", flexShrink:0 }}>
                    {(parseFloat(s.price) * s.qty).toFixed(2)}
                  </div>
                  {/* Supprimer */}
                  <button type="button" onClick={() => toggle(s)}
                    style={{ width:22, height:22, borderRadius:6, border:"none", background:"#FEE2E2", color:"#EF4444", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {IcoX(10)}
                  </button>
                </div>
              );
            })}
          </div>
          {/* Total */}
          <div style={{ marginTop:8, display:"flex", justifyContent:"flex-end", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:"#8892B0" }}>Total produits :</span>
            <span style={{ fontSize:15, fontWeight:700, color:"#10B981" }}>{totalAmount.toFixed(3)} TND</span>
          </div>
        </div>
      )}

      {/* ── Recherche ── */}
      <div style={{ position:"relative", marginBottom:8 }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#8892B0", pointerEvents:"none" }}>{IcoSearch(13)}</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit…"
          style={{ ...IS, paddingLeft:32 }}
          onFocus={focus} onBlur={blur}
        />
      </div>

      {/* ── Liste produits ── */}
      <div style={{ border:"1.5px solid #E8EAF6", borderRadius:12, overflow:"hidden", maxHeight:260, overflowY:"auto" }}>
        {loading ? (
          <div style={{ padding:20, textAlign:"center", color:"#8892B0", fontSize:12 }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:20, textAlign:"center", color:"#8892B0", fontSize:12 }}>Aucun produit trouvé</div>
        ) : filtered.map((p, i) => {
          const sel = isSelected(p.id);
          const sb  = stockBadge(p.stock ?? 0);
          const outOfStock = (p.stock ?? 0) <= 0;
          return (
            <div key={p.id}
              onClick={() => !outOfStock && toggle(p)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px",
                background: sel ? "#FFFBEB" : i%2===0 ? "#fff" : "#FAFAFD",
                borderBottom: i < filtered.length-1 ? "1px solid #F0F1F8" : "none",
                cursor: outOfStock ? "not-allowed" : "pointer",
                opacity: outOfStock ? 0.55 : 1,
                transition:"background .15s",
              }}
              onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.background = sel ? "#FEF3C7" : "#F8F9FF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = sel ? "#FFFBEB" : i%2===0 ? "#fff" : "#FAFAFD"; }}
            >
              {/* Checkbox */}
              <div style={{
                width:18, height:18, borderRadius:5, flexShrink:0,
                border: `2px solid ${sel ? COLOR : "#DDDEE8"}`,
                background: sel ? COLOR : "#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s",
              }}>
                {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>

              {/* Image */}
              <div style={{ width:40, height:40, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#F8F9FF", border:"1px solid #E8EAF6", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {p.image
                  ? <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
                  : <span style={{ color:"#C4C9D8", fontSize:18 }}>📦</span>
                }
              </div>

              {/* Nom + description */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1B2559", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#E7398B" }}>{Number(p.price).toFixed(2)} TND</span>
                  <span style={{ fontSize:9, fontWeight:700, padding:"1px 7px", borderRadius:20, background:sb.bg, color:sb.color, border:`1px solid ${sb.color}30` }}>
                    {sb.label}{(p.stock??0)>0 ? ` (${p.stock})` : ""}
                  </span>
                  {(p.badges??[]).slice(0,2).map(b => (
                    <span key={b} style={{ fontSize:9, fontWeight:700, padding:"1px 7px", borderRadius:20, background:"#6366F118", color:"#6366F1", border:"1px solid #6366F130" }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Prix × stock */}
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#8892B0" }}>Stock</div>
                <div style={{ fontSize:13, fontWeight:700, color: sb.color }}>{p.stock ?? 0}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Drawer détail commande ────────────────────────────────────
const OrderDrawer = ({ order, onClose, onRefreshAdex }) => {
  if (!order) return null;
  const { label:statusLabel, color:statusColor, bg:statusBg } = STATUS_MAP[order.status] ?? { label:order.status, color:"#8892B0", bg:"#F1F5F9" };
  const { initials, color:avatarColor } = getAvatar(order.user_name ?? "");
  const confirmed = order.confirmed === true || order.confirmed === 1;
  const hasAdex   = !!order.tracking_adex;
  const adexC     = ADEX_COLORS[order.adex_status] ?? { color:"#8892B0", bg:"#F8F9FF" };
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleRefresh = async () => {
    if (!order.tracking_adex) return;
    setRefreshLoading(true);
    try {
      const res  = await fetch("/api/adex/track_status", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ num_suivi_cmd: order.tracking_adex }) });
      const data = await res.json();
      const etat = data.result_content?.etat ?? null;
      if (etat) onRefreshAdex?.(order.id, etat);
    } catch {}
    setRefreshLoading(false);
  };

  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(27,37,89,0.35)",backdropFilter:"blur(3px)"}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(480px,100vw)",zIndex:510,background:"#fff",boxShadow:"-8px 0 40px rgba(27,37,89,0.15)",display:"flex",flexDirection:"column",overflowY:"auto",animation:"slideIn .25s ease"}}>
        <div style={{height:4,background:`linear-gradient(90deg,${COLOR},#E7398B)`,flexShrink:0}}/>
        <div style={{padding:"20px 24px 16px",borderBottom:"1px solid #E8EAF6",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <p style={{fontSize:11,fontWeight:500,color:"#8892B0",margin:0,textTransform:"uppercase",letterSpacing:".08em"}}>Détail commande</p>
            <h2 style={{fontSize:18,fontWeight:500,color:"#1B2559",margin:"4px 0 0"}}>#{order.id}</h2>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:500,background:statusBg,color:statusColor}}>{statusLabel}</span>
            <span style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,display:"inline-flex",alignItems:"center",gap:5,background:confirmed?"#EFF6FF":"#F3F4F6",color:confirmed?"#3B82F6":"#6B7280"}}>
              {confirmed?IcoCheck(11):IcoX(11)}{confirmed?"Confirmé":"Non confirmé"}
            </span>
            <button type="button" onClick={onClose} style={{width:32,height:32,borderRadius:8,background:"#F8F9FF",border:"1px solid #E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#8892B0"}}>{IcoX(16)}</button>
          </div>
        </div>
        <div style={{flex:1,padding:"20px 24px",display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              {IcoUser("#8892B0",15)}
              <span style={{fontSize:11,fontWeight:500,color:"#8892B0",textTransform:"uppercase",letterSpacing:".08em"}}>Informations client</span>
            </div>
            <div style={{background:"#F8F9FF",borderRadius:14,border:"1px solid #E8EAF6",padding:"16px 18px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:`${avatarColor}20`,color:avatarColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:500,flexShrink:0}}>{initials}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:500,color:"#1B2559"}}>{order.user_name??`Client #${order.user_id}`}</div>
                <div style={{fontSize:12,color:"#8892B0",marginTop:3}}>Commande du {order.created_at?String(order.created_at).slice(0,10):"—"}</div>
              </div>
            </div>
          </div>
          {Array.isArray(order.produits) && order.produits.length > 0 && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                {IcoPackage("#8892B0",15)}
                <span style={{fontSize:11,fontWeight:500,color:"#8892B0",textTransform:"uppercase",letterSpacing:".08em"}}>Produits commandés</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {order.produits.map((it,i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#F8F9FF",border:"1px solid #E8EAF6",borderRadius:10,padding:"10px 14px"}}>
                    <span style={{fontSize:13,color:"#1B2559"}}><strong>{it.quantity}×</strong> {it.product_name}</span>
                    <span style={{fontSize:12,color:"#8892B0"}}>{Number(it.unit_price).toFixed(2)} TND / unité</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasAdex && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                {IcoAdex(15)}
                <span style={{fontSize:11,fontWeight:500,color:"#8892B0",textTransform:"uppercase",letterSpacing:".08em"}}>Livraison ADEX</span>
              </div>
              <div style={{background:"#FFFBEB",borderRadius:14,border:"1.5px solid #FCD34D",padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:10,color:"#92400E",fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>N° de suivi</div>
                    <code style={{fontSize:15,fontWeight:600,color:"#1B2559",background:"#FEF3C7",padding:"3px 10px",borderRadius:6}}>{order.tracking_adex}</code>
                  </div>
                  {order.adex_status&&<span style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:500,background:adexC.bg,color:adexC.color}}>{order.adex_status}</span>}
                </div>
                {order.url_bl_adex&&<a href={order.url_bl_adex} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,color:"#D97706",fontSize:12,fontWeight:500,textDecoration:"none",marginBottom:10}}>🖨️ Imprimer le bon de livraison</a>}
                <button type="button" onClick={handleRefresh} disabled={refreshLoading}
                  style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1.5px solid #FCD34D",background:"#fff",color:"#D97706",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:FONT,opacity:refreshLoading?0.7:1}}>
                  {IcoRefresh(12)}{refreshLoading?"…":"Rafraîchir statut ADEX"}
                </button>
              </div>
            </div>
          )}
          <div style={{background:`${COLOR}08`,border:`1.5px solid ${COLOR}30`,borderRadius:14,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:500,color:"#8892B0"}}>Total commande</span>
            <span style={{fontSize:22,fontWeight:500,color:"#10B981"}}>{Number(order.total).toFixed(2)} TND</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background:type==="success"?"#F0FDF4":type==="error"?"#FEF2F2":"#FFFBEB", border:`1.5px solid ${type==="success"?"#86EFAC":type==="error"?"#FCA5A5":"#FCD34D"}`, borderRadius:12, padding:"12px 18px", maxWidth:360, color:type==="success"?"#15803D":type==="error"?"#B91C1C":"#92400E", fontSize:13, fontWeight:500, fontFamily:FONT, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", animation:"slideInRight .3s ease" }}>
      {msg}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ── Modal ADEX ────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const AdexModal = ({ open, onClose, onSuccess }) => {
  const [form,     setForm]     = useState(EMPTY_ADEX);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");
  const [selProds, setSelProds] = useState([]); // produits sélectionnés

  useEffect(() => {
    if (open) { setForm(EMPTY_ADEX); setResult(null); setError(""); setLoading(false); setSelProds([]); }
  }, [open]);

  // Quand les produits changent → auto-remplir ContenuColis et ttc_cmd
  useEffect(() => {
    if (selProds.length === 0) return;
    const contenu = selProds.map(p => `${p.qty}x ${p.name}`).join(", ");
    const total   = selProds.reduce((s, p) => s + parseFloat(p.price) * p.qty, 0);
    const nbr     = selProds.reduce((s, p) => s + p.qty, 0);
    setForm(prev => ({
      ...prev,
      ContenuColis: contenu,
      ttc_cmd:      total.toFixed(3),
      nbr_colis:    String(nbr),
    }));
  }, [selProds]);

  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError(""); setResult(null); setLoading(true);
    try {
      const res = await fetch("/api/adex/add_colis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nbr_colis:   parseInt(form.nbr_colis) || 1,
          ttc_cmd:     parseFloat(form.ttc_cmd) || 0.001,
          echange_cmd: parseInt(form.echange_cmd),
          fragile:     parseInt(form.fragile),
          produits:    selProds.map(p => ({ id:p.id, name:p.name, qty:p.qty, price:p.price })),
        }),
      });
      const data = await res.json();
      if (data.num_suivi_cmd) { setResult(data); onSuccess?.(data); }
      else { setError(data?.error ?? data?.message ?? "Erreur lors de la création du colis."); }
    } catch { setError("Impossible de contacter le serveur ADEX."); }
    setLoading(false);
  };

  if (!open) return null;

  const LBL = { fontSize:11, fontWeight:500, color:"#8892B0", textTransform:"uppercase", letterSpacing:".07em" };
  const SEC = { fontSize:10, fontWeight:600, color:COLOR, textTransform:"uppercase", letterSpacing:".1em", borderBottom:"1px solid #E8EAF6", paddingBottom:6, marginBottom:12 };

  return (
    <div onMouseDown={e => { if (e.target===e.currentTarget) onClose(); }}
      style={{position:"fixed",inset:0,background:"rgba(27,37,89,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:620,maxHeight:"94vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(27,37,89,0.25)",overflow:"hidden"}}>
        <div style={{height:4,background:"linear-gradient(90deg,#F59E0B,#E7398B)",flexShrink:0}}/>
        {/* Header */}
        <div style={{padding:"18px 24px",borderBottom:"1px solid #E8EAF6",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"#FFF7ED",display:"flex",alignItems:"center",justifyContent:"center",color:COLOR}}>{IcoAdex(18)}</div>
            <div>
              <h2 style={{fontSize:15,fontWeight:500,color:"#1B2559",margin:0}}>Créer un colis ADEX</h2>
              <p style={{fontSize:11,color:"#8892B0",margin:0}}>Expédition via ADEX Delivery</p>
            </div>
          </div>
          <button type="button" onMouseDown={e=>e.stopPropagation()} onClick={onClose}
            style={{background:"#F8F9FF",border:"1px solid #E8EAF6",borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#8892B0"}}>{IcoX(16)}</button>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {result && (
            <div style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:14,padding:"18px 20px",marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:500,color:"#15803D",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>{IcoCheck(14)} Colis créé avec succès !</div>
              <div style={{fontSize:13,color:"#166534"}}>
                N° de suivi : <strong>{result.num_suivi_cmd}</strong>
                {result.url_bl&&<div style={{marginTop:6}}><a href={result.url_bl} target="_blank" rel="noreferrer" style={{color:"#16A34A",fontWeight:500,fontSize:12}}>📄 Imprimer le bon de livraison</a></div>}
              </div>
            </div>
          )}
          {error && <div style={{background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#B91C1C"}}>{error}</div>}

          {!result && (<>
            {/* ── Produits ── */}
            <div style={{...SEC, marginTop:0}}>🛒 Sélection des produits</div>
            <ProductMultiSelect selected={selProds} onChange={setSelProds}/>

            {/* ── Client ── */}
            <div style={{...SEC, marginTop:16}}>👤 Informations client</div>

            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
              <label style={LBL}>Nom complet <span style={{color:"#E7398B"}}>*</span></label>
              <input style={IS} value={form.nom_cli} onChange={set("nom_cli")} placeholder="Prénom Nom" onFocus={focus} onBlur={blur}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Ville <span style={{color:"#E7398B"}}>*</span></label>
                <select style={IS} value={form.ville_cli} onChange={set("ville_cli")}>{VILLES_ADEX.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Adresse <span style={{color:"#E7398B"}}>*</span></label>
                <input style={IS} value={form.adr_cli} onChange={set("adr_cli")} placeholder="Rue, quartier…" onFocus={focus} onBlur={blur}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              {["tel_cli","tel_cli2","tel_cli3"].map((k,i)=>(
                <div key={k} style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={LBL}>Tél. {i===0?"principal *":i+1}</label>
                  <input style={IS} value={form[k]} onChange={set(k)} placeholder={i===0?"9X XXX XXX":"Optionnel"} onFocus={focus} onBlur={blur}/>
                </div>
              ))}
            </div>

            {/* ── Colis ── */}
            <div style={{...SEC, marginTop:4}}>📦 Détails du colis</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Contenu <span style={{color:"#E7398B"}}>*</span></label>
                <input style={IS} value={form.ContenuColis} onChange={set("ContenuColis")} placeholder="Nom du produit" onFocus={focus} onBlur={blur}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Valeur (TND) <span style={{color:"#E7398B"}}>*</span></label>
                <input style={IS} type="number" step="0.001" value={form.ttc_cmd} onChange={set("ttc_cmd")} placeholder="0.000" onFocus={focus} onBlur={blur}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Nbr. colis *</label>
                <input style={IS} type="number" min="1" value={form.nbr_colis} onChange={set("nbr_colis")} onFocus={focus} onBlur={blur}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Taille *</label>
                <select style={IS} value={form.type_colis_tab} onChange={set("type_colis_tab")}>
                  <option value="0">Légère</option><option value="1">Moyenne</option><option value="2">Grande</option>
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Fragile</label>
                <select style={IS} value={form.fragile} onChange={set("fragile")}>
                  <option value="0">Non fragile</option><option value="1">Fragile</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
              <label style={LBL}>Référence externe</label>
              <input style={IS} value={form.code_barres_ext} onChange={set("code_barres_ext")} placeholder="Ex: CMD-1001" onFocus={focus} onBlur={blur}/>
            </div>

            {/* ── Type ── */}
            <div style={{...SEC}}>🔄 Type de commande</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={LBL}>Type</label>
                <select style={IS} value={form.echange_cmd} onChange={set("echange_cmd")}>
                  <option value="0">Commande normale</option><option value="1">Échange</option>
                </select>
              </div>
              {form.echange_cmd==="1"&&(
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={LBL}>Code ADEX échangé</label>
                  <input style={IS} value={form.ancienne_commande_echange} onChange={set("ancienne_commande_echange")} placeholder="Code ADEX" onFocus={focus} onBlur={blur}/>
                </div>
              )}
            </div>
            {form.echange_cmd==="1"&&(
              <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
                <label style={LBL}>Produit à recevoir</label>
                <input style={IS} value={form.produit_arecevoir} onChange={set("produit_arecevoir")} placeholder="Nom du produit retourné" onFocus={focus} onBlur={blur}/>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:4}}>
              <label style={LBL}>Commentaire</label>
              <textarea style={{...IS,resize:"vertical",minHeight:60}} value={form.commentaire_cmd} onChange={set("commentaire_cmd")} placeholder="Instructions de livraison…" onFocus={focus} onBlur={blur}/>
            </div>
          </>)}
        </div>

        {/* Footer */}
        <div style={{padding:"14px 24px",borderTop:"1px solid #E8EAF6",display:"flex",gap:10,justifyContent:"flex-end",alignItems:"center",background:"#F8F9FF",flexShrink:0}}>
          {!result && selProds.length > 0 && (
            <span style={{marginRight:"auto",fontSize:12,color:"#8892B0",fontFamily:FONT}}>
              {selProds.length} produit{selProds.length>1?"s":""} · <strong style={{color:"#10B981"}}>{selProds.reduce((s,p)=>s+parseFloat(p.price)*p.qty,0).toFixed(3)} TND</strong>
            </span>
          )}
          <button type="button" onMouseDown={e=>e.stopPropagation()} onClick={onClose}
            style={{background:"#fff",border:"1.5px solid #E8EAF6",borderRadius:10,padding:"9px 20px",fontSize:13,fontWeight:500,color:"#8892B0",cursor:"pointer",fontFamily:FONT}}>
            {result?"Fermer":"Annuler"}
          </button>
          {!result&&(
            <button type="button" onMouseDown={e=>e.stopPropagation()} onClick={handleSubmit} disabled={loading}
              style={{background:loading?"#FCD34D":`linear-gradient(135deg,${COLOR},#E7398B)`,color:"#fff",border:"none",borderRadius:10,padding:"9px 22px",fontSize:13,fontWeight:500,cursor:loading?"default":"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:8,opacity:loading?0.85:1}}>
              {loading?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{animation:"spin .8s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>:IcoAdex(14)}
              {loading?"Envoi en cours…":"Créer le colis ADEX"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ── Page principale ───────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
export default function CommandesPage() {
  const [rows,           setRows]           = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [modal,          setModal]          = useState(false);
  const [editing,        setEditing]        = useState(null);
  const [form,           setForm]           = useState({ status:"pending" });
  const [drawer,         setDrawer]         = useState(null);
  const [adexModal,      setAdexModal]      = useState(false);
  const [toast,          setToast]          = useState(null);
  const [confirmLoading, setConfirmLoading] = useState({});
  const [manifestLoading, setManifestLoading] = useState(false);
  const [syncLoading,     setSyncLoading]     = useState(false);

  // ── Filtre par mois ────────────────────────────────────────
  const [monthFilter, setMonthFilter] = useState("all");
  const [monthsList,  setMonthsList]  = useState([]);

  const showToast = (msg, type="success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // ⬆️ limit=1000 : récupère toutes les commandes (le backend limite à 10 par défaut)
      const params = new URLSearchParams({ limit: "1000" });
      if (monthFilter !== "all") params.set("month", monthFilter);

      const data = await fetch(`/api/orders?${params.toString()}`).then(r => r.json());
      setRows((data.orders ?? data ?? []).map(r => ({ confirmed:false, ...r })));
      setMonthsList(data.months ?? []);
    } catch(_) { setRows([]); }
    setLoading(false);
  }, [monthFilter]);

  useEffect(() => { load(); }, [load]);

  const toggleConfirm = async (row) => {
    const next = !row.confirmed;
    setConfirmLoading(prev => ({ ...prev, [row.id]: true }));
    try {
      const res  = await fetch(`/api/orders/${row.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ confirmed:next }) });
      const data = await res.json();
      setRows(prev => prev.map(r => r.id===row.id ? { ...r, ...data, confirmed:next } : r));
      setDrawer(prev => prev?.id===row.id ? { ...prev, ...data, confirmed:next } : prev);
      if (data.adex_action) {
        showToast(data.adex_action.deleted ? `✅ Colis ADEX ${row.tracking_adex} annulé` : `⚠️ ${data.adex_action.message}`, data.adex_action.deleted?"success":"error");
      }
    } catch(_) {
      setRows(prev => prev.map(r => r.id===row.id ? { ...r, confirmed:next } : r));
    }
    setConfirmLoading(prev => ({ ...prev, [row.id]: false }));
  };

  const openEdit = (row) => { setEditing(row); setForm({ status:row.status }); setModal(true); };

  const handleSubmit = async () => {
    try { await fetch(`/api/orders/${editing.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ status:form.status }) }); await load(); }
    catch(_) { setRows(prev => prev.map(r => r.id===editing.id ? { ...r, status:form.status } : r)); }
    setModal(false);
  };

  const handleDelete = async (row) => {
    try { await fetch(`/api/orders/${row.id}`, { method:"DELETE" }); await load(); }
    catch(_) { setRows(prev => prev.filter(r => r.id!==row.id)); }
    if (drawer?.id===row.id) setDrawer(null);
  };

  const handleAdexSuccess = (adexData) => {
    if (drawer) {
      const updated = { ...drawer, tracking_adex:adexData.num_suivi_cmd, adex_status:adexData.etat_cmd??"En attente", url_bl_adex:adexData.url_bl??null };
      setRows(prev => prev.map(r => r.id===drawer.id ? updated : r));
      setDrawer(updated);
    } else {
      const newRow = {
        id:            `ADEX-${Date.now()}`,
        user_name:     adexData.raw?.nom_cli ?? "—",
        user_id:       null,
        total:         parseFloat(adexData.raw?.ttc_cmd) || 0,
        status:        "pending",
        created_at:    new Date().toISOString().slice(0,10),
        items_count:   adexData.raw?.nbr_colis ?? 1,
        confirmed:     false,
        tracking_adex: adexData.num_suivi_cmd,
        adex_status:   adexData.etat_cmd ?? "En attente",
        url_bl_adex:   adexData.url_bl ?? null,
      };
      setRows(prev => [newRow, ...prev]);
    }
    showToast(`✅ Colis ${adexData.num_suivi_cmd} créé avec succès`, "success");
  };

  const handleRefreshAdex = (orderId, newStatus) => {
    setRows(prev => prev.map(r => r.id===orderId ? { ...r, adex_status:newStatus } : r));
    setDrawer(prev => prev?.id===orderId ? { ...prev, adex_status:newStatus } : prev);
  };

  const handleManifest = async () => {
    setManifestLoading(true);
    try {
      const res  = await fetch("/api/adex/manifest", { method:"POST" });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        showToast("📋 Manifeste généré — impression lancée", "success");
      } else {
        showToast(`⚠️ ${data.error ?? "Erreur lors de la génération du manifeste"}`, "error");
      }
    } catch (_) {
      showToast("⚠️ Impossible de contacter ADEX pour le manifeste", "error");
    }
    setManifestLoading(false);
  };

  const handleSync = async (scope="today") => {
    setSyncLoading(true);
    try {
      const res  = await fetch("/api/adex/sync", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ scope }) });
      const data = await res.json();
      if (typeof data.updated === "number") {
        showToast(`🔄 Synchro (${scope==="all"?"tout l'historique":"aujourd'hui"}) : ${data.updated} mise${data.updated>1?"s":""} à jour, ${data.deleted} supprimée${data.deleted>1?"s":""}`, "success");
        await load();
      } else {
        showToast(`⚠️ ${data.error ?? "Erreur de synchronisation"}`, "error");
      }
    } catch (_) {
      showToast("⚠️ Impossible de contacter le serveur pour la synchronisation", "error");
    }
    setSyncLoading(false);
  };

  const totalRevenue = rows.filter(r => r.status!=="cancelled").reduce((s,r) => s+Number(r.total), 0);

  // ── Colonnes : Tracking ADEX en premier (N° Commande retiré) ──
  const COLUMNS = [
    { key:"tracking_adex", label:"Tracking ADEX", render:v => v
      ? <code style={{background:"#FEF3C7",color:"#92400E",padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:500}}>{v}</code>
      : <span style={{color:"#C4C9D8",fontSize:11}}>—</span>
    },
    { key:"user_name", label:"Client", render:(v,row) => {
      const { initials, color } = getAvatar(v??"");
      return (
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:`${color}20`,color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,flexShrink:0}}>{initials}</div>
          <span style={{fontWeight:500,color:"#1B2559"}}>{v??`Client #${row.user_id}`}</span>
        </div>
      );
    }},
    { key:"produits", label:"Produits", render:(v) => {
      const items = Array.isArray(v) ? v : [];
      if (items.length === 0) return <span style={{color:"#C4C9D8",fontSize:11}}>—</span>;
      return (
        <div style={{display:"flex",flexDirection:"column",gap:2,maxWidth:200}}>
          {items.slice(0,2).map((it,i) => (
            <span key={i} title={`${it.quantity}× ${it.product_name}`} style={{
              display:"block", maxWidth:200,
              fontSize:12, color:"#1B2559",
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            }}>
              <strong>{it.quantity}×</strong> {it.product_name}
            </span>
          ))}
          {items.length>2 && <span style={{fontSize:11,color:"#8892B0"}}>+{items.length-2} autre{items.length-2>1?"s":""}…</span>}
        </div>
      );
    }},
    { key:"_print", label:"BL", render:(_,row) => row.tracking_adex ? (
      <a href={`/api/adex/print/${encodeURIComponent(row.tracking_adex)}`} target="_blank" rel="noreferrer"
        onClick={e=>e.stopPropagation()}
        style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:30,height:30,borderRadius:8,background:"#EFF6FF",color:"#3B82F6",border:"1px solid #BFDBFE"}}
        title="Imprimer le bon de livraison">
        {IcoPrinter(14)}
      </a>
    ) : <span style={{color:"#C4C9D8",fontSize:11}}>—</span> },
    { key:"total", label:"Total", render:v => <span style={{color:"#10B981",fontWeight:500}}>{Number(v).toFixed(2)} TND</span> },
    { key:"adex_status", label:"Statut ADEX", render:v => {
      if (!v) return <span style={{color:"#C4C9D8",fontSize:11}}>—</span>;
      const c = ADEX_COLORS[v] ?? { color:"#8892B0", bg:"#F1F5F9" };
      return <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,background:c.bg,color:c.color}}>{v}</span>;
    }},
    { key:"status", label:"Statut", render:v => {
      const { label,color,bg } = STATUS_MAP[v] ?? { label:v, color:"#8892B0", bg:"#F1F5F9" };
      return <span style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:500,background:bg,color}}>{label}</span>;
    }},
    { key:"created_at", label:"Date", render:v => <span style={{color:"#8892B0",fontSize:12}}>{v?String(v).slice(0,10):"—"}</span> },
    { key:"confirmed", label:"Confirmation", render:(v,row) => {
      const confirmed = v===true||v===1;
      const isLoading = confirmLoading[row.id];
      return (
        <button type="button" onClick={e=>{e.stopPropagation();if(!isLoading)toggleConfirm(row);}} disabled={isLoading}
          style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,cursor:isLoading?"default":"pointer",fontSize:11,fontWeight:500,border:"none",background:isLoading?"#E5E7EB":confirmed?"#0fb0f5":"#E5E7EB",color:confirmed?"#fff":"#6B7280",fontFamily:FONT,opacity:isLoading?0.7:1 }}
          onMouseEnter={e=>{if(!isLoading)e.currentTarget.style.background=confirmed?"#2563EB":"#D1D5DB";}}
          onMouseLeave={e=>{if(!isLoading)e.currentTarget.style.background=confirmed?"#0fb0f5":"#E5E7EB";}}>
          {isLoading?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin .8s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>:(confirmed?IcoCheck():IcoX())}
          {isLoading?"…":(confirmed?"Confirmé":"Non confirmé")}
        </button>
      );
    }},
  ];

  return (
    <>
      <style>{`
        @keyframes slideIn      {from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes slideInRight {from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin         {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        /* ── Responsive : barre d'actions (4 boutons) de CommandesPage ── */
        .cmd-extra-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
        }
        .cmd-extra-actions > button {
          flex: 1 1 auto;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .cmd-extra-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          .cmd-extra-actions > button {
            width: 100%;
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .cmd-extra-actions {
            grid-template-columns: 1fr;
          }
          .cmd-extra-actions > button {
            font-size: 12px !important;
            padding: 10px 12px !important;
          }
        }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
        {[
          { label:"CA total",   value:`${totalRevenue.toFixed(2)} TND`, color:"#10B981" },
          { label:"Confirmées", value:rows.filter(r=>r.confirmed).length, color:"#0fb0f5" },
          { label:"Avec ADEX",  value:rows.filter(r=>r.tracking_adex).length, color:"#F59E0B" },
          ...Object.entries(STATUS_MAP).map(([k,{label,color}])=>({ label, value:rows.filter(r=>r.status===k).length, color })),
        ].map(({label,value,color})=>(
          <div key={label} style={{background:"#fff",borderRadius:12,border:"1px solid #E8EAF6",padding:"14px 18px"}}>
            <div style={{fontSize:20,fontWeight:500,color}}>{value}</div>
            <div style={{fontSize:11,color:"#8892B0",fontWeight:500,marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Filtre par mois ──────────────────────────────────── */}
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        marginBottom:16, flexWrap:"wrap",
      }}>
        <label style={{fontSize:12, fontWeight:600, color:"#8892B0", fontFamily:FONT}}>Filtrer par mois :</label>
        <select
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          style={{
            padding:"8px 14px", borderRadius:10, border:"1.5px solid #E8EAF6",
            fontSize:13, fontFamily:FONT, background:"#fff", color:"#1B2559",
            cursor:"pointer", outline:"none",
          }}
        >
          <option value="all">Tous les mois</option>
          {monthsList.map(m => (
            <option key={m.month} value={m.month}>
              {m.month} ({m.count} commande{Number(m.count) > 1 ? "s" : ""})
            </option>
          ))}
        </select>
        {monthFilter !== "all" && (
          <button
            type="button"
            onClick={() => setMonthFilter("all")}
            style={{
              padding:"8px 14px", borderRadius:10, border:"1.5px solid #FCA5A5",
              background:"#FEF2F2", color:"#B91C1C", fontSize:12, fontWeight:600,
              cursor:"pointer", fontFamily:FONT,
            }}
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <AdminTable
        title="Gestion des Commandes"
        icon={IcoCommandes(COLOR,22)} color={COLOR}
        columns={COLUMNS} rows={rows} loading={loading}
        onEdit={openEdit} onDelete={handleDelete}
        onRowClick={row=>setDrawer(row)}
        searchKeys={["user_name","tracking_adex"]}
        extra={
          <div className="cmd-extra-actions">
            <button type="button" onClick={()=>handleSync("today")} disabled={syncLoading}
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,cursor:syncLoading?"default":"pointer",fontSize:13,fontWeight:500,border:"1.5px solid #E8EAF6",background:"#fff",color:"#1B2559",fontFamily:FONT,opacity:syncLoading?0.7:1}}>
              {syncLoading?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin .8s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>:IcoSync(14)}
              {syncLoading?"Synchro…":"Synchroniser (jour)"}
            </button>
            <button type="button" onClick={()=>handleSync("all")} disabled={syncLoading}
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,cursor:syncLoading?"default":"pointer",fontSize:12,fontWeight:500,border:"1.5px solid #E8EAF6",background:"#fff",color:"#8892B0",fontFamily:FONT,opacity:syncLoading?0.7:1}}
              title="Vérifie et met à jour TOUTES les commandes ayant un tracking ADEX, sans limite de date">
              {IcoSync(13)} Tout l'historique
            </button>
            <button type="button" onClick={handleManifest} disabled={manifestLoading}
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,cursor:manifestLoading?"default":"pointer",fontSize:13,fontWeight:500,border:"1.5px solid #E8EAF6",background:"#fff",color:"#1B2559",fontFamily:FONT,opacity:manifestLoading?0.7:1}}>
              {IcoManifest(14)}{manifestLoading?"…":"Manifeste du jour"}
            </button>
            <button type="button" onClick={()=>setAdexModal(true)}
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:500,border:"none",background:`linear-gradient(135deg,${COLOR},#F97316)`,color:"#fff",boxShadow:"0 2px 10px rgba(245,158,11,.35)",fontFamily:FONT}}>
              {IcoAdex(14)} Nouveau colis ADEX
            </button>
          </div>
        }
      />

      <OrderDrawer order={drawer} onClose={()=>setDrawer(null)} onRefreshAdex={handleRefreshAdex}/>
      <AdexModal open={adexModal} onClose={()=>setAdexModal(false)} onSuccess={handleAdexSuccess}/>

      <AdminModal open={modal} onClose={()=>setModal(false)} title={`Commande #${editing?.id} — Statut`} color={COLOR} onSubmit={handleSubmit} submitLabel="Mettre à jour">
        <div style={{background:"#F8F9FF",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
          <div style={{fontSize:12,color:"#8892B0"}}>Client</div>
          <div style={{fontWeight:500,color:"#1B2559"}}>{editing?.user_name}</div>
          <div style={{fontSize:13,color:"#10B981",fontWeight:500,marginTop:4}}>Total : {Number(editing?.total??0).toFixed(2)} TND</div>
        </div>
        <FormField label="Nouveau statut">
          <FormSelect value={form.status} onChange={e=>setForm({status:e.target.value})}>
            {Object.entries(STATUS_MAP).map(([k,{label}])=><option key={k} value={k}>{label}</option>)}
          </FormSelect>
        </FormField>
      </AdminModal>
    </>
  );
}