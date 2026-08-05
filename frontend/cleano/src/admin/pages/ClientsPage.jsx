// src/admin/pages/ClientsPage.jsx
import { useState, useEffect, useCallback } from "react";
import AdminTable from "../components/AdminTable";

const COLOR = "#E7398B";

// ── Icon ──────────────────────────────────────────────────────
const IcoClients = (c = COLOR, s = 22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AVATAR = (name) => {
  const initials = (name ?? "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#E7398B", "#6366F1", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"];
  const color = colors[name?.charCodeAt(0) % colors.length] ?? COLOR;
  return { initials, color };
};

// ── Page ──────────────────────────────────────────────────────
// Liste des clients construite à partir des commandes (adex_client_name/phone/address),
// pas depuis la table users — car la majorité des commandes sont passées en invité (checkout ADEX).
export default function ClientsPage() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/orders/clients").then(r => r.json());
      setRows(data.clients ?? []);
    } catch (_) {
      setRows([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const COLUMNS = [
    {
      key: "name",
      label: "Client",
      render: (v) => {
        const { initials, color } = AVATAR(v);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${color}20`, color,
              fontWeight: 500, fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{ fontWeight: 500, color: "#1B2559" }}>{v ?? "—"}</span>
          </div>
        );
      },
    },
    {
      key: "phone",
      label: "Téléphone",
      render: v => v
        ? <a href={`tel:${v}`} style={{ color: "#6366F1", fontSize: 12, textDecoration: "none" }}>{v}</a>
        : <span style={{ color: "#C4C9D8", fontSize: 12 }}>—</span>,
    },
    {
      key: "address",
      label: "Adresse",
      render: v => (
        <span style={{ color: "#1B2559", fontSize: 12 }}>
          {v || <span style={{ color: "#C4C9D8" }}>—</span>}
        </span>
      ),
    },
    {
      key: "orders_count",
      label: "Commandes",
      render: v => (
        <span style={{
          padding: "3px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 600,
          background: "#EEF2FF", color: "#6366F1",
        }}>
          {v}
        </span>
      ),
    },
    {
      key: "last_order_date",
      label: "Dernière commande",
      render: v => (
        <span style={{ color: "#8892B0", fontSize: 12 }}>
          {v ? new Date(v).toLocaleDateString("fr-FR") : "—"}
        </span>
      ),
    },
  ];

  return (
    <AdminTable
      title="Clients"
      icon={IcoClients(COLOR, 22)}
      color={COLOR}
      columns={COLUMNS}
      rows={rows}
      loading={loading}
      searchKeys={["name", "phone", "address"]}
    />
  );
}