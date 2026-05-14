// ============================================================
// src/views/components/auth/AuthModal.jsx
// ============================================================
import { useState } from "react";
import { useAuthController } from "../../../controllers/useAuthController";
import useAppStore from "../../../store/useAppStore";

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "10px 14px", borderRadius: 10,
        border: "1.5px solid var(--border)",
        fontFamily: "var(--font-body)", fontSize: 14,
        outline: "none", transition: "border .15s",
        background: "var(--surface-2)",
      }}
      onFocus={(e)  => { e.currentTarget.style.borderColor = "var(--brand)"; }}
      onBlur={(e)   => { e.currentTarget.style.borderColor = "var(--border)"; }}
    />
  </div>
);

const AuthModal = () => {
  const { authModal, authTab, closeAuthModal, handleLogin, handleRegister,
          loading, error, setError } = useAuthController();
  const setTab = useAppStore((s) => s.openAuthModal);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");

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
        background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420,
        padding: "32px", animation: "scaleIn .25s ease both",
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--brand)" }}>
            {authTab === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <button onClick={closeAuthModal} style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--surface-3)", border: "none",
            cursor: "pointer", fontSize: 16, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "var(--surface-3)",
                      borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {[["login", "Connexion"], ["register", "Inscription"]].map(([tab, label]) => (
            <button key={tab}
              onClick={() => { setTab(tab); reset(); }}
              style={{
                flex: 1, padding: "8px", borderRadius: 7, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-ui)", transition: "all .2s",
                background: authTab === tab ? "#fff" : "transparent",
                color: authTab === tab ? "var(--brand)" : "var(--text-secondary)",
                boxShadow: authTab === tab ? "var(--shadow-sm)" : "none",
              }}
            >{label}</button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {authTab === "register" && (
            <Input label="Nom complet" value={name} onChange={setName} placeholder="Jean Dupont" />
          )}
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="votre@email.fr" />
          <Input label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

          {error && (
            <p style={{ fontSize: 13, color: "var(--danger)", background: "#fef2f2",
                        padding: "10px 14px", borderRadius: 8 }}>⚠️ {error}</p>
          )}

          <button type="submit" className="btn btn-primary"
            style={{ justifyContent: "center", marginTop: 4, padding: "12px" }}
            disabled={loading}
          >
            {loading ? "⏳ Chargement…" : authTab === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
