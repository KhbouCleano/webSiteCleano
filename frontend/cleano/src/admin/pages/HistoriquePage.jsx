import { useState, useEffect, useCallback } from "react";
import AdminTable from "../components/AdminTable";

const COLOR = "#3B82F6";

const STATUS_MAP = {
  livre:        { label: "Livré",        color: "#10B981", bg: "#F0FDF4" },
  en_transit:   { label: "En transit",   color: "#F59E0B", bg: "#FFFBEB" },
  en_livraison: { label: "En livraison", color: "#F97316", bg: "#FFF7ED" },
  expedie:      { label: "Expédié",      color: "#3B82F6", bg: "#EFF6FF" },
  preparation:  { label: "Préparation",  color: "#8B5CF6", bg: "#F5F3FF" },
  echec:        { label: "Échec",        color: "#EF4444", bg: "#FEF2F2" },
  retour:       { label: "Retour",       color: "#6B7280", bg: "#F9FAFB" },
  delivered:    { label: "Livré",        color: "#10B981", bg: "#F0FDF4" },
  shipped:      { label: "Expédié",      color: "#3B82F6", bg: "#EFF6FF" },
  pending:      { label: "En attente",   color: "#F59E0B", bg: "#FFFBEB" },
  processing:   { label: "En cours",     color: "#6366F1", bg: "#EEF2FF" },
  cancelled:    { label: "Annulé",       color: "#EF4444", bg: "#FEF2F2" },
};
const IcoHistorique = (c = COLOR, s = 22) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"/>
    <polyline points="12 6 12 12 16 14"/>
    <polyline points="22 12 19 15 16 12"/>
  </svg>
);
export default function HistoriquePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Join client + colis + commandes data
      const [clients, colis, orders] = await Promise.all([
        fetch("/api/users").then(r => r.json()),
        fetch("/api/colis").then(r => r.json()),
        fetch("/api/orders").then(r => r.json()),
      ]);
      const colisArr = colis.colis ?? colis ?? [];
      const ordersArr = orders.orders ?? orders ?? [];
      const clientsArr = clients.users ?? clients ?? [];

      const merged = colisArr.map(c => {
        const order = ordersArr.find(o => o.id === parseInt(c.order_id));
        const client = clientsArr.find(u => u.id === order?.user_id);
        return {
          id: c.id,
          client_name: client?.name ?? c.client_name ?? "—",
          client_email: client?.email ?? "—",
          order_id: c.order_id,
          order_total: order?.total ?? "—",
          tracking: c.tracking_number,
          colis_status: c.status,
          order_status: order?.status ?? "—",
          address: c.address,
          carrier: c.carrier,
          estimated_date: c.estimated_date,
          created_at: order?.created_at ?? c.created_at,
        };
      });
      setRows(merged);
    } catch (_) {
      // Demo combined data
      setRows([
        { id: 1, client_name: "Ahmed Ben Ali",   client_email: "ahmed@email.com",   order_id: 1001, order_total: 45.90, tracking: "TN123456789", colis_status: "livre",        order_status: "delivered",  carrier: "Rapid Post",         estimated_date: "2024-03-05", created_at: "2024-03-01" },
        { id: 2, client_name: "Fatma Trabelsi",  client_email: "fatma@email.com",   order_id: 1002, order_total: 22.50, tracking: "TN987654321", colis_status: "en_livraison", order_status: "shipped",    carrier: "La Poste Tunisienne", estimated_date: "2024-03-08", created_at: "2024-03-05" },
        { id: 3, client_name: "Mohamed Gharbi",  client_email: "mohamed@email.com", order_id: 1003, order_total: 67.00, tracking: "TN456789123", colis_status: "en_transit",   order_status: "processing", carrier: "DHL",                 estimated_date: "2024-03-12", created_at: "2024-03-10" },
        { id: 4, client_name: "Ahmed Ben Ali",   client_email: "ahmed@email.com",   order_id: 1004, order_total: 15.80, tracking: "TN321654987", colis_status: "preparation",  order_status: "pending",    carrier: "Rapid Post",         estimated_date: "2024-03-15", created_at: "2024-03-12" },
        { id: 5, client_name: "Fatma Trabelsi",  client_email: "fatma@email.com",   order_id: 1005, order_total: 33.40, tracking: "TN654321789", colis_status: "retour",       order_status: "cancelled",  carrier: "Chronopost",         estimated_date: "2024-03-14", created_at: "2024-03-14" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === "all" ? rows : rows.filter(r => r.colis_status === filter);

  const COLUMNS = [
    { key: "client_name", label: "Client", render: (v, row) => (
      <div>
        <div style={{ fontWeight: 700, color: "#1B2559" }}>{v}</div>
        <div style={{ fontSize: 11, color: "#6366F1" }}>{row.client_email}</div>
      </div>
    )},
    { key: "order_id", label: "Commande", render: v => <strong style={{ color: "#1B2559" }}>#{v}</strong> },
    { key: "order_total", label: "Montant", render: v => (
      <span style={{ color: "#10B981", fontWeight: 700 }}>{isNaN(v) ? v : `${Number(v).toFixed(2)} TND`}</span>
    )},
    { key: "tracking", label: "N° Colis", render: v => (
      <code style={{ background: "#E8EAF6", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{v}</code>
    )},
    { key: "carrier", label: "Transporteur", render: v => <span style={{ fontSize: 12 }}>{v}</span> },
    { key: "colis_status", label: "Statut colis", render: v => {
      const { label, color, bg } = STATUS_MAP[v] ?? { label: v, color: "#8892B0", bg: "#F1F5F9" };
      return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color }}>{label}</span>;
    }},
    { key: "order_status", label: "Statut commande", render: v => {
      const { label, color, bg } = STATUS_MAP[v] ?? { label: v, color: "#8892B0", bg: "#F1F5F9" };
      return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color }}>{label}</span>;
    }},
    { key: "estimated_date", label: "Livraison", render: v => (
      <span style={{ fontSize: 12, color: "#8892B0" }}>{v ? String(v).slice(0, 10) : "—"}</span>
    )},
    { key: "created_at", label: "Date commande", render: v => (
      <span style={{ fontSize: 12, color: "#8892B0" }}>{v ? String(v).slice(0, 10) : "—"}</span>
    )},
  ];

  const FilterBtn = ({ value, label }) => (
    <button
      onClick={() => setFilter(value)}
      className="hist-filter-btn"
      style={{
        padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
        border: `1.5px solid ${filter === value ? COLOR : "#E8EAF6"}`,
        background: filter === value ? COLOR : "#fff",
        color: filter === value ? "#fff" : "#8892B0",
        cursor: "pointer", fontFamily: "inherit",
        transition: "all .15s", whiteSpace: "nowrap", flexShrink: 0,
      }}
    >{label}</button>
  );

  return (
    <>
      <style>{`
        .hist-filters {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .hist-filters {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
            margin: 0 -4px;
            padding-left: 4px;
            padding-right: 4px;
            width: 100%;
          }
          .hist-filters::-webkit-scrollbar { display: none; }
          .hist-filter-btn {
            font-size: 11px !important;
            padding: 6px 12px !important;
          }
        }
      `}</style>
      <AdminTable
        title="Historique Client — Colis"
        icon={IcoHistorique(COLOR, 22)}
        color={COLOR}
        columns={COLUMNS}
        rows={filtered}
        loading={loading}
        searchKeys={["client_name", "tracking", "client_email"]}
        extra={
          <div className="hist-filters">
            <FilterBtn value="all"         label="Tous" />
            <FilterBtn value="livre"       label="Livrés" />
            <FilterBtn value="en_transit"  label="En transit" />
            <FilterBtn value="preparation" label="Préparation" />
            <FilterBtn value="retour"      label="Retours" />
          </div>
        }
      />
    </>
  );
}