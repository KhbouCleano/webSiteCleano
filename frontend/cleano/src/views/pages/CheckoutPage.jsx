// ============================================================
// src/views/pages/CheckoutPage.jsx
// ============================================================
import { useState, useMemo } from "react";
import { useCartController } from "../../controllers/useCartController";
import useAppStore from "../../store/useAppStore";

const FONT_FAMILY = "Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const INK   = "#2a326e";  // MODIFIÉ : nouvelle couleur principale
const INK60 = "rgba(42,50,110,0.60)";
const INK30 = "rgba(42,50,110,0.30)";
const MGNT  = "#E7398B";
const ROSE  = "#F472B6";
const OK    = "#10B981";
const FIXED_PRICE_TND = 13.5;
const HEADER_COLOR = "#2a326e";  // MODIFIÉ : aligné avec INK

/* ─── CSS ────────────────────────────────────────────────── */
const CSS = `
  .cw { max-width:1100px; margin:0 auto; padding:0 20px 56px; }
  @keyframes shimmer {
    0%   { background-position:0% 0%; }
    100% { background-position:200% 0%; }
  }

/* ── Image background mobile ── */
/* ── Image background mobile ── */
@media (max-width: 640px) {
  .bg-image {
    position: fixed !important;
    inset: auto !important;
    left: auto !important;
    right: -150px !important;
    top: auto !important;
    bottom: 120px !important;
    width: 500% !important;
    height: 60% !important;
    background-size: contain !important;
    background-position: right bottom !important;
    background-repeat: no-repeat !important;
    opacity: 0.35 !important;
    z-index: 0 !important;
  }
}
  /* Layout : formulaire seul */
  .co-layout {
    display: block;
    max-width: 520px;
  }

  /* Carte formulaire — 4 coins arrondis */
  .co-form-col {
    border: 2px solid #f9b5d7;
    border-radius: 20px;
    padding: clamp(28px,3.5vw,44px);
    padding-top: calc(clamp(28px,3.5vw,44px) + 4px);
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  @media(max-width:560px){
    .co-layout { max-width: 100%; }
  }
  @media(max-width:480px){
    .co-2c { grid-template-columns:1fr !important; }
    .co-brow { flex-direction:column !important; }
    .co-brow button { width:100% !important; flex:unset !important; }
  }

  /* Input */
  .ci {
    width:100%; box-sizing:border-box;
    padding:11px 14px;
    border: 1.5px solid rgba(255,255,255,0.50);
    border-radius: 12px;
    font-family: ${FONT_FAMILY};
    font-size:13px; font-weight:500;
    outline:none;
    color: #2a326e;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: border-color .2s, background .2s, box-shadow .2s;
    box-shadow: 0 1px 4px rgba(42,50,110,0.08);
  }
  .ci::placeholder {
    color: rgba(42,50,110,0.45);
    font-weight: 400;
  }
  .ci:focus {
    border-color: #E7398B;
    background: rgba(255,255,255,0.97);
    box-shadow: 0 0 0 3px rgba(231,57,139,0.18), 0 1px 4px rgba(42,50,110,0.08);
  }

  @keyframes shimmer {
    0%   { background-position:0% 0%; }
    100% { background-position:200% 0%; }
  }
`;

let _inj = false;
const injectCSS = () => {
  if (_inj || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = CSS;
  document.head.appendChild(s);
  _inj = true;
};

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  injectCSS();
  const { cartItems, clearCart } = useCartController();
  const navigate = useAppStore(s => s.navigate);
  const addToast = useAppStore(s => s.addToast);

  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ name:"", email:"", phone:"", address:"", city:"", zip:"" });

  const subtotal = cartItems.reduce((s,{qty}) => s + FIXED_PRICE_TND * qty, 0);
  const orderNum = useMemo(() => `CMD-${Math.floor(Math.random()*90000+10000)}`, []);
  const upd = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const confirmOrder = () => { clearCart(); setStep(3); addToast?.("Commande confirmée !"); };
const isMobileView = typeof window !== "undefined" && window.innerWidth <= 640;
const Bg = () => <>
  <div style={{
    position:"absolute",inset:0,
    background: "linear-gradient(135deg, rgba(42,50,110,0.54) 0%, rgba(255, 255, 255, 0.80) 20%, rgba(42,58,143,0) 5%, rgba(255, 255, 255, 0.80) 0%, rgba(231, 57, 139, 0.40) 100%)",
    zIndex:0,
  }}/>
  <div
    className="bg-image"
    style={{
      position:"absolute",inset:0,
      left:"15rem",
      backgroundImage:"url('/back-1.png')",
      backgroundSize:"cover",backgroundPosition:"center top",zIndex:1,
    }}
  />
</>;

  /* ── STEP 3 (MODIFIÉ) ── */
  if (step === 3) return (
    <div className="page-enter" style={{
      position:"relative",minHeight:"100vh",display:"flex",
      alignItems:"center",justifyContent:"center",
      marginTop:"calc(-1 * var(--header-h,72px))",
      padding:"calc(var(--header-h,72px) + 48px) 16px 48px",
      overflow:"hidden",
    }}>
      <Bg/>
      <div style={{
        textAlign:"center",width:"100%",maxWidth:480,
        background:"rgba(255,255,255,0.95)",
        backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",
        borderRadius:28,padding:"48px 36px",
        boxShadow:"0 20px 60px rgba(42,50,110,0.2)",
        border:"1px solid rgba(231,57,139,0.15)",
        position:"relative",zIndex:2,
      }}>
        {/* Cercle de confirmation */}
        <div style={{
          width:80,height:80,borderRadius:"50%",
          background:`linear-gradient(135deg, ${MGNT}, ${ROSE})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 20px",
          boxShadow:`0 8px 28px ${MGNT}66`
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily:FONT_FAMILY,
          fontSize:"clamp(24px,6vw,32px)",
          fontWeight:900,
          color: INK,  // Utilise #2a326e
          margin:"0 0 12px",
          letterSpacing:"-.02em"
        }}>
          Commande confirmée !
        </h1>

        {/* Message de remerciement */}
        <p style={{
          fontSize:15,
          color: INK60,
          fontFamily:FONT_FAMILY,
          margin:"0 0 20px",
          lineHeight:1.5
        }}>
          Merci ! Vous serez contacté pour confirmer la livraison.
        </p>

        {/* Badge paiement à la livraison */}
        <div style={{
          display:"inline-flex",
          alignItems:"center",
          gap:8,
          padding:"8px 18px",
          background:"rgba(16,185,129,0.12)",
          borderRadius:30,
          border:"1px solid rgba(16,185,129,0.3)",
          margin:"0 0 16px"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2" strokeLinecap="round">
            <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/>
          </svg>
          <span style={{
            fontSize:12,
            color: "#065f46",
            fontFamily:FONT_FAMILY,
            fontWeight:600
          }}>
            Paiement à la livraison
          </span>
        </div>

        {/* Numéro de commande */}
        <div style={{
          background:"rgba(42,50,110,0.05)",
          borderRadius:12,
          padding:"10px 16px",
          margin:"0 0 28px",
          display:"inline-block"
        }}>
          <p style={{
            fontSize:12,
            color: INK60,
            fontFamily:FONT_FAMILY,
            margin:0
          }}>
            N° : <strong style={{color: INK, fontSize:13}}>{orderNum}</strong>
          </p>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display:"flex",
          gap:12,
          justifyContent:"center",
          flexWrap:"wrap"
        }}>
          <button
            onClick={()=>navigate("track")}
            style={{
              padding:"12px 24px",
              borderRadius:30,
              fontSize:13,
              fontWeight:700,
              fontFamily:FONT_FAMILY,
              cursor:"pointer",
              background:`linear-gradient(135deg, ${MGNT}, ${ROSE})`,
              color:"#fff",
              border:"none",
              boxShadow:`0 5px 18px ${MGNT}55`,
              transition:"transform 0.2s, filter 0.2s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.filter="brightness(1.05)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.filter="none";}}
          >
            Suivre ma commande
          </button>

          <button
            onClick={()=>navigate("home")}
            style={{
              padding:"12px 24px",
              borderRadius:30,
              fontSize:13,
              fontWeight:700,
              fontFamily:FONT_FAMILY,
              cursor:"pointer",
              background:"rgba(42,50,110,0.08)",
              color: INK,
              border:`1.5px solid ${INK30}`,
              transition:"all 0.2s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=`${INK}10`; e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${INK}08`; e.currentTarget.style.transform="translateY(0)";}}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );

  /* ── STEPS 1 & 2 ── */
  return (
    <div className="page-enter" style={{
      position:"relative",minHeight:"100vh",overflow:"hidden",
      marginTop:"calc(-1 * var(--header-h,72px))",
    }}>
      <Bg/>

      {/* ── En-tête ── */}
      <div style={{
        position:"relative",zIndex:2,
        paddingTop:"calc(var(--header-h,72px) + clamp(20px,2.5vw,32px))",
        paddingBottom:"clamp(14px,2vw,20px)",
        paddingLeft:20,paddingRight:20,
      }}>
        <div className="cw" style={{padding:"0 20px"}}>
          <h1 style={{
            fontFamily:FONT_FAMILY,
            fontSize:"clamp(19px,3vw,28px)",
            fontWeight:900,
            margin:"0 0 4px",
            letterSpacing:"-.02em",
            textShadow:"none",
            color: HEADER_COLOR
          }}>
            Finaliser la commande
          </h1>
          <p style={{
            fontSize:"clamp(10px,1.6vw,13px)",
            color: HEADER_COLOR,
            fontFamily:FONT_FAMILY,
            margin:"0 0 18px",
            opacity: 0.85
          }}>
            Livraison rapide · Paiement à la livraison · Retours gratuits
          </p>
          {/* Steps */}
          <div style={{display:"flex",alignItems:"center"}}>
            {[{n:1,label:"Livraison"},{n:2,label:"Confirmation"}].map(({n,label},i)=>(
              <div key={n} style={{display:"flex",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{
                    width:28,height:28,borderRadius:"50%",
                    background:step>=n?`linear-gradient(135deg,${MGNT},${ROSE})`:"rgba(255,255,255,.18)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:700,
                    color: step>=n ? "#fff" : HEADER_COLOR,
                    boxShadow:step>=n?`0 3px 12px ${MGNT}55`:"none",
                    border:step>=n?"none":"1.5px solid rgba(44,52,112,0.3)",
                    transition:"all .3s",flexShrink:0
                  }}>
                    {step>n?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>:n}
                  </div>
                  <span style={{
                    fontSize:13,fontWeight:600,
                    color: step>=n ? HEADER_COLOR : "rgba(44,52,112,0.45)",
                    fontFamily:FONT_FAMILY,
                    transition:"color .3s"
                  }}>{label}</span>
                </div>
                {i<1&&<div style={{
                  width:"clamp(20px,4vw,44px)",height:2,
                  background:step>1?`linear-gradient(90deg,${MGNT},${ROSE})`:"rgba(44,52,112,0.2)",
                  margin:"0 12px",borderRadius:2,transition:"background .4s"
                }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Accent bar + layout ── */}
      <div style={{position:"relative",zIndex:2}}>
        <div className="cw">

          <div className="co-layout">

            {/* ══ Formulaire ══ */}
            <div className="co-form-col" style={{borderRadius:"20px"}}>

              {step===1&&(
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <SecTitle>Informations de livraison</SecTitle>
                  <Fld label="Nom complet"    value={form.name}    onChange={upd("name")}    placeholder="Jean Dupont"/>
                  <Fld label="Email" type="email" value={form.email} onChange={upd("email")} placeholder="jean@email.com"/>
                  <Fld label="Téléphone" type="tel" value={form.phone} onChange={upd("phone")} placeholder="+216 XX XXX XXX"/>
                  <Fld label="Adresse"         value={form.address} onChange={upd("address")} placeholder="12 Rue de la Paix"/>
                  <div className="co-2c" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <Fld label="Ville"       value={form.city} onChange={upd("city")} placeholder="Tunis"/>
                    <Fld label="Code postal" value={form.zip}  onChange={upd("zip")}  placeholder="1001"/>
                  </div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
                    <Btn primary onClick={()=>setStep(2)}>Continuer →</Btn>
                  </div>
                </div>
              )}

              {step===2&&(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <SecTitle>Confirmation</SecTitle>

                  <div style={{
                    display:"flex",
                    alignItems:"flex-start",
                    gap:11,
                    padding:"12px 14px",
                    background:"rgba(16,185,129,.15)",
                    borderRadius:12,
                    border:"1px solid rgba(16,185,129,.30)"
                  }}>
                    <div style={{
                      width:36,height:36,borderRadius:9,
                      background:"rgba(16,185,129,.22)",
                      flexShrink:0,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center"
                    }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2" strokeLinecap="round">
                        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{
                        fontSize:13,
                        fontWeight:700,
                        color: INK,
                        fontFamily:FONT_FAMILY,
                        margin:"0 0 3px"
                      }}>
                        Paiement à la livraison
                      </p>
                      <p style={{
                        fontSize:11,
                        color: INK,
                        fontFamily:FONT_FAMILY,
                        margin:0,
                        lineHeight:1.5,
                        opacity:0.7
                      }}>
                        Règlement en espèces au livreur. Aucune info bancaire.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    padding:"12px 14px",
                    background:"rgba(255,255,255,.10)",
                    borderRadius:12,
                    border:"1px solid rgba(255,255,255,.22)"
                  }}>
                    <p style={{
                      fontSize:9,
                      fontWeight:700,
                      color: INK,
                      letterSpacing:".08em",
                      textTransform:"uppercase",
                      fontFamily:FONT_FAMILY,
                      margin:"0 0 6px",
                      opacity:0.6
                    }}>
                      Adresse de livraison
                    </p>
                    <p style={{
                      fontSize:13,
                      fontWeight:700,
                      color: INK,
                      fontFamily:FONT_FAMILY,
                      margin:"0 0 2px"
                    }}>
                      {form.name||"—"}
                    </p>
                    <p style={{
                      fontSize:11,
                      color: INK,
                      fontFamily:FONT_FAMILY,
                      margin:0,
                      lineHeight:1.6,
                      opacity:0.7
                    }}>
                      {form.address||"—"}<br/>{form.zip} {form.city}<br/>{form.phone}
                    </p>
                  </div>

                  <div style={{
                    display:"flex",
                    alignItems:"center",
                    gap:8,
                    padding:"9px 13px",
                    background:"rgba(231,57,139,.12)",
                    borderRadius:10,
                    border:"1px solid rgba(231,57,139,.24)"
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{
                      fontSize:11,
                      color: INK,
                      fontFamily:FONT_FAMILY,
                      fontWeight:500
                    }}>
                      Livraison estimée sous 24–48h
                    </span>
                  </div>

                  <div className="co-brow" style={{display:"flex",gap:10,marginTop:2}}>
                    <Btn ghost onClick={()=>setStep(1)}>← Retour</Btn>
                    <Btn primary onClick={confirmOrder} style={{flex:1}}>Confirmer →</Btn>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ Micro-composants ══ */

const SecTitle = ({children}) => (
  <h2 style={{
    fontFamily:FONT_FAMILY,
    fontSize:"clamp(15px,2.5vw,18px)",
    fontWeight:900,
    color: "#E7398B",
    margin:0,
    letterSpacing:"-.02em"
  }}>
    {children}
  </h2>
);

const Fld = ({label,type="text",value,onChange,placeholder}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{
      fontSize:12,
      fontWeight:700,
      color: "#E7398B",
      letterSpacing:".06em",
      textTransform:"uppercase",
      fontFamily: "Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      textShadow:"0 1px 6px rgba(231,57,139,0.2)"
    }}>
      {label}
    </label>
    <input
      className="ci"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        fontFamily: "Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      }}
    />
  </div>
);

const Btn = ({children,onClick,primary,ghost,style:xs={}}) => (
  <button onClick={onClick} style={{
    padding:"11px 20px",borderRadius:11,fontSize:13,fontWeight:700,
    fontFamily:FONT_FAMILY,cursor:"pointer",
    border:ghost?"1.5px solid rgba(255,255,255,0.30)":"none",
    background:primary?`linear-gradient(135deg,${MGNT},${ROSE})`:"rgba(255,255,255,0.14)",
    backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
    color:"#fff",
    boxShadow:primary?`0 5px 18px rgba(231,57,139,.38)`:"none",
    display:"flex",alignItems:"center",justifyContent:"center",gap:5,
    transition:"filter .2s",whiteSpace:"nowrap",...xs,
  }}
  onMouseEnter={e=>{e.currentTarget.style.filter="brightness(1.10)";}}
  onMouseLeave={e=>{e.currentTarget.style.filter="none";}}
  >{children}</button>
);