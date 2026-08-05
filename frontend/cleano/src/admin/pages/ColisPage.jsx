// src/admin/pages/ColisPage.jsx
import { useState, useEffect, useCallback } from "react";
import AdminTable from "../components/AdminTable";
import { AdminModal, FormField, FormInput, FormSelect } from "../components/AdminModal";

const COLOR = "#10B981";
const ADEX_COLOR = "#F59E0B";
const FONT  = "'Raleway', system-ui, sans-serif";

const EMPTY = {
  order_id: "", client_name: "", address: "",
  tracking_number: "", carrier: "ADEX",
  status: "preparation", estimated_date: "",
};

const VILLES_ADEX = [
  {id:1,name:"Ariana"},{id:2,name:"Beja"},{id:3,name:"Ben Arous"},
  {id:4,name:"Bizerte"},{id:5,name:"Gabes"},{id:6,name:"Gafsa"},
  {id:7,name:"Jendouba"},{id:8,name:"Kairouan"},{id:9,name:"Kasserine"},
  {id:10,name:"Kebili"},{id:11,name:"Le Kef"},{id:12,name:"Mahdia"},
  {id:13,name:"Mannouba"},{id:14,name:"Medenine"},{id:15,name:"Monastir"},
  {id:16,name:"Nabeul"},{id:17,name:"Sfax"},{id:18,name:"Sidi Bouzid"},
  {id:19,name:"Siliana"},{id:20,name:"Sousse"},{id:21,name:"Tataouine"},
  {id:22,name:"Tozeur"},{id:23,name:"Tunis"},{id:24,name:"Zaghouan"},
];

const EMPTY_ADEX = {
  nom_cli:"", ville_cli:"23", ContenuColis:"",
  nbr_colis:"1", type_colis_tab:"1",
  adr_cli:"", tel_cli:"", tel_cli2:"", tel_cli3:"",
  ttc_cmd:"", echange_cmd:"0", ancienne_commande_echange:"",
  produit_arecevoir:"", commentaire_cmd:"",
  code_barres_ext:"", fragile:"0",
};

// ── Input style stable ────────────────────────────────────────
const IS = {
  padding:"9px 13px", border:`1.5px solid #E8EAF6`, borderRadius:10,
  fontSize:13, outline:"none", background:"#F8F9FF", color:"#1B2559",
  width:"100%", boxSizing:"border-box", fontFamily:FONT,
  transition:"border-color .2s",
};
const focusAdex = e => e.target.style.borderColor = ADEX_COLOR;
const blurAdex  = e => e.target.style.borderColor = "#E8EAF6";

// ── Icons ─────────────────────────────────────────────────────
const IcoColis = (c=COLOR,s=22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IcoAdexIcon = (s=15) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IcoCheck = (s=28,c="#10B981") => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoX = (s=16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Status ────────────────────────────────────────────────────
const STATUS_MAP = {
  preparation:  {label:"Préparation", color:"#8B5CF6",bg:"#F5F3FF"},
  expedie:      {label:"Expédié",     color:"#3B82F6",bg:"#EFF6FF"},
  en_transit:   {label:"En transit",  color:"#F59E0B",bg:"#FFFBEB"},
  en_livraison: {label:"En livraison",color:"#F97316",bg:"#FFF7ED"},
  livre:        {label:"Livré ✓",     color:"#10B981",bg:"#F0FDF4"},
  echec:        {label:"Échec",       color:"#EF4444",bg:"#FEF2F2"},
  retour:       {label:"Retour",      color:"#6B7280",bg:"#F9FAFB"},
};

const CARRIERS = ["ADEX","Rapid Post","DHL","Chronopost","La Poste Tunisienne","TNT"];

// ── Label helper ──────────────────────────────────────────────
const L = ({children, required}) => (
  <label style={{fontSize:11,fontWeight:500,color:"#8892B0",letterSpacing:".07em",textTransform:"uppercase",marginBottom:4,display:"block"}}>
    {children}{required && <span style={{color:"#E7398B"}}> *</span>}
  </label>
);

// ── Section title ─────────────────────────────────────────────
const ST = ({label}) => (
  <div style={{fontSize:10,fontWeight:600,color:ADEX_COLOR,textTransform:"uppercase",letterSpacing:".1em",borderBottom:"1px solid #E8EAF6",paddingBottom:6,marginBottom:12,marginTop:10}}>
    {label}
  </div>
);

// ── Modal ADEX — composant 100% isolé ────────────────────────
function AdexModal({ open, onClose, onSuccess }) {
  const [form,    setForm]    = useState(EMPTY_ADEX);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (open) { setForm(EMPTY_ADEX); setResult(null); setError(""); setLoading(false); }
  }, [open]);

  const set = k => e => setForm(prev => ({...prev, [k]: e.target.value}));

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/adex/add_colis", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          nom_cli:form.nom_cli, ville_cli:form.ville_cli,
          ContenuColis:form.ContenuColis, nbr_colis:parseInt(form.nbr_colis),
          type_colis_tab:form.type_colis_tab, adr_cli:form.adr_cli,
          tel_cli:form.tel_cli, tel_cli2:form.tel_cli2, tel_cli3:form.tel_cli3,
          ttc_cmd:parseFloat(form.ttc_cmd), echange_cmd:parseInt(form.echange_cmd),
          ancienne_commande_echange:form.ancienne_commande_echange,
          produit_arecevoir:form.produit_arecevoir, commentaire_cmd:form.commentaire_cmd,
          code_barres_ext:form.code_barres_ext, fragile:parseInt(form.fragile),
        }),
      });
      const data = await res.json();
      if (data.num_suivi_cmd) {
        setResult(data);
        onSuccess?.({
          client_name:form.nom_cli,
          address:`${form.adr_cli}, ${VILLES_ADEX.find(v=>v.id===parseInt(form.ville_cli))?.name??""}`,
          tracking_number:data.num_suivi_cmd,
          order_id:form.code_barres_ext||"—",
        });
      } else {
        setError(data.message??data.error??"Erreur lors de la création.");
      }
    } catch {
      setError("Impossible de contacter le serveur ADEX.");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      onMouseDown={e => { if (e.target===e.currentTarget) onClose(); }}
      style={{position:"fixed",inset:0,background:"rgba(27,37,89,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}
    >
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:540,maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(27,37,89,0.25)",overflow:"hidden"}}>

        {/* Top bar */}
        <div style={{height:4,background:"linear-gradient(90deg,#F59E0B,#F97316)",flexShrink:0}}/>

        {/* Header */}
        <div style={{padding:"16px 24px",borderBottom:"1px solid #E8EAF6",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"#FFF7ED",display:"flex",alignItems:"center",justifyContent:"center",color:ADEX_COLOR}}>
              {IcoAdexIcon(18)}
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:600,color:"#1B2559"}}>Créer un colis ADEX</div>
              <div style={{fontSize:11,color:"#8892B0"}}>Expédition via ADEX Delivery</div>
            </div>
          </div>
          <button type="button" onMouseDown={e=>e.stopPropagation()} onClick={onClose}
            style={{background:"#F8F9FF",border:"1px solid #E8EAF6",borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#8892B0"}}>
            {IcoX(15)}
          </button>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>

          {/* Succès */}
          {result ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"20px 0",textAlign:"center"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {IcoCheck(30)}
              </div>
              <div>
                <div style={{fontSize:17,fontWeight:600,color:"#1B2559",marginBottom:6}}>Colis créé avec succès !</div>
                <div style={{fontSize:13,color:"#8892B0"}}>Enregistré dans le système ADEX.</div>
              </div>
              <div style={{background:"#F8F9FF",border:"1px solid #E8EAF6",borderRadius:12,padding:"16px 20px",width:"100%",boxSizing:"border-box"}}>
                <div style={{fontSize:10,color:"#8892B0",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>N° de suivi</div>
                <code style={{fontSize:18,fontWeight:600,color:"#1B2559",background:"#E8EAF6",padding:"5px 14px",borderRadius:8}}>{result.num_suivi_cmd}</code>
                {result.url_bl && (
                  <div style={{marginTop:12}}>
                    <a href={result.url_bl} target="_blank" rel="noreferrer" style={{color:ADEX_COLOR,fontSize:13,fontWeight:500,textDecoration:"none"}}>
                      🖨️ Imprimer le bon de commande
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#EF4444"}}>
                  ⚠️ {error}
                </div>
              )}

              <ST label="Informations client"/>

              <div style={{marginBottom:12}}>
                <L required>Nom complet du client</L>
                <input style={IS} value={form.nom_cli} onChange={set("nom_cli")} placeholder="Prénom Nom" onFocus={focusAdex} onBlur={blurAdex}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <L required>Ville</L>
                  <select style={IS} value={form.ville_cli} onChange={set("ville_cli")}
                    onFocus={focusAdex} onBlur={blurAdex}>
                    {VILLES_ADEX.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <L required>Adresse complète</L>
                  <input style={IS} value={form.adr_cli} onChange={set("adr_cli")} placeholder="Rue, quartier…" onFocus={focusAdex} onBlur={blurAdex}/>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div><L required>Tél. principal</L><input style={IS} value={form.tel_cli} onChange={set("tel_cli")} placeholder="9X XXX XXX" onFocus={focusAdex} onBlur={blurAdex}/></div>
                <div><L>Tél. 2</L><input style={IS} value={form.tel_cli2} onChange={set("tel_cli2")} placeholder="Optionnel" onFocus={focusAdex} onBlur={blurAdex}/></div>
                <div><L>Tél. 3</L><input style={IS} value={form.tel_cli3} onChange={set("tel_cli3")} placeholder="Optionnel" onFocus={focusAdex} onBlur={blurAdex}/></div>
              </div>

              <ST label="Détails du colis"/>

              <div style={{marginBottom:12}}>
                <L required>Contenu du colis</L>
                <input style={IS} value={form.ContenuColis} onChange={set("ContenuColis")} placeholder="Nom du produit" onFocus={focusAdex} onBlur={blurAdex}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div><L required>Valeur totale (TND)</L><input style={IS} type="number" step="0.001" value={form.ttc_cmd} onChange={set("ttc_cmd")} placeholder="0.000" onFocus={focusAdex} onBlur={blurAdex}/></div>
                <div><L>Référence externe</L><input style={IS} value={form.code_barres_ext} onChange={set("code_barres_ext")} placeholder="Ex: CMD-1001" onFocus={focusAdex} onBlur={blurAdex}/></div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <L required>Nbr. colis</L>
                  <input style={IS} type="number" min="1" value={form.nbr_colis} onChange={set("nbr_colis")} onFocus={focusAdex} onBlur={blurAdex}/>
                </div>
                <div>
                  <L required>Taille</L>
                  <select style={IS} value={form.type_colis_tab} onChange={set("type_colis_tab")} onFocus={focusAdex} onBlur={blurAdex}>
                    <option value="0">Légère</option>
                    <option value="1">Moyenne</option>
                    <option value="2">Grande</option>
                  </select>
                </div>
                <div>
                  <L>Fragile</L>
                  <select style={IS} value={form.fragile} onChange={set("fragile")} onFocus={focusAdex} onBlur={blurAdex}>
                    <option value="0">Non fragile</option>
                    <option value="1">Fragile</option>
                  </select>
                </div>
              </div>

              <ST label="Type de commande"/>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <L>Type</L>
                  <select style={IS} value={form.echange_cmd} onChange={set("echange_cmd")} onFocus={focusAdex} onBlur={blurAdex}>
                    <option value="0">Commande normale</option>
                    <option value="1">Échange</option>
                  </select>
                </div>
                {form.echange_cmd==="1" && (
                  <div>
                    <L>Code commande ADEX échangée</L>
                    <input style={IS} value={form.ancienne_commande_echange} onChange={set("ancienne_commande_echange")} placeholder="Code ADEX" onFocus={focusAdex} onBlur={blurAdex}/>
                  </div>
                )}
              </div>

              {form.echange_cmd==="1" && (
                <div style={{marginBottom:12}}>
                  <L>Produit à recevoir</L>
                  <input style={IS} value={form.produit_arecevoir} onChange={set("produit_arecevoir")} placeholder="Nom du produit retourné" onFocus={focusAdex} onBlur={blurAdex}/>
                </div>
              )}

              <div style={{marginBottom:4}}>
                <L>Commentaire</L>
                <textarea style={{...IS,resize:"vertical",minHeight:60}} value={form.commentaire_cmd} onChange={set("commentaire_cmd")} placeholder="Instructions de livraison…" onFocus={focusAdex} onBlur={blurAdex}/>
              </div>
            </>
          )}
        </div>

        {/* Footer stable */}
        <div style={{padding:"14px 24px",borderTop:"1px solid #E8EAF6",display:"flex",gap:10,justifyContent:"flex-end",background:"#F8F9FF",flexShrink:0}}>
          <button type="button" onMouseDown={e=>e.stopPropagation()} onClick={onClose}
            style={{background:"#fff",border:"1.5px solid #E8EAF6",borderRadius:10,padding:"9px 20px",fontSize:13,fontWeight:500,color:"#8892B0",cursor:"pointer",fontFamily:FONT}}>
            {result?"Fermer":"Annuler"}
          </button>
          {!result && (
            <button type="button" onMouseDown={e=>e.stopPropagation()} onClick={handleSubmit} disabled={loading}
              style={{background:loading?"#FCD34D":`linear-gradient(135deg,${ADEX_COLOR},#F97316)`,color:"#fff",border:"none",borderRadius:10,padding:"9px 22px",fontSize:13,fontWeight:500,cursor:loading?"default":"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:8,opacity:loading?0.85:1}}>
              {loading?(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{animation:"spin .8s linear infinite"}}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ):IcoAdexIcon(14)}
              {loading?"Envoi en cours…":"Créer le colis ADEX"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────
export default function ColisPage() {
  const [rows,      setRows]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [modalAdex, setModalAdex] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/colis").then(r=>r.json());
      setRows(data.colis??data??[]);
    } catch(_) {
      setRows([
        {id:1,order_id:1001,client_name:"Ahmed Ben Ali", address:"12 Rue Habib Bourguiba, Tunis",tracking_number:"TN123456789",carrier:"ADEX",      status:"livre",        estimated_date:"2024-03-05"},
        {id:2,order_id:1002,client_name:"Fatma Trabelsi",address:"45 Av. de la Liberté, Sfax",  tracking_number:"TN987654321",carrier:"ADEX",      status:"en_livraison", estimated_date:"2024-03-08"},
        {id:3,order_id:1003,client_name:"Mohamed Gharbi",address:"7 Rue du Commerce, Sousse",   tracking_number:"TN456789123",carrier:"DHL",       status:"en_transit",   estimated_date:"2024-03-12"},
        {id:4,order_id:1004,client_name:"Ahmed Ben Ali", address:"12 Rue Habib Bourguiba, Tunis",tracking_number:"TN321654987",carrier:"Rapid Post",status:"preparation",  estimated_date:"2024-03-15"},
      ]);
    }
    setLoading(false);
  },[]);

  useEffect(()=>{load();},[load]);

  const openAdd  = () => { setEditing(null); setForm({...EMPTY,tracking_number:`TN${Date.now()}`.slice(0,12)}); setModal(true); };
  const openEdit = row => { setEditing(row); setForm({...row}); setModal(true); };

  const handleSubmit = async () => {
    try {
      if (editing) await fetch(`/api/colis/${editing.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      else await fetch("/api/colis",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      await load();
    } catch(_) {
      if (editing) setRows(prev=>prev.map(r=>r.id===editing.id?{...r,...form}:r));
      else setRows(prev=>[...prev,{...form,id:Date.now()}]);
    }
    setModal(false);
  };

  const handleDelete = async row => {
    try { await fetch(`/api/colis/${row.id}`,{method:"DELETE"}); await load(); }
    catch(_) { setRows(prev=>prev.filter(r=>r.id!==row.id)); }
  };

  const handleAdexSuccess = newRow => {
    setRows(prev=>[...prev,{id:Date.now(),carrier:"ADEX",status:"preparation",estimated_date:"",...newRow}]);
  };

  const f = k => e => setForm(prev=>({...prev,[k]:e.target.value}));

  const COLUMNS = [
    {key:"tracking_number",label:"N° Suivi",render:v=><code style={{background:"#E8EAF6",padding:"2px 8px",borderRadius:6,fontSize:11,color:"#1B2559",fontWeight:500}}>{v}</code>},
    {key:"client_name",label:"Client",render:v=><span style={{fontWeight:500,color:"#1B2559"}}>{v}</span>},
    {key:"address",label:"Adresse",render:v=><span style={{fontSize:12,color:"#8892B0",maxWidth:180,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</span>},
    {key:"carrier",label:"Transporteur",render:v=>(
      <span style={{fontSize:11,fontWeight:500,background:v==="ADEX"?"#FFF7ED":"#F8F9FF",color:v==="ADEX"?ADEX_COLOR:"#8892B0",border:`1px solid ${v==="ADEX"?"#FCD34D":"#E8EAF6"}`,padding:"2px 8px",borderRadius:6}}>{v}</span>
    )},
    {key:"status",label:"Statut",render:v=>{
      const {label,color,bg}=STATUS_MAP[v]??{label:v,color:"#8892B0",bg:"#F1F5F9"};
      return <span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:500,background:bg,color}}>{label}</span>;
    }},
    {key:"estimated_date",label:"Livraison prévue",render:v=><span style={{fontSize:12,color:"#8892B0"}}>{v?String(v).slice(0,10):"—"}</span>},
  ];

  return (
    <>
      <AdminTable
        title="Gestion des Colis"
        icon={IcoColis(COLOR,22)}
        color={COLOR}
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchKeys={["client_name","tracking_number"]}
        addLabel="Nouveau colis"
        extra={
          <button type="button" onClick={()=>setModalAdex(true)}
            style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:10,background:`linear-gradient(135deg,${ADEX_COLOR},#F97316)`,color:"#fff",border:"none",fontSize:13,fontWeight:500,cursor:"pointer",boxShadow:"0 2px 10px rgba(245,158,11,.35)",fontFamily:FONT}}>
            {IcoAdexIcon(14)} Nouveau colis ADEX
          </button>
        }
      />

      {/* Modal standard */}
      <AdminModal open={modal} onClose={()=>setModal(false)} title={editing?"Modifier le colis":"Nouveau colis"} color={COLOR} onSubmit={handleSubmit} submitLabel={editing?"Mettre à jour":"Créer le colis"}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FormField label="N° Commande"><FormInput value={form.order_id} onChange={f("order_id")} placeholder="1001"/></FormField>
          <FormField label="N° de suivi"><FormInput value={form.tracking_number} onChange={f("tracking_number")} placeholder="TN123456789"/></FormField>
        </div>
        <FormField label="Nom du client" required><FormInput value={form.client_name} onChange={f("client_name")} placeholder="Prénom Nom"/></FormField>
        <FormField label="Adresse de livraison" required><FormInput value={form.address} onChange={f("address")} placeholder="Rue, Ville, Code postal"/></FormField>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FormField label="Transporteur">
            <FormSelect value={form.carrier} onChange={f("carrier")}>{CARRIERS.map(c=><option key={c} value={c}>{c}</option>)}</FormSelect>
          </FormField>
          <FormField label="Statut">
            <FormSelect value={form.status} onChange={f("status")}>
              {Object.entries(STATUS_MAP).map(([k,{label}])=><option key={k} value={k}>{label}</option>)}
            </FormSelect>
          </FormField>
        </div>
        <FormField label="Date de livraison estimée"><FormInput type="date" value={form.estimated_date} onChange={f("estimated_date")}/></FormField>
      </AdminModal>

      {/* Modal ADEX — composant isolé */}
      <AdexModal open={modalAdex} onClose={()=>setModalAdex(false)} onSuccess={handleAdexSuccess}/>
    </>
  );
}