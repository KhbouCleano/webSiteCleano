// src/views/pages/ProfilePage.jsx
import { useState } from "react";
import useAppStore from "../../store/useAppStore";

const FONT = "'Raleway', system-ui, sans-serif";
const C = {
  navy: "#1B2559", magenta: "#E7398B", rose: "#F472B6",
  lavender: "#E8EAF6", muted: "#8892B0", white: "#FFFFFF", offwhite: "#F8F9FF",
};

const UserAvatar = ({ user, size = 80 }) => {
  const initials = (user?.name ?? "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#E7398B", "#6366F1", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"];
  const color  = colors[(user?.name?.charCodeAt(0) ?? 0) % colors.length];
  if (user?.avatar) return <img src={user.avatar} alt={user.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.lavender}` }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.32, fontWeight: 700, fontFamily: FONT }}>
      {initials}
    </div>
  );
};

const Field = ({ label, value, type = "text", onChange, editable }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: FONT }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={!editable}
      style={{ padding: "11px 16px", border: `1.5px solid ${editable ? C.lavender : "transparent"}`, borderRadius: 12, fontFamily: FONT, fontSize: 14, outline: "none", background: editable ? C.white : C.offwhite, color: C.navy, transition: "border-color .2s", cursor: editable ? "text" : "default" }}
      onFocus={e => editable && (e.target.style.borderColor = C.magenta)}
      onBlur={e => e.target.style.borderColor = editable ? C.lavender : "transparent"}
    />
  </div>
);

export default function ProfilePage() {
  const user    = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const navigate = useAppStore((s) => s.navigate);
  const logout  = useAppStore((s) => s.logout);
  const addToast = useAppStore((s) => s.addToast);

  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [name,    setName]      = useState(user?.name ?? "");
  const [email,   setEmail]     = useState(user?.email ?? "");
  const [pwdOld,  setPwdOld]    = useState("");
  const [pwdNew,  setPwdNew]    = useState("");

  if (!user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <p style={{ color: C.muted, marginBottom: 20 }}>Vous devez être connecté pour voir votre profil.</p>
        <button onClick={() => navigate("home")} style={{ background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`, color: "#fff", border: "none", borderRadius: 12, padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { name, email };
      if (pwdNew && pwdOld) { payload.currentPassword = pwdOld; payload.newPassword = pwdNew; }

      const res  = await fetch(`/api/users/${user.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) { addToast(data.error ?? "Erreur lors de la mise à jour.", "error"); }
      else {
        setUser({ ...user, name, email });
        setEditing(false);
        setPwdOld(""); setPwdNew("");
        addToast("Profil mis à jour ✓", "success");
      }
    } catch (_) {
      // Optimistic update sans backend
      setUser({ ...user, name, email });
      setEditing(false);
      addToast("Profil mis à jour ✓", "success");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("home");
    addToast("Déconnexion réussie", "info");
  };

  const ROLE_BADGE = user.role === "admin"
    ? { label: "Administrateur", color: "#6366F1", bg: "#EEF2FF" }
    : { label: "Client",         color: "#10B981", bg: "#F0FDF4" };

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.offwhite, padding: "40px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Bouton retour */}
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: FONT, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Retour
        </button>

        {/* Card profil */}
        <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.lavender}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(27,37,89,0.07)" }}>

          {/* Header coloré */}
          <div style={{ background: `linear-gradient(135deg, #1B2559, ${C.magenta})`, padding: "32px 32px 24px", display: "flex", alignItems: "flex-end", gap: 20 }}>
            <UserAvatar user={user} size={80} />
            <div>
              <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>{user.name}</h1>
              <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ROLE_BADGE.bg, color: ROLE_BADGE.color }}>
                {ROLE_BADGE.label}
              </span>
            </div>
          </div>

          {/* Corps formulaire */}
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: C.navy, margin: 0 }}>Informations personnelles</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={{ background: `${C.magenta}12`, border: `1px solid ${C.magenta}30`, color: C.magenta, borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                  ✏️ Modifier
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditing(false); setName(user.name); setEmail(user.email); setPwdOld(""); setPwdNew(""); }}
                    style={{ background: "none", border: `1px solid ${C.lavender}`, color: C.muted, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                    Annuler
                  </button>
                  <button onClick={handleSave} disabled={loading}
                    style={{ background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`, border: "none", color: "#fff", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                    {loading ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              )}
            </div>

            <Field label="Nom complet"   value={name}  onChange={setName}  editable={editing} />
            <Field label="Email"         value={email} onChange={setEmail} editable={editing} type="email" />

            {editing && (
              <div style={{ marginTop: 8, padding: "16px", background: C.offwhite, borderRadius: 14, border: `1px solid ${C.lavender}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 12px", fontFamily: FONT }}>
                  Changer le mot de passe (optionnel)
                </p>
                <Field label="Mot de passe actuel" value={pwdOld} onChange={setPwdOld} editable={true} type="password" />
                <Field label="Nouveau mot de passe" value={pwdNew} onChange={setPwdNew} editable={true} type="password" />
              </div>
            )}

            {/* Infos non modifiables */}
            <div style={{ marginTop: 20, padding: 16, background: C.offwhite, borderRadius: 14, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Rôle</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: ROLE_BADGE.color, marginTop: 3 }}>{ROLE_BADGE.label}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Membre depuis</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 3 }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long" }) : "—"}
                </div>
              </div>
            </div>

            {/* Raccourci dashboard admin */}
            {user.role === "admin" && (
              <button onClick={() => navigate("admin")}
                style={{ width: "100%", marginTop: 16, background: "linear-gradient(135deg, #1B2559, #2A3680)", color: "#fff", border: "none", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Accéder au Dashboard Admin
              </button>
            )}

            {/* Déconnexion */}
            <button onClick={handleLogout}
              style={{ width: "100%", marginTop: 12, background: "none", border: `1.5px solid #FCA5A5`, color: "#EF4444", borderRadius: 14, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}