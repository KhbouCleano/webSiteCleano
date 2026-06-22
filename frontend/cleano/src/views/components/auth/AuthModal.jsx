// ============================================================
// src/views/components/auth/AuthModal.jsx
// ============================================================
import { useState } from "react";
import { useAuthController } from "../../../controllers/useAuthController";
import useAppStore from "../../../store/useAppStore";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy:    "#1B2559",
  magenta: "#E7398B",
  rose:    "#F472B6",
  lavender:"#E8EAF6",
  muted:   "#8892B0",
  offwhite:"#F8F9FF",
};

const Input = ({ label, type = "text", value, onChange, placeholder, icon }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: FONT, letterSpacing: ".08em", textTransform: "uppercase" }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      {icon && (
        <div style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: C.muted, pointerEvents: "none",
          display: "flex", alignItems: "center",
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: icon ? "11px 14px 11px 42px" : "11px 14px",
          borderRadius: 12,
          border: `1.5px solid ${C.lavender}`,
          fontFamily: FONT, fontSize: 14,
          outline: "none",
          background: C.offwhite,
          color: C.navy,
          transition: "border-color .2s, box-shadow .2s",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = C.magenta;
          e.currentTarget.style.boxShadow = `0 0 0 3px rgba(231,57,139,0.12)`;
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = C.lavender;
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  </div>
);

const AuthModal = () => {
  const { authModal, authTab, closeAuthModal, handleLogin, handleRegister,
          loading, error, setError } = useAuthController();
  const setTab = useAppStore((s) => s.openAuthModal);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [showPass, setShowPass] = useState(false);

  if (!authModal) return null;

  const reset = () => { setEmail(""); setPassword(""); setName(""); setError(""); };

  const submit = async (e) => {
    e.preventDefault();
    if (authTab === "login") await handleLogin(email, password);
    else                      await handleRegister(email, password, name);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(27,37,89,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <div style={{
        background: "#fff",
        borderRadius: 24,
        width: "100%", maxWidth: 440,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(27,37,89,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        animation: "scaleIn .25s ease both",
      }}>

        {/* Bandeau dégradé haut */}
        <div style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #2a3a8a 50%, ${C.magenta} 100%)`,
          padding: "32px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Décos */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          {/* Logo Cleano */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
             <div style={{ marginBottom: 14 }}>
               <img
                 src="/Logo Cleano.png"
                 alt="Cleano"
                 style={{
                   height: 52,
                   width: "auto",
                   objectFit: "contain",
                   filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
                   display: "block",
                 }}
               />
             </div>
              <h2 style={{
                fontFamily: FONT, fontSize: 26, fontWeight: 900,
                color: "#fff", margin: 0, lineHeight: 1.2,
              }}>
                {authTab === "login" ? "Bon retour " : "Créer un compte"}
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: FONT, margin: "6px 0 0" }}>
                {authTab === "login"
                  ? "Connectez-vous à votre espace Cleano"
                  : "Rejoignez la famille Cleano"}
              </p>
            </div>

            {/* Bouton fermer */}
            <button onClick={closeAuthModal} style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer", color: "#fff", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >✕</button>
          </div>
        </div>

        {/* Corps */}
        <div style={{ padding: "28px 32px 32px" }}>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4,
            background: C.offwhite,
            border: `1px solid ${C.lavender}`,
            borderRadius: 12, padding: 4, marginBottom: 24,
          }}>
            {[["login", "Connexion"], ["register", "Inscription"]].map(([tab, label]) => (
              <button key={tab}
                onClick={() => { setTab(tab); reset(); }}
                style={{
                  flex: 1, padding: "9px", borderRadius: 9, border: "none",
                  cursor: "pointer", fontSize: 13, fontWeight: 700,
                  fontFamily: FONT, transition: "all .2s",
                  background: authTab === tab
                    ? `linear-gradient(135deg, ${C.magenta}, ${C.rose})`
                    : "transparent",
                  color: authTab === tab ? "#fff" : C.muted,
                  boxShadow: authTab === tab ? `0 4px 14px ${C.magenta}40` : "none",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Formulaire */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {authTab === "register" && (
              <Input
                label="Nom complet"
                value={name}
                onChange={setName}
                placeholder="Jean Dupont"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="votre@email.com"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              }
            />

            {/* Champ mot de passe avec œil */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: FONT, letterSpacing: ".08em", textTransform: "uppercase" }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "11px 42px 11px 42px",
                    borderRadius: 12,
                    border: `1.5px solid ${C.lavender}`,
                    fontFamily: FONT, fontSize: 14,
                    outline: "none",
                    background: C.offwhite,
                    color: C.navy,
                    transition: "border-color .2s, box-shadow .2s",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = C.magenta;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(231,57,139,0.12)`;
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = C.lavender;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: C.muted, display: "flex", alignItems: "center", padding: 4,
                  }}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Lien mot de passe oublié */}
            {authTab === "login" && (
              <div style={{ textAlign: "right", marginTop: -8 }}>
                <button type="button" style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: C.magenta, fontFamily: FONT, fontWeight: 600,
                }}>
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 13, color: "#dc2626",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "10px 14px", borderRadius: 10,
                fontFamily: FONT,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: loading
                  ? C.lavender
                  : `linear-gradient(135deg, ${C.magenta} 0%, ${C.rose} 100%)`,
                color: loading ? C.muted : "#fff",
                border: "none", borderRadius: 14,
                padding: "14px", fontSize: 14, fontWeight: 700,
                fontFamily: FONT, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 8px 24px ${C.magenta}40`,
                transition: "all .2s",
                marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = "brightness(1.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Chargement…
                </>
              ) : authTab === "login" ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Se connecter
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Créer mon compte
                </>
              )}
            </button>

            {/* Séparateur */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: C.lavender }} />
              <span style={{ fontSize: 12, color: C.muted, fontFamily: FONT }}>ou</span>
              <div style={{ flex: 1, height: 1, background: C.lavender }} />
            </div>

            {/* Lien switcher */}
            <p style={{ textAlign: "center", fontSize: 13, color: C.muted, fontFamily: FONT, margin: 0 }}>
              {authTab === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <button
                type="button"
                onClick={() => { setTab(authTab === "login" ? "register" : "login"); reset(); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: C.magenta, fontWeight: 700, fontSize: 13, fontFamily: FONT,
                }}
              >
                {authTab === "login" ? "Créer un compte" : "Se connecter"}
              </button>
            </p>

          </form>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;