// ============================================================
// src/views/components/shared/Toast.jsx
// ============================================================
import useAppStore from "../../../store/useAppStore";

const COLORS = {
  success: { bg: "#0a2342", accent: "#00c896" },
  info:    { bg: "#1e3a5f", accent: "#3b82f6" },
  error:   { bg: "#7f1d1d", accent: "#ef4444" },
};

const ToastItem = ({ toast }) => {
  const removeToast = useAppStore((s) => s.removeToast);
  const c = COLORS[toast.type] || COLORS.success;

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: c.bg, color: "#fff",
        padding: "14px 18px", borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,.25)",
        borderLeft: `4px solid ${c.accent}`,
        animation: "toastIn .3s ease both",
        maxWidth: 340, cursor: "pointer",
        fontFamily: "var(--font-body)", fontSize: 14,
      }}
      onClick={() => removeToast(toast.id)}
    >
      <span style={{ flex: 1 }}>{toast.message}</span>
      <span style={{ opacity: .5, fontSize: 12 }}>✕</span>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      display: "flex", flexDirection: "column", gap: 10,
      zIndex: 9999, pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
