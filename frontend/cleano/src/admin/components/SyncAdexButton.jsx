// ============================================================
// src/admin/components/SyncAdexButton.jsx
// Bouton à ajouter dans CommandesPage pour synchroniser
// ============================================================
import { useState } from "react";

const COLOR = "#F59E0B";
const FONT  = "'Raleway', system-ui, sans-serif";

const IcoSync = (s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

export const SyncAdexButton = ({ onSyncComplete }) => {
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch("/api/sync/adex");
      const data = await res.json();
      setResult(data);
      setShowInfo(true);
      // Recharger les commandes après sync
      if (data.summary?.updated > 0) {
        onSyncComplete?.();
      }
      // Cacher le résumé après 8 secondes
      setTimeout(() => setShowInfo(false), 8000);
    } catch (err) {
      setResult({ success: false, error: err.message });
      setShowInfo(true);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        style={{
          display:    "inline-flex",
          alignItems: "center",
          gap:        7,
          padding:    "9px 16px",
          borderRadius: 10,
          cursor:     loading ? "default" : "pointer",
          fontSize:   13,
          fontWeight: 500,
          border:     "none",
          background: loading
            ? "#E5E7EB"
            : "linear-gradient(135deg, #3B82F6, #6366F1)",
          color:      "#fff",
          boxShadow:  loading ? "none" : "0 2px 10px rgba(99,102,241,.35)",
          fontFamily: FONT,
          opacity:    loading ? 0.75 : 1,
          transition: "all .2s ease",
        }}
      >
        <span style={{ animation: loading ? "spin .8s linear infinite" : "none", display:"flex" }}>
          {IcoSync(14)}
        </span>
        {loading ? "Synchronisation…" : "Sync ADEX"}
      </button>

      {/* Popup résultat */}
      {showInfo && result && (
        <div style={{
          position:   "absolute",
          top:        "calc(100% + 8px)",
          right:      0,
          zIndex:     200,
          background: "#fff",
          border:     `1.5px solid ${result.success ? "#86EFAC" : "#FCA5A5"}`,
          borderRadius: 12,
          padding:    "14px 18px",
          minWidth:   260,
          boxShadow:  "0 8px 30px rgba(0,0,0,0.12)",
          fontFamily: FONT,
        }}>
          {result.success ? (
            <>
              <div style={{ fontSize:13, fontWeight:600, color:"#15803D", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                ✅ Synchronisation terminée
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {[
                  { label:"Total scanné",  value: result.summary?.total,     color:"#1B2559" },
                  { label:"Mis à jour",    value: result.summary?.updated,   color:"#10B981" },
                  { label:"Déjà à jour",   value: result.summary?.unchanged, color:"#8892B0" },
                  { label:"Erreurs",       value: result.summary?.errors,    color:"#EF4444" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:"#8892B0" }}>{label}</span>
                    <span style={{ fontWeight:600, color }}>{value ?? 0}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:"#8892B0", marginTop:8 }}>
                Durée : {result.duration_ms}ms
              </div>
            </>
          ) : (
            <div style={{ fontSize:13, color:"#B91C1C" }}>
              ❌ Erreur : {result.error}
            </div>
          )}
          <button
            onClick={() => setShowInfo(false)}
            style={{ position:"absolute", top:8, right:8, background:"none", border:"none", cursor:"pointer", color:"#8892B0", fontSize:16 }}>
            ×
          </button>
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default SyncAdexButton;
