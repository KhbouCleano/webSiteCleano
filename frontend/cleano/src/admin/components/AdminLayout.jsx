// src/admin/components/AdminLayout.jsx
import { useState, useEffect } from "react";
import useAppStore from "../../store/useAppStore";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy:    "#1B2559",
  magenta: "#E7398B",
  rose:    "#F472B6",
  lavender:"#E8EAF6",
  muted:   "#8892B0",
  white:   "#FFFFFF",
  offwhite:"#F8F9FF",
  bg:      "#0F1535",
  sidebar: "#161D3F",
  hover:   "rgba(255,255,255,0.06)",
};

// ── SVG Icons ─────────────────────────────────────────────────
const NavIcons = {
  dashboard: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  produits: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  stock: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  clients: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  commandes: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  colis: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  historique: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14"/>
      <path d="M3.05 11a9 9 0 1 0 .5-4"/>
      <polyline points="3 3 3 7 7 7"/>
    </svg>
  ),
  profile: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logout: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  site: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  chevron: (c,s=13,open=false) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"
      style={{ transition:"transform .2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink:0 }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  menu: (c,s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (c,s=18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
gouvernorats: (c,s=18) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
),
};

// ── Nav Groups ────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    group: "Principal",
    items: [
      { page: "admin", iconKey: "dashboard", label: "Dashboard" },
    ],
  },
{
  group: "Catalogue",
  items: [
    {
      iconKey: "produits", label: "Produits", page: "admin-produits",
      sub: [
        { page: "admin-produits",         label: "Liste des produits" },
        { page: "admin-stock",            label: "Gestion du stock" },
        { page: "admin-stock-historique", label: "Historique du stock" },
      ],
    },
    {
      iconKey: "gouvernorats", label: "Gouvernorats", page: "admin-gouvernorats",
      sub: [
        { page: "admin-gouvernorats", label: "Liste des gouvernorats" },
        { page: "admin-points-vente", label: "Points de vente" },
      ],
    },
  ],
},

  {
    group: "Ventes",
    items: [
      {
        iconKey: "clients", label: "Clients", page: "admin-clients",
        sub: [{ page: "admin-clients", label: "Liste des clients" }],
      },
      {
        iconKey: "commandes", label: "Commandes", page: "admin-commandes",
        sub: [
          { page: "admin-commandes", label: "Toutes les commandes" },
//           { page: "admin-colis",     label: "Gestion des colis" },
        ],
      },
    ],
  },
  {
    group: "Rapports",
    items: [
      { page: "admin-historique", iconKey: "historique", label: "Historique" },
    ],
  },
];

// ── NavItem ───────────────────────────────────────────────────
const NavItem = ({ item, currentPage, navigate, collapsed, onClose }) => {
  const hasSub = item.sub && item.sub.length > 0;
  const isParentActive = hasSub
    ? item.sub.some(s => s.page === currentPage) || item.page === currentPage
    : item.page === currentPage;
  const [open, setOpen] = useState(isParentActive);
  const isActive = item.page === currentPage;
  const iconColor = isActive || isParentActive ? C.magenta : "rgba(255,255,255,0.45)";

  const handleClick = () => {
    if (hasSub && !collapsed) { setOpen(v => !v); }
    else { navigate(item.page); onClose?.(); }
  };

  return (
    <div>
      <button onClick={handleClick} style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: collapsed ? "11px 0" : "10px 14px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: isActive ? "rgba(231,57,139,0.15)" : isParentActive ? "rgba(231,57,139,0.08)" : "transparent",
        borderLeft: isActive ? `3px solid ${C.magenta}` : "3px solid transparent",
        borderRight:"none", borderTop:"none", borderBottom:"none",
        color: isActive ? "#fff" : isParentActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)",
        fontSize: 13, fontWeight: isActive ? 700 : 500,
        fontFamily: FONT, cursor: "pointer", transition: "all .15s",
        whiteSpace: "nowrap", overflow: "hidden",
      }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = "#fff"; }}}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = isParentActive ? "rgba(231,57,139,0.08)" : "transparent"; e.currentTarget.style.color = isParentActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)"; }}}
      >
        <span style={{ display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {NavIcons[item.iconKey]?.(iconColor, 18)}
        </span>
        {!collapsed && (
          <>
            <span style={{ flex:1, textAlign:"left" }}>{item.label}</span>
            {hasSub && NavIcons.chevron("rgba(255,255,255,0.3)", 13, open)}
          </>
        )}
      </button>

      {/* Sous-menu */}
      {hasSub && !collapsed && open && (
        <div style={{ paddingLeft: 45, paddingBottom: 4 }}>
          {item.sub.map(s => {
            const subActive = currentPage === s.page;
            return (
              <button key={s.page} onClick={() => { navigate(s.page); onClose?.(); }} style={{
                display:"flex", alignItems:"center", gap:8, width:"100%",
                padding:"7px 10px 7px 0",
                background:"transparent", border:"none",
                color: subActive ? C.magenta : "rgba(255,255,255,0.35)",
                fontSize:12, fontWeight: subActive ? 700 : 400,
                fontFamily:FONT, cursor:"pointer", transition:"color .15s", textAlign:"left",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = subActive ? C.magenta : "rgba(255,255,255,0.35)"}
              >
                <div style={{ width:5, height:5, borderRadius:"50%", background: subActive ? C.magenta : "rgba(255,255,255,0.2)", flexShrink:0 }}/>
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Sidebar Content ───────────────────────────────────────────
const SidebarContent = ({ collapsed, setCollapsed, currentPage, navigate, user, handleLogout, onClose, isMobile }) => {
  const initials = (user?.name ?? "A").split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2);

  return (
    <>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "16px 0" : "16px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display:"flex", alignItems:"center",
        justifyContent: collapsed ? "center" : "space-between",
        minHeight: 64, flexShrink: 0,
      }}>
        {!collapsed ? (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <img src="/Logo Cleano.png" alt="Cleano"
                style={{ height:34, width:"auto", objectFit:"contain" }}
                onError={e => {
                  e.target.style.display="none";
                  const d = document.createElement("div");
                  d.style.cssText=`width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,${C.magenta},${C.rose});display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:900;flex-shrink:0`;
                  d.textContent="K";
                  e.target.parentNode.prepend(d);
                }}
              />
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:13 }}>Khbou Clean</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:9, letterSpacing:".12em", textTransform:"uppercase" }}>Administration</div>
              </div>
            </div>
            {!isMobile ? (
              <button onClick={() => setCollapsed(true)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8, width:28, height:28, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            ) : (
              <button onClick={onClose} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8, width:28, height:28, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              }}>
                {NavIcons.close("rgba(255,255,255,0.6)", 14)}
              </button>
            )}
          </>
        ) : (
          <button onClick={() => setCollapsed(false)} style={{
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:8, width:36, height:36, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 0", overflowY:"auto", overflowX:"hidden" }}>
        {NAV_GROUPS.map(({ group, items }) => (
          <div key={group} style={{ marginBottom:4 }}>
            {!collapsed && (
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", padding:"8px 18px 3px", fontFamily:FONT }}>
                {group}
              </div>
            )}
            {collapsed && <div style={{ height:6 }}/>}
            {items.map(item => (
              <NavItem key={item.page} item={item} currentPage={currentPage} navigate={navigate} collapsed={collapsed} onClose={onClose} />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding: collapsed ? "12px 0" : "12px 14px", flexShrink:0 }}>
        {!collapsed && (
          <button onClick={() => { navigate("profile"); onClose?.(); }} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:"10px 12px", cursor:"pointer", marginBottom:6, textAlign:"left",
            transition:"background .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
          >
            <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.magenta},${C.rose})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#fff", fontSize:12, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name ?? "Admin"}</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.email ?? ""}</div>
            </div>
            {NavIcons.profile("rgba(255,255,255,0.25)", 13)}
          </button>
        )}

        {collapsed && (
          <button onClick={() => navigate("profile")} style={{
            display:"flex", alignItems:"center", justifyContent:"center", width:"100%",
            background:"transparent", border:"none", borderRadius:8, padding:"10px 0",
            cursor:"pointer", marginBottom:4,
          }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.magenta},${C.rose})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700 }}>
              {initials}
            </div>
          </button>
        )}

        <button onClick={() => { navigate("home"); onClose?.(); }} style={{
          display:"flex", alignItems:"center", gap:10, width:"100%",
          padding: collapsed ? "9px 0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          background:"transparent", border:"none", borderRadius:8,
          color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:500,
          fontFamily:FONT, cursor:"pointer", transition:"all .15s", marginBottom:2,
        }}
          onMouseEnter={e => { e.currentTarget.style.background=C.hover; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.35)"; }}
        >
          {NavIcons.site("currentColor", 16)}
          {!collapsed && <span>Voir le site</span>}
        </button>

        <button onClick={handleLogout} style={{
          display:"flex", alignItems:"center", gap:10, width:"100%",
          padding: collapsed ? "9px 0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          background:"transparent", border:"none", borderRadius:8,
          color:"rgba(239,68,68,0.55)", fontSize:12, fontWeight:500,
          fontFamily:FONT, cursor:"pointer", transition:"all .15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; e.currentTarget.style.color="#FCA5A5"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(239,68,68,0.55)"; }}
        >
          {NavIcons.logout("currentColor", 16)}
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </>
  );
};

// ── Hook responsive ───────────────────────────────────────────
const useIsMobile = () => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h, { passive:true });
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

// ── AdminLayout ───────────────────────────────────────────────
export default function AdminLayout({ children }) {
  const currentPage = useAppStore((s) => s.page);
  const navigate    = useAppStore((s) => s.navigate);
  const user        = useAppStore((s) => s.user);
  const logout      = useAppStore((s) => s.logout);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => { if (!isMobile) setMobileOpen(false); }, [isMobile]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("home");
  };

  const currentLabel = NAV_GROUPS
    .flatMap(g => g.items)
    .flatMap(i => [i, ...(i.sub ?? [])])
    .find(i => i.page === currentPage)?.label ?? "Dashboard";

  const currentIconKey = NAV_GROUPS
    .flatMap(g => g.items)
    .find(i => i.page === currentPage || i.sub?.some(s => s.page === currentPage))?.iconKey ?? "dashboard";

  const initials = (user?.name ?? "A").split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2);

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:FONT, background: "#f6cfe2", gap: 0 }}>

      {/* ── SIDEBAR DESKTOP ── */}
      {!isMobile && (
        <div style={{
          width: collapsed ? 72 : 252,
          flexShrink:0, transition:"width .25s ease",
          padding:"12px 8px 12px 12px",
          position:"sticky", top:0, height:"100vh",
          zIndex:100, boxSizing:"border-box",
        }}>
          <div style={{
            width:"100%", height:"100%",
            background: C.sidebar,
            display:"flex", flexDirection:"column",
            borderRadius:18,
            border:"1px solid rgba(255,255,255,0.07)",
            overflow:"hidden",
          }}>
            <SidebarContent
              collapsed={collapsed} setCollapsed={setCollapsed}
              currentPage={currentPage} navigate={navigate}
              user={user} handleLogout={handleLogout}
              isMobile={false}
            />
          </div>
        </div>
      )}

      {/* ── DRAWER MOBILE ── */}
      {isMobile && mobileOpen && (
        <>
          {/* Overlay */}
          <div onClick={() => setMobileOpen(false)} style={{
            position:"fixed", inset:0, zIndex:200,
            background:"rgba(10,15,40,0.7)",
            backdropFilter:"blur(4px)",
          }}/>
          {/* Drawer */}
          <div style={{
            position:"fixed", top:12, left:12, bottom:12,
            width:252, zIndex:210,
            background: C.sidebar,
            borderRadius:18,
            border:"1px solid rgba(255,255,255,0.07)",
            display:"flex", flexDirection:"column",
            overflow:"hidden",
            boxShadow:"0 20px 60px rgba(0,0,0,0.5)",
            animation:"slideInLeft .25s ease",
          }}>
            <style>{`@keyframes slideInLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }`}</style>
            <SidebarContent
              collapsed={false} setCollapsed={setCollapsed}
              currentPage={currentPage} navigate={navigate}
              user={user} handleLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* ── MAIN ── */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, padding: isMobile ? "8px" : "12px 12px 12px 6px" }}>
        <div style={{
          flex:1, display:"flex", flexDirection:"column",
          background: C.offwhite,
          borderRadius: 18,
          overflow:"hidden",
          border:`1px solid ${C.lavender}`,
          minHeight:0,
        }}>

          {/* Topbar */}
          <header style={{
            background: C.white,
            borderBottom:`1px solid ${C.lavender}`,
            padding: isMobile ? "0 16px" : "0 28px",
            height:60, display:"flex", alignItems:"center",
            justifyContent:"space-between", flexShrink:0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Hamburger mobile */}
              {isMobile && (
                <button onClick={() => setMobileOpen(true)} style={{
                  background:"none", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:4, borderRadius:8, marginRight:4,
                }}>
                  {NavIcons.menu(C.navy, 20)}
                </button>
              )}
              <div style={{ width:30, height:30, borderRadius:8, background:`${C.magenta}12`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {NavIcons[currentIconKey]?.(C.magenta, 15)}
              </div>
              <div>
                <div style={{ fontSize: isMobile ? 13 : 14, fontWeight:800, color:C.navy }}>{currentLabel}</div>
                {!isMobile && <div style={{ fontSize:10, color:C.muted }}>Khbou Clean — Admin</div>}
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:C.offwhite, border:`1px solid ${C.lavender}`, borderRadius:50, padding: isMobile ? "4px 10px 4px 4px" : "5px 12px 5px 5px" }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:`linear-gradient(135deg,${C.magenta},${C.rose})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:700, flexShrink:0 }}>
                  {initials}
                </div>
                {!isMobile && <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{user?.name ?? "Admin"}</span>}
              </div>
            </div>
          </header>

          {/* Content */}
          <div style={{ flex:1, padding: isMobile ? "16px" : "28px 32px", overflow:"auto" }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}