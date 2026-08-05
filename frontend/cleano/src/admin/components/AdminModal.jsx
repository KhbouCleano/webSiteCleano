// src/admin/components/AdminModal.jsx
export const FONT = "'Raleway', system-ui, sans-serif";
export const C = {
  navy: "#1B2559", magenta: "#E7398B", rose: "#F472B6",
  lavender: "#E8EAF6", muted: "#8892B0",
  white: "#FFFFFF", offwhite: "#F8F9FF",
  danger: "#EF4444",
};

const IcoClose = (c = "#8892B0", s = 16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoSave = (c = "#fff", s = 14) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IcoAlert = (c = "#EF4444", s = 22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ── Modal ─────────────────────────────────────────────────────
// hideFooter : permet de gérer son propre footer (ex: ADEX)
export function AdminModal({
  open, onClose, title, color = C.magenta,
  children, onSubmit, submitLabel = "Enregistrer",
  hideFooter = false,
}) {
  if (!open) return null;

  return (
    <div
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(27,37,89,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
      }}
    >
      <div style={{
        background: C.white, borderRadius: 20, width: "100%", maxWidth: 520,
        overflow: "hidden", boxShadow: "0 20px 60px rgba(27,37,89,0.25)",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }}>
        {/* Barre couleur */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${C.magenta})`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${C.lavender}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: 0 }}>{title}</h2>
          <button
            type="button"
            onMouseDown={e => e.stopPropagation()}
            onClick={onClose}
            style={{
              background: C.offwhite, border: `1px solid ${C.lavender}`,
              borderRadius: 8, width: 30, height: 30, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {IcoClose()}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>

        {/* Footer — masqué si hideFooter */}
        {!hideFooter && (
          <div style={{
            padding: "14px 24px", borderTop: `1px solid ${C.lavender}`,
            display: "flex", gap: 10, justifyContent: "flex-end",
            background: C.offwhite, flexShrink: 0,
          }}>
            <button
              type="button"
              onMouseDown={e => e.stopPropagation()}
              onClick={onClose}
              style={{
                background: C.white, border: `1.5px solid ${C.lavender}`,
                borderRadius: 10, padding: "9px 20px",
                fontSize: 13, fontWeight: 500, color: C.muted,
                cursor: "pointer", fontFamily: FONT,
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.preventDefault(); e.stopPropagation(); onSubmit?.(e); }}
              style={{
                background: `linear-gradient(135deg, ${color}, ${C.magenta})`,
                color: "#fff", border: "none", borderRadius: 10,
                padding: "9px 22px", fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: FONT,
                display: "flex", alignItems: "center", gap: 7,
              }}
            >
              {IcoSave("#fff", 13)}
              {submitLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────
export function AdminConfirm({
  open, onClose, onConfirm, title = "Confirmer l'action ?",
  message = "", confirmLabel = "Confirmer", color = C.danger,
}) {
  if (!open) return null;

  return (
    <div
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(27,37,89,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1100, padding: 20,
      }}
    >
      <div style={{
        background: C.white, borderRadius: 20, width: "100%", maxWidth: 400,
        overflow: "hidden", boxShadow: "0 20px 60px rgba(27,37,89,0.25)",
        padding: "28px 26px 22px", textAlign: "center",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: `${color}15`, margin: "0 auto 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {IcoAlert(color, 24)}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: "0 0 8px", fontFamily: FONT }}>
          {title}
        </h3>
        {message && (
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 22px", lineHeight: 1.5, fontFamily: FONT }}>
            {message}
          </p>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, background: C.white, border: `1.5px solid ${C.lavender}`,
              borderRadius: 10, padding: "10px 0",
              fontSize: 13, fontWeight: 700, color: C.muted,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => { onConfirm?.(); onClose(); }}
            style={{
              flex: 1, background: color, border: "none",
              borderRadius: 10, padding: "10px 0",
              fontSize: 13, fontWeight: 700, color: "#fff",
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form helpers ──────────────────────────────────────────────
export function FormField({ label, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
      <label style={{
        fontSize: 11, fontWeight: 500, color: C.muted,
        letterSpacing: ".08em", textTransform: "uppercase", fontFamily: FONT,
      }}>
        {label}{required && <span style={{ color: C.magenta }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export const inputStyle = {
  padding: "10px 14px",
  border: `1.5px solid ${C.lavender}`,
  borderRadius: 10, fontFamily: FONT, fontSize: 13,
  outline: "none", background: C.offwhite, color: C.navy,
  width: "100%", boxSizing: "border-box", transition: "border-color .2s",
};

export const labelStyle = {
  display: "block",
  fontSize: 11, fontWeight: 700, color: C.muted,
  letterSpacing: ".06em", textTransform: "uppercase",
  fontFamily: FONT, marginBottom: 6,
};

export const btnPrimary = {
  background: `linear-gradient(135deg, ${C.magenta}, ${C.rose})`,
  color: "#fff", border: "none", borderRadius: 10,
  padding: "10px 18px", fontSize: 13, fontWeight: 700,
  cursor: "pointer", fontFamily: FONT,
};

export const btnGhost = {
  background: C.white, border: `1.5px solid ${C.lavender}`,
  color: C.muted, borderRadius: 10,
  padding: "10px 18px", fontSize: 13, fontWeight: 700,
  cursor: "pointer", fontFamily: FONT,
};

export function FormInput(props) {
  const { onFocus, onBlur, style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{ ...inputStyle, ...style }}
      onFocus={e => { e.target.style.borderColor = C.magenta; onFocus?.(e); }}
      onBlur={e => { e.target.style.borderColor = C.lavender; onBlur?.(e); }}
    />
  );
}

export function FormSelect({ children, style, ...props }) {
  return (
    <select {...props} style={{ ...inputStyle, ...style }}>
      {children}
    </select>
  );
}

export function FormTextarea(props) {
  const { onFocus, onBlur, style, ...rest } = props;
  return (
    <textarea
      {...rest}
      style={{ ...inputStyle, resize: "vertical", ...style }}
      onFocus={e => { e.target.style.borderColor = C.magenta; onFocus?.(e); }}
      onBlur={e => { e.target.style.borderColor = C.lavender; onBlur?.(e); }}
    />
  );
}