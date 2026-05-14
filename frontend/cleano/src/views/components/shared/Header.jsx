// ============================================================
// src/views/components/shared/Header.jsx
// Pill desktop → Side Drawer mobile (même design glassmorphism)
// ============================================================
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCartController } from "../../../controllers/useCartController";
import { useAuthController }  from "../../../controllers/useAuthController";
import useAppStore from "../../../store/useAppStore";

const C = {
  navy:     "#272F67",
  magenta:  "#E7398B",
  rose:     "#EE81B1",
  roseLight:"#F6CFE2",
  lavender: "#DDDEE8",
  offwhite: "#FAFAFD",
};

const LINKS = [
  { label: "Accueil",  target: "home" },
  { label: "Produits", target: "products" },
  { label: "À propos", target: "about" },
  { label: "Contact",  target: "contact" },
  { label: "Suivre",   target: "track" },
];

// ── Hook mobile ──────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

// ── NavPill desktop ──────────────────────────────────────────
const NavPill = ({ label, target, onNavigate }) => {
  const page   = useAppStore((s) => s.page);
  const active = page === target;
  return (
    <motion.button
      onClick={() => onNavigate(target)}
      style={{
        position: "relative",
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, fontWeight: active ? 600 : 400,
        color: active ? C.offwhite : "rgba(39,47,103,.65)",
        padding: "8px 18px", borderRadius: 50, zIndex: 1,
        whiteSpace: "nowrap",
      }}
      whileHover={{ color: C.navy }}
      transition={{ duration: 0.15 }}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          style={{ position: "absolute", inset: 0, background: C.magenta, borderRadius: 50, zIndex: -1 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
      )}
      {label}
    </motion.button>
  );
};

// ── CartBadge ────────────────────────────────────────────────
const CartBadge = ({ count }) => (
  <motion.span
    key={count}
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={{
      position: "absolute", top: -5, right: -5,
      minWidth: 18, height: 18,
      background: C.magenta, color: "#fff",
      borderRadius: 10, fontSize: 10, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Poppins', sans-serif", border: "2px solid #fff",
    }}
  >
    {count > 9 ? "9+" : count}
  </motion.span>
);

// ── Hamburger ────────────────────────────────────────────────
const HamburgerIcon = ({ open }) => (
  <div style={{ width: 18, height: 13, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={
          open
            ? i === 0 ? { rotate: 45,  y: 5.5,  opacity: 1 }
            : i === 1 ? { opacity: 0,  scaleX: 0 }
            :           { rotate: -45, y: -5.5, opacity: 1 }
            : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
        }
        transition={{ duration: 0.22, ease: "easeInOut" }}
        style={{ display: "block", height: 2, borderRadius: 2, background: C.navy, transformOrigin: "center" }}
      />
    ))}
  </div>
);

// ── Side Drawer mobile ────────────────────────────────────────
// Même design que la pill : glassmorphism, border lavande, liens pill
const SideDrawer = ({ open, onClose, navigate, user, handleLogout, openAuthModal, count, favCount, openCart }) => {
  const page = useAppStore((s) => s.page);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop flouté */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 210,
              background: "rgba(39,47,103,.28)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Drawer — slide depuis la droite */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
            style={{
              position: "fixed",
              top: 12, bottom: 12,    // flottant : espace haut & bas
              right: 12,              // espace à droite
              width: "min(300px, calc(100vw - 24px))",
              zIndex: 220,
              // ── Même glassmorphism que la pill ──
              background: "rgba(250,250,253,.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1.5px solid ${C.lavender}`,
              borderRadius: 28,
              boxShadow: "0 8px 40px rgba(39,47,103,.18), 0 2px 12px rgba(39,47,103,.10)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ── Header du drawer : logo + fermer ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 16px 12px",
              borderBottom: `1.5px solid ${C.lavender}`,
            }}>
              {/* Logo — même style que dans la pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.navy}, ${C.magenta})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15,
                }}>🧼</div>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17, fontWeight: 700, color: C.navy,
                  letterSpacing: "-.02em",
                }}>Cleano</span>
              </div>

              {/* Bouton fermer — même forme pill */}
              <motion.button
                onClick={onClose}
                style={{
                  background: `${C.magenta}14`,
                  border: `1.5px solid ${C.magenta}33`,
                  cursor: "pointer", width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: C.magenta, fontWeight: 700,
                }}
                whileHover={{ background: `${C.magenta}22` }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>

            {/* ── Nav links — même style pill que desktop ── */}
            <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
              {LINKS.map((l, i) => {
                const active = page === l.target;
                return (
                  <motion.button
                    key={l.target}
                    onClick={() => { navigate(l.target); onClose(); }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
                    style={{
                      position: "relative",
                      width: "100%",
                      display: "flex", alignItems: "center",
                      // Fond magenta si actif — exactement comme NavPill desktop
                      background: active ? C.magenta : "none",
                      border: "none", cursor: "pointer",
                      borderRadius: 50,
                      padding: "10px 18px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14, fontWeight: active ? 600 : 400,
                      color: active ? "#fff" : "rgba(39,47,103,.65)",
                      textAlign: "left",
                      marginBottom: 3,
                    }}
                    whileHover={{
                      background: active ? C.magenta : `${C.magenta}10`,
                      color: active ? "#fff" : C.navy,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {l.label}
                    {active && (
                      <motion.span
                        layoutId="drawer-pill-dot"
                        style={{
                          marginLeft: "auto", width: 6, height: 6,
                          borderRadius: "50%", background: "rgba(255,255,255,.7)",
                          display: "inline-block", flexShrink: 0,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* ── Séparateur ── */}
            <div style={{ height: 1, background: C.lavender, margin: "0 16px" }} />

            {/* ── Actions bas ── */}
            <div style={{ padding: "12px 10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

              {/* Favoris + Panier — style roseLight avec border lavande */}
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "❤️ Favoris", badge: favCount, action: () => { navigate("favorites"); onClose(); } },
                  { label: "🛒 Panier",  badge: count,    action: () => { openCart(); onClose(); } },
                ].map(({ label, badge, action }) => (
                  <motion.button
                    key={label}
                    onClick={action}
                    style={{
                      flex: 1, display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 6,
                      background: C.roseLight,
                      border: `1.5px solid ${C.lavender}`,
                      cursor: "pointer", borderRadius: 50, padding: "9px 4px",
                      fontSize: 13, fontWeight: 600, color: C.navy,
                      fontFamily: "'DM Sans', sans-serif",
                      minWidth: 0, boxSizing: "border-box",
                    }}
                    whileHover={{ background: "#e8b8d0" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                    {badge > 0 && (
                      <span style={{
                        background: C.magenta, color: "#fff",
                        borderRadius: 10, fontSize: 9, fontWeight: 700,
                        padding: "1px 5px", flexShrink: 0,
                      }}>{badge}</span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Auth */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{
                    flex: 1, fontSize: 12, color: C.navy, fontWeight: 500,
                    background: C.roseLight, padding: "9px 12px", borderRadius: 50,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    border: `1.5px solid ${C.lavender}`, minWidth: 0,
                  }}>
                    👤 {user.name}
                  </span>
                  <motion.button
                    onClick={handleLogout}
                    style={{
                      fontSize: 12, fontWeight: 600, color: C.magenta,
                      background: "none", border: `1.5px solid ${C.roseLight}`,
                      cursor: "pointer", padding: "9px 12px", borderRadius: 50,
                      fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0,
                    }}
                    whileHover={{ background: C.roseLight }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Déco.
                  </motion.button>
                </div>
              ) : (
                // Bouton Connexion — même dégradé navy que desktop
                <motion.button
                  onClick={() => { openAuthModal("login"); onClose(); }}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${C.navy}, #3a4494)`,
                    color: "#fff", border: "none", cursor: "pointer",
                    padding: "11px 16px", borderRadius: 50,
                    fontSize: 13, fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box",
                  }}
                  whileHover={{ filter: "brightness(1.1)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Connexion
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Header principal ──────────────────────────────────────────
const Header = () => {
  const navigate = useAppStore((s) => s.navigate);
  const favCount = useAppStore((s) => s.favorites.length);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const { count, openCart }                   = useCartController();
  const { user, handleLogout, openAuthModal } = useAuthController();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`html, body { max-width: 100%; overflow-x: hidden; }`}</style>

      <motion.header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        pointerEvents: "none",
        width: "100vw", maxWidth: "100vw", boxSizing: "border-box",
      }}>
        <div style={{
          display: "flex", justifyContent: "center",
          padding: isMobile ? "8px 8px" : "16px 24px",
          width: "100%", maxWidth: "100%", boxSizing: "border-box",
        }}>
          <motion.div
            animate={{
              boxShadow: scrolled
                ? "0 8px 40px rgba(39,47,103,.18), 0 2px 12px rgba(39,47,103,.10)"
                : "0 4px 24px rgba(39,47,103,.10)",
              background: scrolled
                ? "rgba(250,250,253,.97)"
                : "rgba(250,250,253,.88)",
            }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex", alignItems: "center",
              padding: isMobile ? "5px 5px 5px 12px" : "6px 6px 6px 20px",
              borderRadius: 50,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1.5px solid ${C.lavender}`,
              pointerEvents: "all",
              width: isMobile ? "100%" : "auto",
              maxWidth: "100%",
              boxSizing: "border-box",
              justifyContent: isMobile ? "space-between" : "flex-start",
              gap: isMobile ? 0 : 8,
              minWidth: 0,
            }}
          >
            {/* ── Logo ── */}
            <motion.button
              onClick={() => navigate("home")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                flexShrink: 0, marginRight: isMobile ? 0 : 8,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <div style={{
                width: isMobile ? 26 : 30, height: isMobile ? 26 : 30,
                borderRadius: 9, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.navy}, ${C.magenta})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMobile ? 13 : 15,
              }}>🧼</div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? 15 : 18,
                fontWeight: 700, color: C.navy,
                letterSpacing: "-.02em", whiteSpace: "nowrap",
              }}>Cleano</span>
            </motion.button>

            {/* ── DESKTOP ── */}
            {!isMobile && (
              <>
                <div style={{ width: 1, height: 22, background: C.lavender, flexShrink: 0 }} />
                <nav style={{ display: "flex", gap: 0 }}>
                  {LINKS.map((l) => (
                    <NavPill key={l.target} label={l.label} target={l.target} onNavigate={navigate} />
                  ))}
                </nav>
                <div style={{ width: 1, height: 22, background: C.lavender, flexShrink: 0 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <motion.button onClick={() => navigate("favorites")}
                    style={{ position: "relative", background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
                    whileHover={{ background: C.roseLight, scale: 1.1 }} whileTap={{ scale: 0.92 }}>
                    ❤️ {favCount > 0 && <CartBadge count={favCount} />}
                  </motion.button>
                  <motion.button onClick={openCart}
                    style={{ position: "relative", background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
                    whileHover={{ background: C.roseLight, scale: 1.1 }} whileTap={{ scale: 0.92 }}>
                    🛒 {count > 0 && <CartBadge count={count} />}
                  </motion.button>
                  {user ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                      <span style={{ fontSize: 12, color: C.navy, fontWeight: 500, background: C.roseLight, padding: "4px 12px", borderRadius: 50, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>👤 {user.name}</span>
                      <motion.button onClick={handleLogout}
                        style={{ fontSize: 12, fontWeight: 600, color: C.magenta, background: "none", border: `1.5px solid ${C.roseLight}`, cursor: "pointer", padding: "5px 12px", borderRadius: 50, fontFamily: "'Poppins', sans-serif" }}
                        whileHover={{ background: C.roseLight }}>×</motion.button>
                    </div>
                  ) : (
                    <motion.button onClick={() => openAuthModal("login")}
                      style={{ marginLeft: 4, background: `linear-gradient(135deg, ${C.navy}, #3a4494)`, color: "#fff", border: "none", cursor: "pointer", padding: "9px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap" }}
                      whileHover={{ scale: 1.04, filter: "brightness(1.1)" }} whileTap={{ scale: 0.96 }}>
                      Connexion
                    </motion.button>
                  )}
                </div>
              </>
            )}

            {/* ── MOBILE : panier rapide + hamburger ── */}
            {isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                <motion.button onClick={openCart}
                  style={{ position: "relative", background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
                  whileTap={{ scale: 0.88 }} aria-label="Panier">
                  🛒 {count > 0 && <CartBadge count={count} />}
                </motion.button>
                <div style={{ width: 1, height: 16, background: C.lavender, margin: "0 2px" }} />
                <motion.button
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{ background: menuOpen ? `${C.magenta}15` : "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  whileTap={{ scale: 0.9 }} aria-label="Menu">
                  <HamburgerIcon open={menuOpen} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Side Drawer mobile */}
      {isMobile && (
        <SideDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navigate={navigate}
          user={user}
          handleLogout={handleLogout}
          openAuthModal={openAuthModal}
          count={count}
          favCount={favCount}
          openCart={openCart}
        />
      )}
    </>
  );
};

export default Header;