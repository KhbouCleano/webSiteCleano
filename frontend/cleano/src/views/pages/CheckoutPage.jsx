// ============================================================
// src/views/pages/CheckoutPage.jsx
// ============================================================
import { useState, useEffect } from "react";
import { useCartController } from "../../controllers/useCartController";
import useAppStore from "../../store/useAppStore";

const FONT_FAMILY = "Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const INK   = "#2a326e";
const INK60 = "rgba(42,50,110,0.60)";
const MGNT  = "#E7398B";
const ROSE  = "#F472B6";
const OK    = "#10B981";
const FIXED_PRICE_TND = 13.5;
const HEADER_COLOR = "#2a326e";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000");

// ⚠️ Doit correspondre EXACTEMENT au mapping VILLES du backend (backend/routes/adex.js)
const VILLES = {
  "1":"Ariana","2":"Beja","3":"Ben Arous","4":"Bizerte",
  "5":"Gabes","6":"Gafsa","7":"Jendouba","8":"Kairouan",
  "9":"Kasserine","10":"Kebili","11":"Le Kef","12":"Mahdia",
  "13":"Mannouba","14":"Medenine","15":"Monastir","16":"Nabeul",
  "17":"Sfax","18":"Sidi Bouzid","19":"Siliana","20":"Sousse",
  "21":"Tataouine","22":"Tozeur","23":"Tunis","24":"Zaghouan",
};

// ── Même table de styles que ProductsPage / DetailPage ──────
// On la garde ici aussi pour recalculer la couleur/badge à partir
// du NOM du produit, plutôt que de faire confiance à ce qui a été
// stocké dans le panier (qui peut être obsolète/persisté).
const PRODUCT_STYLE_MAP = {
  "anti-calcaire":             { color:"#1a1a1a", badge:"Noir"  },
  "nettoyant vitres":          { color:"#4fc3f7", badge:"Bleu"  },
  "super dégraissant":         { color:"#f9a825", badge:"Jaune" },
  "super dégraissant cuisine": { color:"#f9a825", badge:"Jaune" },
  "spécial tissu":             { color:"#bdbdbd", badge:"Blanc" },
  "special tissu":             { color:"#bdbdbd", badge:"Blanc" },
  "multi-usage sanitaire":     { color:"#8bc34a", badge:"Vert"  },
  "super anti-tache":          { color:"#E7398B", badge:"Rose"  },
  "nettoyant concentré tous sols fruité": { color:"#F97316", badge:"Orange" },
  "nettoyant concentre tous sols fruite": { color:"#F97316", badge:"Orange" },
};

const resolveStyle = (name, fallbackColor, fallbackBadge) => {
  const key = name?.toLowerCase().trim() ?? "";
  if (PRODUCT_STYLE_MAP[key]) return PRODUCT_STYLE_MAP[key];
  for (const [k, v] of Object.entries(PRODUCT_STYLE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  // Pas de correspondance : on garde ce qui était déjà sur l'objet
  // (ajouté au panier) plutôt que de deviner une couleur au hasard.
  return { color: fallbackColor || MGNT, badge: fallbackBadge || "" };
};

// Extrait la partie arabe courte de la description brute de la DB
const extractArabic = (text) => {
  if (!text) return "";
  const match = text.match(/[\u0600-\u06FF][^.،\n]*/);
  return match ? match[0].trim().replace(/[.،\s]+$/, "") : "";
};

// Extrait la description FR complète (retire la partie arabe)
const extractFrenchDescription = (text) => {
  if (!text) return "";
  return text.replace(/[\u0600-\u06FF][^.]*\./g, "").trim();
};

const CSS = `
  .cw { max-width:1100px; margin:0 auto; padding:0 20px 56px; }
  @keyframes pulseRing {
    0%   { transform:translateY(-50%) scale(0.8); opacity:0.8; }
    100% { transform:translateY(-50%) scale(1.8); opacity:0; }
  }
  @keyframes bounceArrow {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(5px); }
  }
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
    .co-layout { max-width: 100% !important; }
    .co-grid { grid-template-columns: 1fr !important; }
    /* Sur mobile, le produit s'affiche AVANT le formulaire */
    .co-preview-col { order: 1 !important; }
    .co-form-col    { order: 2 !important; }
  }
  .co-layout { display: block; max-width: 940px; }
  .co-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  .co-form-col {
    border: 2px solid #f9b5d7; border-radius: 20px;
    padding: clamp(28px,3.5vw,44px);
    padding-top: calc(clamp(28px,3.5vw,44px) + 4px);
    display: flex; flex-direction: column; gap: 20px;
    position: relative; z-index: 1;
  }
  .co-preview-col {
    border: 2px solid #f9b5d7; border-radius: 20px;
    padding: clamp(24px,3vw,36px);
    display: flex; flex-direction: column; gap: 16px;
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  }
  @media(max-width:560px){ .co-layout { max-width: 100%; } }
  @media(max-width:480px){
    .co-2c { grid-template-columns:1fr !important; }
    .co-brow { flex-direction:column !important; }
    .co-brow button { width:100% !important; flex:unset !important; }
  }
  .ci {
    width:100%; box-sizing:border-box;
    padding:11px 14px;
    border: 1.5px solid rgba(255,255,255,0.50);
    border-radius: 12px;
    font-family: ${FONT_FAMILY};
    font-size:13px; font-weight:500;
    outline:none; color: #2a326e;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    transition: border-color .2s, background .2s, box-shadow .2s;
    box-shadow: 0 1px 4px rgba(42,50,110,0.08);
  }
  .ci::placeholder { color: rgba(42,50,110,0.45); font-weight: 400; }
  .ci:focus {
    border-color: #E7398B; background: rgba(255,255,255,0.97);
    box-shadow: 0 0 0 3px rgba(231,57,139,0.18), 0 1px 4px rgba(42,50,110,0.08);
  }
`;

// ⚠️ Remplacer par votre véritable ID de Pixel Meta (Events Manager > Paramètres)
const META_PIXEL_ID = "VOTRE_PIXEL_ID";

let _pixelInjected = false;
const loadMetaPixel = () => {
  if (_pixelInjected || typeof window === "undefined") return;
  if (window.fbq) { _pixelInjected = true; return; }

  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0";
    n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
  _pixelInjected = true;
};

// Normalise le téléphone (chiffres uniquement) pour l'Advanced Matching
const normalizePhone = (phone) => (phone || "").replace(/\D/g, "");

let _inj = false;
const injectCSS = () => {
  if (_inj || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = CSS;
  document.head.appendChild(s);
  _inj = true;
};

// ── Aperçu produit complet : image + description, même style que le formulaire ──
const ProductPreview = ({ item, onIncrease, onDecrease }) => {
  const { product, qty } = item;
  const [fullDescription, setFullDescription] = useState(product.description || "");
  const [arabicDesc, setArabicDesc] = useState(product.desc || "");
  const [loadingDesc, setLoadingDesc] = useState(!product.description);

  // Si la description complète n'est pas déjà présente sur l'objet produit
  // (selon la page d'origine — ProductsPage n'a que le résumé), on va la chercher.
  useEffect(() => {
    if (product.description || !product.id) { setLoadingDesc(false); return; }
    fetch(`${API_URL}/api/products/${product.id}`)
      .then(r => r.json())
      .then(data => {
        const p = data.product ?? data;
        if (p?.description) {
          setFullDescription(extractFrenchDescription(p.description) || p.description);
          setArabicDesc(prev => prev || extractArabic(p.description));
        }
        setLoadingDesc(false);
      })
      .catch(() => setLoadingDesc(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Recalcule la couleur/badge à partir du NOM plutôt que de faire
  // confiance à product.color/product.badge (qui peuvent être obsolètes
  // si l'article a été ajouté au panier avant une mise à jour du mapping,
  // ou si le panier est persisté en localStorage).
  const { color: accent, badge } = resolveStyle(product.name, product.color, product.badge);

  return (
    <div className="co-preview-col">
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>

        <h2 style={{
          fontFamily:FONT_FAMILY, fontSize:"clamp(15px,2.5vw,18px)", fontWeight:900,
          color:MGNT, margin:0, letterSpacing:"-.02em",
        }}>
          Votre produit
        </h2>
      </div>

      {/* Image en grand, style identique à DetailPage : halo coloré derrière l'image */}
      <div style={{
        position:"relative", borderRadius:20, overflow:"hidden",
        aspectRatio:"1", maxWidth:230, width:"100%", margin:"0 auto",
        background:`
          radial-gradient(ellipse 80% 70% at 50% 38%, ${accent}30 0%, ${accent}10 45%, transparent 75%)
        `,
        border:"1.5px solid rgba(255,255,255,0.7)",
        boxShadow:`0 10px 30px ${accent}28`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        {badge && (
          <div style={{
            position:"absolute", top:12, right:12, zIndex:2,
            background:accent, color:"#fff", fontSize:11, fontWeight:700,
            padding:"4px 12px", borderRadius:20, fontFamily:FONT_FAMILY,
            boxShadow:`0 2px 8px ${accent}55`, letterSpacing:".04em",
          }}>
            {badge}
          </div>
        )}
        <img
          src={product.img}
          alt={product.name}
          style={{ width:"84%", height:"84%", objectFit:"contain", filter:"drop-shadow(0 12px 28px rgba(0,0,0,0.20))" }}
          onError={e => { e.target.src = "/product-vitres.png"; }}
        />
      </div>

      {/* Flèche animée — indique qu'on peut continuer vers le formulaire */}
      <div style={{ display:"flex", justifyContent:"center", marginTop:-4 }}>
        <div
          style={{
            width:34, height:34, borderRadius:"50%",
            background:`${accent}15`, border:`1.5px solid ${accent}44`,
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"bounceArrow 1.6s ease-in-out infinite",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>

      {/* Nom + sous-titre + description, même palette de couleurs que le formulaire */}
      <div>
        {product.subtitle && (
          <p style={{
            fontSize:11, fontWeight:700, color:accent, fontFamily:FONT_FAMILY,
            textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 4px",
          }}>
            {product.subtitle}
          </p>
        )}
        <h3 style={{
          fontSize:"clamp(17px,2.5vw,20px)", fontWeight:900, color:INK,
          fontFamily:FONT_FAMILY, margin:"0 0 6px", letterSpacing:"-.02em",
        }}>
          {product.name}
        </h3>
        {arabicDesc && (
          <p style={{ fontSize:13, color:INK60, fontFamily:FONT_FAMILY, margin:"0 0 8px", direction:"rtl" }}>
            {arabicDesc}
          </p>
        )}
        {loadingDesc ? (
          <p style={{ fontSize:13, color:INK60, fontFamily:FONT_FAMILY, margin:0, fontStyle:"italic" }}>
            Chargement de la description…
          </p>
        ) : fullDescription && (
          <p style={{ fontSize:13, color:INK60, fontFamily:FONT_FAMILY, margin:0, lineHeight:1.6 }}>
            {fullDescription}
          </p>
        )}
      </div>

      {/* Prix + quantité, mêmes styles que le reste du formulaire */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:12, paddingTop:14, borderTop:"1px solid rgba(42,50,110,0.12)",
      }}>
        <span style={{ fontSize:"clamp(18px,3vw,22px)", fontWeight:900, color:INK, fontFamily:FONT_FAMILY }}>
          {(product.price * qty).toFixed(2)} TND
        </span>

        <div style={{
          display:"inline-flex", alignItems:"center",
          border:"1.5px solid rgba(42,50,110,0.18)",
          borderRadius:10, overflow:"hidden",
          background:"rgba(255,255,255,0.9)",
        }}>
          <button
            type="button"
            onClick={onDecrease}
            style={{ width:32, height:32, background:"transparent", border:"none", cursor:"pointer", fontSize:17, fontWeight:700, color:INK, fontFamily:FONT_FAMILY, display:"flex", alignItems:"center", justifyContent:"center" }}
          >−</button>
          <span style={{ width:32, textAlign:"center", fontSize:14, fontWeight:700, color:INK, fontFamily:FONT_FAMILY }}>
            {qty}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            style={{ width:32, height:32, background:"transparent", border:"none", cursor:"pointer", fontSize:17, fontWeight:700, color:INK, fontFamily:FONT_FAMILY, display:"flex", alignItems:"center", justifyContent:"center" }}
          >+</button>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  injectCSS();
  const { cartItems, clearCart } = useCartController();
  const navigate            = useAppStore(s => s.navigate);
  const addToast            = useAppStore(s => s.addToast);
  const addNotification     = useAppStore(s => s.addNotification);
  const setTrackingNumber   = useAppStore(s => s.setTrackingNumber);
  const selectedProductId   = useAppStore(s => s.selectedProductId);
  const updateQty           = useAppStore(s => s.updateQty);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", ville_id:"23", zip:"" });

  // ── États pour l'appel ADEX ─────────────────────────────
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [trackingNum, setTrackingNum] = useState(null); // le VRAI numéro ADEX (num_suivi_cmd)
  const [urlBl, setUrlBl]       = useState(null);
  const [copied, setCopied]     = useState(false);

  // ── Copie automatique du code colis dans le presse-papier ──────
  const copyTrackingCode = async (e) => {
    e.stopPropagation();
    if (!trackingNum) return;
    try {
      await navigator.clipboard.writeText(trackingNum);
      setCopied(true);
      addToast?.("Code colis copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast?.("Impossible de copier le code.");
    }
  };

  const subtotal = cartItems.reduce((s,{product,qty}) => s + (Number(product.price) || FIXED_PRICE_TND) * qty, 0);
  const upd = k => e => setForm(f => ({...f,[k]:e.target.value}));

  // ── Produit sélectionné à afficher dans le formulaire ───
  // On cherche l'article du panier correspondant au produit sélectionné
  // (venant du bouton "Acheter maintenant"), sinon on affiche le 1er article du panier.
  const selectedItem =
    cartItems.find(({ product }) => product?.id === selectedProductId) || cartItems[0] || null;

  // ── Meta Pixel : chargement + InitiateCheckout au montage ──────
  useEffect(() => {
    loadMetaPixel();
    if (!window.fbq || cartItems.length === 0) return;
    window.fbq("track", "InitiateCheckout", {
      value: subtotal,
      currency: "TND",
      num_items: cartItems.reduce((s, { qty }) => s + qty, 0),
      content_ids: cartItems.map(({ product }) => product.id),
      contents: cartItems.map(({ product, qty }) => ({ id: product.id, quantity: qty })),
      content_name: selectedItem?.product?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Met à jour l'Advanced Matching dès que le client remplit ses infos ──
  useEffect(() => {
    if (!window.fbq || (!form.email && !form.phone && !form.name)) return;
    const [fn, ...rest] = (form.name || "").trim().split(" ");
    window.fbq("init", META_PIXEL_ID, {
      em: form.email || undefined,
      ph: normalizePhone(form.phone) || undefined,
      fn: fn || undefined,
      ln: rest.join(" ") || undefined,
      ct: VILLES[form.ville_id] || undefined,
      country: "tn",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.email, form.phone, form.ville_id]);

  // ── Création du colis chez ADEX ─────────────────────────
  const confirmOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      setError("Merci de renseigner le nom, le téléphone et l'adresse.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const totalQty = cartItems.reduce((s,{qty}) => s + qty, 0) || 1;

      const payload = {
        // code_barres_ext : référence interne, laissée vide → le backend en génère une (CMD-<timestamp>)
        nom_cli:        form.name,
        adr_cli:        form.address,
        ville_cli:      form.ville_id,        // ID de ville (1-24), voir mapping VILLES
        nbr_colis:      totalQty,
        type_colis_tab: "0",                  // taille de colis par défaut
        ttc_cmd:        subtotal.toFixed(3),
        tel_cli:        form.phone,
        tel_cli2:       "",
        tel_cli3:       "",                   // requis par l'API ADEX
        ContenuColis:   cartItems.map(({ product, qty }) => `${product.name} x${qty}`).join(", "),
        commentaire_cmd: form.zip ? `Code postal: ${form.zip}` : "",
        fragile:        0,
        echange_cmd:    0,
        ancienne_commande_echange: "",        // requis (vide si commande normale, non échange)
        produit_arecevoir: "",                // requis (vide si pas d'échange)
        // 🔗 Produits réellement commandés (id + quantité + prix) : c'est CE tableau
        // qui permet au backend de décrémenter le stock et d'afficher les noms de
        // produits dans "Gestion des Commandes" — le texte ContenuColis seul ne suffit pas.
        produits: cartItems.map(({ product, qty }) => ({
          id:    product.id,
          name:  product.name,
          qty,
          price: product.price,
        })),
      };

      const res = await fetch("/api/adex/add_colis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du colis.");
      }

      // ✅ data.num_suivi_cmd est le VRAI numéro de suivi ADEX

      // 📊 Meta Pixel : événement Purchase
      if (window.fbq) {
        window.fbq("track", "Purchase", {
          value: subtotal,
          currency: "TND",
          content_ids: cartItems.map(({ product }) => product.id),
          contents: cartItems.map(({ product, qty }) => ({ id: product.id, quantity: qty })),
          num_items: totalQty,
          order_id: data.num_suivi_cmd,
        });
      }

      clearCart();
      setTrackingNum(data.num_suivi_cmd);
      setUrlBl(data.url_bl);
      setTrackingNumber?.(data.num_suivi_cmd); // stocké dans le store pour la page Track
      setStep(3);
      addToast?.(`Commande confirmée ! Code colis : ${data.num_suivi_cmd}`);

      // 🔔 Notification : visible dans le panneau de notifications (icône cloche)
      addNotification?.({
        type: "order",
        title: "Nouvelle commande",
        message: `${form.name} — ${totalQty} article${totalQty > 1 ? "s" : ""} — ${subtotal.toFixed(3)} TND`,
        trackingNumber: data.num_suivi_cmd,
      });
    } catch (err) {
      setError(err.message);
      addToast?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation vers Track avec le VRAI numéro ADEX ──────
  const goToTrack = () => {
    if (!trackingNum) return;
    setTrackingNumber?.(trackingNum);
    navigate("track");
  };

  const Bg = () => <>
    <div style={{
      position:"absolute",inset:0,
      background: "linear-gradient(135deg, rgba(42,50,110,0.54) 0%, rgba(255,255,255,0.80) 20%, rgba(42,58,143,0) 5%, rgba(255,255,255,0.80) 0%, rgba(231,57,139,0.40) 100%)",
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

  // ── STEP 3 : confirmation ──
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

        <h1 style={{
          fontFamily:FONT_FAMILY, fontSize:"clamp(24px,6vw,32px)", fontWeight:900,
          color: INK, margin:"0 0 12px", letterSpacing:"-.02em"
        }}>
          Commande confirmée !
        </h1>

        <p style={{ fontSize:15, color: INK60, fontFamily:FONT_FAMILY, margin:"0 0 20px", lineHeight:1.5 }}>
          Merci ! Vous serez contacté pour confirmer la livraison.
        </p>

        <div style={{
          display:"inline-flex",alignItems:"center",gap:8,
          padding:"8px 18px", background:"rgba(16,185,129,0.12)",
          borderRadius:30, border:"1px solid rgba(16,185,129,0.3)", margin:"0 0 16px"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2" strokeLinecap="round">
            <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/>
          </svg>
          <span style={{fontSize:12,color:"#065f46",fontFamily:FONT_FAMILY,fontWeight:600}}>
            Paiement à la livraison
          </span>
        </div>

        {trackingNum ? (
          <div style={{position:"relative",display:"inline-block",margin:"0 auto"}}>
            <div style={{
              position:"absolute", left:20,top:"50%",transform:"translateY(-50%)",
              width:36,height:36,borderRadius:"50%",
              background:"rgba(231,57,139,0.3)",
              animation:"pulseRing 1.8s ease-out infinite",
              pointerEvents:"none",
            }}/>
            <button
              onClick={goToTrack}
              style={{
                display:"inline-flex",flexDirection:"column",
                alignItems:"center",gap:6,
                padding:"18px 48px 18px 64px",
                borderRadius:50,border:"none",cursor:"pointer",
                background:"linear-gradient(135deg, #E7398B 0%, #F472B6 100%)",
                color:"#fff",fontFamily:FONT_FAMILY,
                boxShadow:"0 8px 28px rgba(231,57,139,0.45), 0 2px 8px rgba(231,57,139,0.2)",
                transition:"transform 0.22s cubic-bezier(.22,.61,.36,1), box-shadow 0.22s",
                position:"relative",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.03)";e.currentTarget.style.boxShadow="0 14px 36px rgba(231,57,139,0.55)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 28px rgba(231,57,139,0.45)";}}
              onMouseDown={e=>{e.currentTarget.style.transform="scale(0.97)";}}
              onMouseUp={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.03)";}}
            >
              <div style={{
                position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",
                width:36,height:36,borderRadius:"50%",
                background:"rgba(255,255,255,0.22)",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <span style={{fontSize:16,fontWeight:800,letterSpacing:"-.01em",lineHeight:1}}>
                Suivre ma commande
              </span>
              <span
                onClick={copyTrackingCode}
                title="Copier le code colis"
                style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  fontSize:12,fontWeight:600,opacity:0.9,
                  background:"rgba(255,255,255,0.18)",
                  borderRadius:20,padding:"3px 12px",
                  letterSpacing:".03em", cursor:"pointer",
                }}
              >
                N° {trackingNum}
                {copied ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </span>
            </button>
          </div>
        ) : (
          <p style={{fontSize:13,color:INK60,fontFamily:FONT_FAMILY}}>
            Numéro de suivi indisponible pour le moment.
          </p>
        )}

        {urlBl && (
          <p style={{marginTop:16}}>
            <a href={urlBl} target="_blank" rel="noreferrer" style={{fontSize:13,color:MGNT,fontFamily:FONT_FAMILY,fontWeight:600}}>
              Télécharger le bon de livraison (BL)
            </a>
          </p>
        )}
      </div>
    </div>
  );

  // ── STEPS 1 & 2 ──
  return (
    <div className="page-enter" style={{
      position:"relative",minHeight:"100vh",overflow:"hidden",
      marginTop:"calc(-1 * var(--header-h,72px))",
    }}>
      <Bg/>
      <div style={{
        position:"relative",zIndex:2,
        paddingTop:"calc(var(--header-h,72px) + clamp(20px,2.5vw,32px))",
        paddingBottom:"clamp(14px,2vw,20px)",
        paddingLeft:20,paddingRight:20,
      }}>
        <div className="cw" style={{padding:"0 20px"}}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
            <button
              type="button"
              onClick={() => step === 2 ? setStep(1) : window.history.back()}
              title={step === 2 ? "Retour au formulaire" : "Retour"}
              style={{
                width:36, height:36, borderRadius:"50%", flexShrink:0,
                background:"rgba(255,255,255,0.55)", backdropFilter:"blur(8px)",
                border:`1.5px solid ${HEADER_COLOR}33`, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"transform .2s, background .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.85)";e.currentTarget.style.transform="translateX(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.55)";e.currentTarget.style.transform="none";}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HEADER_COLOR} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 style={{
              fontFamily:FONT_FAMILY, fontSize:"clamp(19px,3vw,28px)", fontWeight:900,
              margin:0, letterSpacing:"-.02em", color:HEADER_COLOR
            }}>
              Finaliser la commande
            </h1>
          </div>
          <p style={{
            fontSize:"clamp(10px,1.6vw,13px)", color:HEADER_COLOR, fontFamily:FONT_FAMILY,
            margin:"0 0 18px", opacity:0.85
          }}>
            Livraison rapide · Paiement à la livraison · Retours gratuits
          </p>
          <div style={{display:"flex",alignItems:"center"}}>
            {[{n:1,label:"Livraison"},{n:2,label:"Confirmation"}].map(({n,label},i)=>(
              <div key={n} style={{display:"flex",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{
                    width:28,height:28,borderRadius:"50%",
                    background:step>=n?`linear-gradient(135deg,${MGNT},${ROSE})`:"rgba(255,255,255,.18)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:700,
                    color:step>=n?"#fff":HEADER_COLOR,
                    boxShadow:step>=n?`0 3px 12px ${MGNT}55`:"none",
                    border:step>=n?"none":"1.5px solid rgba(44,52,112,0.3)",
                    transition:"all .3s",flexShrink:0
                  }}>
                    {step>n?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>:n}
                  </div>
                  <span style={{
                    fontSize:13,fontWeight:600,
                    color:step>=n?HEADER_COLOR:"rgba(44,52,112,0.45)",
                    fontFamily:FONT_FAMILY, transition:"color .3s"
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

      <div style={{position:"relative",zIndex:2}}>
        <div className="cw">
          <div className="co-layout">
            <div className="co-grid">

              {/* ── Colonne gauche : formulaire (même classe/design qu'avant) ── */}
              <div className="co-form-col" style={{borderRadius:"20px"}}>
                {step===1&&(
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    <SecTitle>Informations de livraison</SecTitle>

                    <Fld label="Nom complet"    value={form.name}    onChange={upd("name")}    placeholder="Jean Dupont"/>
                    <Fld label="Email" type="email" value={form.email} onChange={upd("email")} placeholder="jean@email.com"/>
                    <Fld label="Téléphone" type="tel" value={form.phone} onChange={upd("phone")} placeholder="+216 XX XXX XXX"/>
                    <Fld label="Adresse"         value={form.address} onChange={upd("address")} placeholder="12 Rue de la Paix"/>
                    <div className="co-2c" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <VilleSelect value={form.ville_id} onChange={upd("ville_id")} />
                      <Fld label="Code postal" value={form.zip}  onChange={upd("zip")}  placeholder="1001"/>
                    </div>
                    {error && <p style={{color:"#dc2626",fontSize:12,fontFamily:FONT_FAMILY,margin:0}}>{error}</p>}
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
                      <Btn primary onClick={()=>{
                        if (!form.name || !form.phone || !form.address) {
                          setError("Merci de renseigner le nom, le téléphone et l'adresse.");
                          return;
                        }
                        setError(null);
                        if (window.fbq) {
                          window.fbq("track", "AddPaymentInfo", {
                            value: subtotal,
                            currency: "TND",
                            content_ids: cartItems.map(({ product }) => product.id),
                          });
                        }
                        setStep(2);
                      }}>Continuer →</Btn>
                    </div>
                  </div>
                )}

                {step===2&&(
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    <SecTitle>Confirmation</SecTitle>
                    <div style={{
                      display:"flex",alignItems:"flex-start",gap:11,
                      padding:"12px 14px",
                      background:"rgba(16,185,129,.15)",
                      borderRadius:12,border:"1px solid rgba(16,185,129,.30)"
                    }}>
                      <div style={{
                        width:36,height:36,borderRadius:9,
                        background:"rgba(16,185,129,.22)",
                        flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"
                      }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={OK} strokeWidth="2" strokeLinecap="round">
                          <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{fontSize:13,fontWeight:700,color:INK,fontFamily:FONT_FAMILY,margin:"0 0 3px"}}>
                          Paiement à la livraison
                        </p>
                        <p style={{fontSize:11,color:INK,fontFamily:FONT_FAMILY,margin:0,lineHeight:1.5,opacity:0.7}}>
                          Règlement en espèces au livreur. Aucune info bancaire.
                        </p>
                      </div>
                    </div>

                    <div style={{
                      padding:"12px 14px",
                      background:"rgba(255,255,255,.10)",
                      borderRadius:12,border:"1px solid rgba(255,255,255,.22)"
                    }}>
                      <p style={{fontSize:9,fontWeight:700,color:INK,letterSpacing:".08em",textTransform:"uppercase",fontFamily:FONT_FAMILY,margin:"0 0 6px",opacity:0.6}}>
                        Adresse de livraison
                      </p>
                      <p style={{fontSize:13,fontWeight:700,color:INK,fontFamily:FONT_FAMILY,margin:"0 0 2px"}}>{form.name||"—"}</p>
                      <p style={{fontSize:11,color:INK,fontFamily:FONT_FAMILY,margin:0,lineHeight:1.6,opacity:0.7}}>
                        {form.address||"—"}<br/>{form.zip} {VILLES[form.ville_id]}<br/>{form.phone}
                      </p>
                    </div>

                    <div style={{
                      display:"flex",alignItems:"center",gap:8,
                      padding:"9px 13px",
                      background:"rgba(231,57,139,.12)",
                      borderRadius:10,border:"1px solid rgba(231,57,139,.24)"
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{fontSize:11,color:INK,fontFamily:FONT_FAMILY,fontWeight:500}}>
                        Livraison estimée sous 24–48h
                      </span>
                    </div>

                    {error && <p style={{color:"#dc2626",fontSize:12,fontFamily:FONT_FAMILY,margin:0}}>{error}</p>}

                    <div className="co-brow" style={{display:"flex",gap:10,marginTop:2}}>
                      <Btn ghost onClick={()=>setStep(1)} disabled={loading}>← Retour</Btn>
                      <Btn primary onClick={confirmOrder} style={{flex:1}} disabled={loading}>
                        {loading ? "Création du colis..." : "Confirmer →"}
                      </Btn>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Colonne droite : image + description du produit, même style/classe ── */}
              {selectedItem && (
                <ProductPreview
                  item={selectedItem}
                  onIncrease={() => updateQty?.(selectedItem.product.id, selectedItem.qty + 1)}
                  onDecrease={() => updateQty?.(selectedItem.product.id, Math.max(1, selectedItem.qty - 1))}
                />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SecTitle = ({children}) => (
  <h2 style={{fontFamily:FONT_FAMILY,fontSize:"clamp(15px,2.5vw,18px)",fontWeight:900,color:"#E7398B",margin:0,letterSpacing:"-.02em"}}>
    {children}
  </h2>
);

const Fld = ({label,type="text",value,onChange,placeholder}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontSize:12,fontWeight:700,color:"#E7398B",letterSpacing:".06em",textTransform:"uppercase",fontFamily:FONT_FAMILY,textShadow:"0 1px 6px rgba(231,57,139,0.2)"}}>
      {label}
    </label>
    <input className="ci" type={type} value={value} onChange={onChange} placeholder={placeholder} style={{fontFamily:FONT_FAMILY}}/>
  </div>
);

// ── Sélecteur de ville (obligatoire pour ADEX, remplace le champ texte libre) ──
const VilleSelect = ({value,onChange}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <label style={{fontSize:12,fontWeight:700,color:"#E7398B",letterSpacing:".06em",textTransform:"uppercase",fontFamily:FONT_FAMILY,textShadow:"0 1px 6px rgba(231,57,139,0.2)"}}>
      Ville
    </label>
    <select className="ci" value={value} onChange={onChange} style={{fontFamily:FONT_FAMILY}}>
      {Object.entries(VILLES).map(([id,name]) => (
        <option key={id} value={id}>{name}</option>
      ))}
    </select>
  </div>
);

const Btn = ({children,onClick,primary,ghost,disabled,style:xs={}}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding:"11px 20px",borderRadius:11,fontSize:13,fontWeight:700,
    fontFamily:FONT_FAMILY,cursor:disabled?"not-allowed":"pointer",
    opacity:disabled?0.65:1,
    border:ghost?"1.5px solid #202a66":"none",
    background:primary?`linear-gradient(135deg,${MGNT},${ROSE})`:"#202a66",
    backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
    color:"#fff",
    boxShadow:primary?`0 5px 18px rgba(231,57,139,.38)`:"none",
    display:"flex",alignItems:"center",justifyContent:"center",gap:5,
    transition:"filter .2s",whiteSpace:"nowrap",...xs,
  }}
  onMouseEnter={e=>{if(!disabled)e.currentTarget.style.filter="brightness(1.10)";}}
  onMouseLeave={e=>{e.currentTarget.style.filter="none";}}
  >{children}</button>
);