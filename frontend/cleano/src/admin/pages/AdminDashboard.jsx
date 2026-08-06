// src/admin/pages/AdminDashboard.jsx
import { useEffect, useState, useRef } from "react";
import useAppStore from "../../store/useAppStore";

const FONT = "inherit"; // hérite de la font globale
const C = {
  navy: "#1B2559", magenta: "#E7398B", rose: "#F472B6",
  lavender: "#E8EAF6", muted: "#8892B0", white: "#FFFFFF", offwhite: "#F8F9FF",
};

// ✅ Référence stable — évite de recréer un nouveau tableau à chaque rendu
// (sinon le sélecteur Zustand `s.notifications || []` renvoie une nouvelle
// référence à chaque appel et provoque une boucle infinie de re-render)
const EMPTY_ARR = [];

// ── SVG Icons ─────────────────────────────────────────────────
const Icon = ({ children, size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Icons = {
  produits: (color, size) => (
    <Icon size={size} color={color}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </Icon>
  ),
  stock: (color, size) => (
    <Icon size={size} color={color}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </Icon>
  ),
  clients: (color, size) => (
    <Icon size={size} color={color}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </Icon>
  ),
  commandes: (color, size) => (
    <Icon size={size} color={color}>
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </Icon>
  ),
  colis: (color, size) => (
    <Icon size={size} color={color}>
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </Icon>
  ),
  historique: (color, size) => (
    <Icon size={size} color={color}>
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"/>
      <polyline points="12 6 12 12 16 14"/>
      <polyline points="22 12 19 15 16 12"/>
    </Icon>
  ),
};

// ── Icône Cloche (notifications) ────────────────────────────────
const BellIcon = (color = C.navy, size = 18) => (
  <Icon size={size} color={color}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </Icon>
);

// NB : "page" est la clé du routeur maison (useAppStore.navigate), PAS un
// chemin react-router — adminRoutes.jsx n'est pas monté dans l'app actuellement.
// "statKey" est une clé de fetch indépendante pour les stats.
const STATS = [
  { label: "Produits",  value: "0", iconKey: "produits",   color: "#6366F1", page: "admin-produits",  statKey: "produits"  },
  { label: "Clients",   value: "0", iconKey: "clients",    color: "#E7398B", page: "admin-clients",   statKey: "clients"   },
  { label: "Commandes", value: "0", iconKey: "commandes",  color: "#F59E0B", page: "admin-commandes", statKey: "commandes" },
  { label: "Colis",     value: "0", iconKey: "colis",      color: "#10B981", page: "admin-colis",     statKey: "colis"     },
];

const MODULES = [
  { iconKey: "produits",   label: "Produits",   desc: "Ajouter, modifier, supprimer vos produits", page: "admin-produits",   color: "#6366F1" },
  { iconKey: "stock",      label: "Stock",      desc: "Gérer les niveaux de stock par produit",     page: "admin-stock",      color: "#8B5CF6" },
  { iconKey: "clients",    label: "Clients",    desc: "Liste et gestion de tous les clients",       page: "admin-clients",    color: "#E7398B" },
  { iconKey: "commandes",  label: "Commandes",  desc: "Suivre et traiter les commandes",            page: "admin-commandes",  color: "#F59E0B" },
  { iconKey: "colis",      label: "Colis",      desc: "Gestion de livraison et suivi colis",        page: "admin-colis",      color: "#10B981" },
  { iconKey: "historique", label: "Historique", desc: "Historique des interactions client-colis",   page: "admin-historique", color: "#3B82F6" },
];

// ── Fetchers par clé (indépendants, pas de mapping par index) ──
// Chaque fetcher renvoie un nombre ou null en cas d'échec/absence d'endpoint.
const STAT_FETCHERS = {
  produits: async () => {
    const d = await fetch("/api/products").then(r => r.json());
    return d?.total ?? d?.count ?? d?.products?.length ?? null;
  },
  // Les clients "réels" viennent des commandes (checkout invité), pas de /api/users,
  // pour rester cohérent avec ClientsPage.jsx qui utilise /api/orders/clients.
  clients: async () => {
    const d = await fetch("/api/orders/clients").then(r => r.json());
    return d?.total ?? d?.count ?? d?.clients?.length ?? null;
  },
  commandes: async () => {
    // Le backend limite /api/orders à 10 résultats par défaut ;
    // on force limit=1000 pour obtenir le vrai total (cf. CommandesPage.jsx).
    const d = await fetch("/api/orders?limit=1000").then(r => r.json());
    return d?.total ?? d?.count ?? d?.orders?.length ?? null;
  },
  colis: async () => {
    const d = await fetch("/api/colis").then(r => r.json());
    return d?.total ?? d?.count ?? d?.colis?.length ?? null;
  },
};

// ── Formatage relatif du temps ("il y a 5 min") ──────────────────
const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
};

// ── Cloche de notifications (coin haut-droit du dashboard) ───────
const NotificationsBell = ({ notifications, unreadCount, onMarkAllRead, onItemClick, navigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(v => !v)} title="Notifications"
        style={{
          position: "relative", width: 42, height: 42, borderRadius: 12,
          background: open ? `${C.magenta}10` : C.white, border: `1px solid ${C.lavender}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
        {BellIcon(C.navy, 19)}
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, padding: "0 4px",
            background: C.magenta, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0, width: 340, maxWidth: "calc(100vw - 32px)",
          background: C.white, border: `1px solid ${C.lavender}`, borderRadius: 16,
          boxShadow: "0 16px 44px rgba(27,37,89,.18)", zIndex: 50, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.lavender}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Notifications</span>
            {notifications.length > 0 && (
              <button onClick={onMarkAllRead}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: C.magenta }}>
                Tout marquer lu
              </button>
            )}
          </div>
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "30px 16px", textAlign: "center", color: C.muted, fontSize: 12 }}>
                Aucune notification pour le moment
              </div>
            ) : notifications.map((n) => (
              <button key={n.id}
                onClick={() => {
                  onItemClick(n.id);
                  if (n.trackingNumber) { navigate?.("admin-commandes"); setOpen(false); }
                }}
                style={{
                  width: "100%", display: "flex", gap: 10, textAlign: "left",
                  background: n.read ? "none" : `${C.magenta}08`,
                  border: "none", borderBottom: `1px solid ${C.lavender}`,
                  cursor: "pointer", padding: "11px 16px",
                }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: n.read ? "transparent" : C.magenta }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{n.title}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, margin: "2px 0 4px", lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: "#B4BACB" }}>{timeAgo(n.createdAt)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useAppStore((s) => s.navigate);
  const user     = useAppStore((s) => s.user);
  const [stats, setStats] = useState(STATS);

  // ── Notifications ────────────────────────────────────────────
  // ✅ EMPTY_ARR (référence stable) au lieu de `|| []` (nouvelle référence à chaque rendu)
  const notifications            = useAppStore((s) => s.notifications ?? EMPTY_ARR);
  const unreadCount               = notifications.filter((n) => !n.read).length;
  const markAllNotificationsRead  = useAppStore((s) => s.markAllNotificationsRead);
  const markNotificationRead      = useAppStore((s) => s.markNotificationRead);

  useEffect(() => {
    let cancelled = false;

    const fetchCounts = async () => {
      const entries = await Promise.allSettled(
        STATS.map(s => STAT_FETCHERS[s.statKey]())
      );

      if (cancelled) return;

      setStats(prev => prev.map((s, i) => {
        const res = entries[i];
        if (res.status === "fulfilled" && res.value != null) {
          return { ...s, value: String(res.value) };
        }
        return s; // garde la valeur précédente si le fetch échoue
      }));
    };

    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div style={{ fontFamily: FONT }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.magenta, letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 6px" }}>
            {greeting}
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: C.navy, margin: 0 }}>
            Tableau de bord
          </h1>
          <p style={{ color: C.muted, fontSize: 14, margin: "6px 0 0" }}>
            Bienvenue, <strong style={{ color: C.navy }}>{user?.name ?? "Admin"}</strong> — Vue d'ensemble de votre activité
          </p>
        </div>

        <NotificationsBell
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllNotificationsRead}
          onItemClick={markNotificationRead}
          navigate={navigate}
        />
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
        {stats.map(({ label, value, iconKey, color, page }) => (
          <div key={label} onClick={() => navigate(page)} style={{
            background: C.white, borderRadius: 16, border: `1px solid ${C.lavender}`,
            padding: "20px 24px", cursor: "pointer", position: "relative", overflow: "hidden",
            transition: "transform .15s, box-shadow .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,37,89,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "16px 16px 0 0" }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              {Icons[iconKey]?.(color, 22)}
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.navy, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Notifications récentes */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            Notifications récentes
            {unreadCount > 0 && (
              <span style={{ background: C.magenta, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h2>
          {notifications.length > 0 && (
            <button onClick={markAllNotificationsRead}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: C.magenta }}>
              Tout marquer lu
            </button>
          )}
        </div>

        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.lavender}`, overflow: "hidden" }}>
          {notifications.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.magenta}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                {BellIcon(C.magenta, 20)}
              </div>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
                Aucune notification pour le moment — les nouvelles commandes apparaîtront ici.
              </p>
            </div>
          ) : (
            notifications.slice(0, 8).map((n, i) => (
              <div key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.trackingNumber) navigate("admin-commandes");
                }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px",
                  borderBottom: i < Math.min(notifications.length, 8) - 1 ? `1px solid ${C.lavender}` : "none",
                  background: n.read ? "none" : `${C.magenta}06`,
                  cursor: "pointer", transition: "background .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${C.magenta}0c`; }}
                onMouseLeave={e => { e.currentTarget.style.background = n.read ? "none" : `${C.magenta}06`; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.magenta}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {Icons.commandes(C.magenta, 17)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{n.title}</span>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.magenta, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2, lineHeight: 1.5 }}>{n.message}</div>
                </div>
                <span style={{ fontSize: 11, color: "#B4BACB", flexShrink: 0, whiteSpace: "nowrap", marginTop: 2 }}>{timeAgo(n.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modules */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: "0 0 16px" }}>Modules de gestion</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {MODULES.map(({ iconKey, label, desc, page, color }) => (
            <div key={label} onClick={() => navigate(page)} style={{
              background: C.white, borderRadius: 14, border: `1px solid ${C.lavender}`,
              padding: "20px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
              transition: "all .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.lavender; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {Icons[iconKey]?.(color, 24)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{label}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}