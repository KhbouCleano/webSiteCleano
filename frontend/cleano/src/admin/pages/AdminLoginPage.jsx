// src/admin/pages/AdminLoginPage.jsx
import { useState } from "react";
import useAppStore from "../../store/useAppStore";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy:    "#1B2559",
  sidebar: "#151D45",
  magenta: "#E7398B",
  rose:    "#F472B6",
  lavender:"#E8EAF6",
  muted:   "#8892B0",
  white:   "#FFFFFF",
  offwhite:"#F8F9FF",
  danger:  "#EF4444",
};

export default function AdminLoginPage() {
  const navigate  = useAppStore((s) => s.navigate);
  const setUser   = useAppStore((s) => s.setUser);
  const user      = useAppStore((s) => s.user);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  // Si déjà connecté mais pas admin
  const alreadyLogged = !!user && user.role !== "admin";

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Identifiants incorrects.");
        setLoading(false);
        return;
      }

      if (data.user?.role !== "admin") {
        setError("Accès refusé. Ce compte n'a pas les droits administrateur.");
        setLoading(false);
        return;
      }

      // Stocker le token si présent
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }

      setUser(data.user);
      navigate("admin");
    } catch (_) {
      // Demo : accepter admin@khbouclean.tn / admin123
      if (email === "admin@khbouclean.tn" && password === "admin123") {
        setUser({ id: 1, name: "Admin", email, role: "admin" });
        navigate("admin");
      } else {
        setError("Impossible de joindre le serveur. Vérifiez votre connexion.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.sidebar,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      padding: 20,
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Décoration background */}
      <div style={{
        position: "absolute", top: -120, right: -120,
        width: 400, height: 400, borderRadius: "50%",
        background: `${C.magenta}12`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: "50%",
        background: `${C.rose}08`,
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 420,
        position: "relative", zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#fff",
            margin: "0 auto 16px",
            boxShadow: `0 8px 32px ${C.magenta}40`,
          }}>K</div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>
            Khbou Clean
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>
            Panneau d'administration
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 20,
          padding: "32px 36px",
          backdropFilter: "blur(12px)",
        }}>

          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 800, margin: "0 0 6px" }}>
            Connexion admin
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 28px" }}>
            Réservé aux administrateurs uniquement
          </p>

          {/* Avertissement si connecté non-admin */}
          {alreadyLogged && (
            <div style={{
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
              color: "#FCA5A5", fontSize: 13,
            }}>
              ⚠️ Vous êtes connecté en tant que <strong>{user.name}</strong> (rôle : {user.role}).
              Ce compte n'a pas accès à l'administration.
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
              color: "#FCA5A5", fontSize: 13,
            }}>
              ❌ {error}
            </div>
          )}

          {/* Champ email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.5)", letterSpacing: ".08em",
              textTransform: "uppercase", marginBottom: 6,
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="admin@khbouclean.tn"
              autoComplete="email"
              style={{
                width: "100%", padding: "12px 16px",
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 12, color: "#fff",
                fontFamily: FONT, fontSize: 14,
                outline: "none", boxSizing: "border-box",
                transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = C.magenta}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>

          {/* Champ mot de passe */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.5)", letterSpacing: ".08em",
              textTransform: "uppercase", marginBottom: 6,
            }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "12px 46px 12px 16px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, color: "#fff",
                  fontFamily: FONT, fontSize: 14,
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color .2s",
                }}
                onFocus={e => e.target.style.borderColor = C.magenta}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
              <button
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "rgba(255,255,255,0.35)",
                  cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1,
                }}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading
                ? "rgba(231,57,139,0.5)"
                : `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: FONT,
              transition: "opacity .2s",
              letterSpacing: ".02em",
            }}
          >
            {loading ? "Connexion…" : "Accéder au dashboard →"}
          </button>

          {/* Retour site */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => navigate("home")}
              style={{
                background: "none", border: "none",
                color: "rgba(255,255,255,0.35)", fontSize: 12,
                cursor: "pointer", fontFamily: FONT,
                textDecoration: "underline",
              }}
            >
              ← Retour au site
            </button>
          </div>
        </div>

        {/* Hint démo */}
        <div style={{
          marginTop: 16, textAlign: "center",
          color: "rgba(255,255,255,0.2)", fontSize: 11,
        }}>
          Démo : admin@khbouclean.tn / admin123
        </div>
      </div>
    </div>
  );
}
