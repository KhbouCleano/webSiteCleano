/**
 * adminRoutes.jsx
 *
 * Intégrer dans src/router/index.jsx (ou App.jsx) :
 *
 * import { adminRoutes } from "./adminRoutes";
 *
 * const router = createBrowserRouter([
 *   { path: "/", element: <RootLayout />, children: [ ...appRoutes ] },
 *   adminRoutes,   // <-- ajouter ici
 * ]);
 */
import AdminLayout           from "../../admin/components/AdminLayout";
import AdminDashboard        from "../../admin/pages/AdminDashboard";
import ProduitsPage          from "../../admin/pages/ProduitsPage";
import StockPage             from "../../admin/pages/StockPage";
import StockHistoriquePage   from "../../admin/pages/StockHistoriquePage"; // ← était utilisé plus bas sans être importé
import ClientsPage           from "../../admin/pages/ClientsPage";
import CommandesPage         from "../../admin/pages/CommandesPage";
import ColisPage             from "../../admin/pages/ColisPage";
import HistoriquePage        from "../../admin/pages/HistoriquePage";

export const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true,               element: <AdminDashboard /> },
    { path: "produits",          element: <ProduitsPage /> },
    { path: "stock",             element: <StockPage /> },
    { path: "stock-historique",  element: <StockHistoriquePage /> },
    { path: "clients",           element: <ClientsPage /> },
    { path: "commandes",         element: <CommandesPage /> },
    { path: "colis",             element: <ColisPage /> },
    { path: "historique",        element: <HistoriquePage /> },
  ],
};