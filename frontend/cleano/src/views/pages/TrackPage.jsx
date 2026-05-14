// ============================================================
// src/views/pages/TrackPage.jsx
// ============================================================
import { useState } from "react";
import { findOrderByNumber, ORDER_STATUSES } from "../../models/Order";

const TrackPage = () => {
  const [input, setInput]   = useState("");
  const [order, setOrder]   = useState(null);
  const [searched, setSearched] = useState(false);

  const search = () => {
    setOrder(findOrderByNumber(input));
    setSearched(true);
  };

  const currentIdx = order ? ORDER_STATUSES.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="page-enter">
      <div style={{ background: "var(--brand)", padding: "36px 0 44px", color: "#fff" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 6 }}>Suivre ma commande</h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15 }}>Entrez votre numéro de commande</p>
        </div>
      </div>
      <div className="container" style={{ padding: "40px 24px", maxWidth: 680 }}>
        {/* Search */}
        <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Ex: CMD-12345"
            style={{
              flex: 1, padding: "12px 18px", border: "1.5px solid var(--border)",
              borderRadius: 12, fontFamily: "var(--font-body)", fontSize: 15, outline: "none",
              background: "#fff",
            }}
          />
          <button className="btn btn-primary" style={{ padding: "12px 24px" }} onClick={search}>
            Rechercher
          </button>
        </div>

        {searched && !order && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p style={{ fontSize: 16 }}>Aucune commande trouvée pour ce numéro.</p>
          </div>
        )}

        {order && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Commande</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--brand)" }}>#{order.number}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Livraison estimée</p>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{order.estimatedDelivery}</p>
                </div>
              </div>

              {/* Progress */}
              <div style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                  <div style={{
                    position: "absolute", top: 18, left: "10%", right: "10%",
                    height: 3, background: "var(--border)", borderRadius: 2, zIndex: 0,
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      background: "var(--accent)",
                      width: `${(currentIdx / (ORDER_STATUSES.length - 1)) * 100}%`,
                      transition: "width .6s ease",
                    }} />
                  </div>
                  {ORDER_STATUSES.map((s, i) => {
                    const done = i <= currentIdx;
                    return (
                      <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%",
                          background: done ? "var(--accent)" : "#fff",
                          border: `2.5px solid ${done ? "var(--accent)" : "var(--border)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 17, boxShadow: done ? "0 0 0 4px rgba(0,200,150,.15)" : "none",
                        }}>{s.icon}</div>
                        <span style={{ fontSize: 12, fontWeight: done ? 600 : 400,
                                       color: done ? "var(--brand)" : "var(--text-muted)" }}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: "16px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
                {[["Transporteur", order.carrier], ["N° de suivi", order.trackingCode], ["Adresse", order.address]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 120 }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { TrackPage };
export default TrackPage;
