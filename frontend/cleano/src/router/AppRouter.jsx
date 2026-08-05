// src/router/AppRouter.jsx
import useAppStore from "../store/useAppStore";

// Pages publiques
import HomePage      from "../views/pages/HomePage";
import ProductsPage  from "../views/pages/ProductsPage";
import AboutPage     from "../views/pages/AboutPage";
import ContactPage   from "../views/pages/ContactPage";
import TrackPage     from "../views/pages/TrackPage";
import FavoritesPage from "../views/pages/FavoritesPage";
import DetailPage    from "../views/pages/DetailPage";
import CartPage      from "../views/pages/CartPage";
import CheckoutPage  from "../views/pages/CheckoutPage";
import MapPage       from "../views/pages/MapPage";
import ProfilePage   from "../views/pages/ProfilePage";

// Pages admin
import AdminLayout    from "../admin/components/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import ProduitsPage   from "../admin/pages/ProduitsPage";
import StockPage      from "../admin/pages/StockPage";
import ClientsPage    from "../admin/pages/ClientsPage";
import CommandesPage  from "../admin/pages/CommandesPage";
import ColisPage      from "../admin/pages/ColisPage";
import HistoriquePage from "../admin/pages/HistoriquePage";
import AdminLoginPage from "../admin/pages/AdminLoginPage";
import StockHistoriquePage from "../admin/pages/StockHistoriquePage";
import AdminGouvernorats   from "../admin/pages/AdminGouvernorats";   // ← ajouté
import AdminPointsVente    from "../admin/pages/AdminPointsVente";    // ← ajouté


const ADMIN_PAGES = [
  "admin", "admin-produits", "admin-stock", "admin-stock-historique",
  "admin-gouvernorats", "admin-points-vente",                        // ← ajouté
  "admin-clients", "admin-commandes", "admin-colis", "admin-historique",
];

const AdminContent = ({ page }) => {
  switch (page) {
    case "admin-produits":         return <ProduitsPage />;
    case "admin-stock":            return <StockPage />;
    case "admin-clients":          return <ClientsPage />;
    case "admin-commandes":        return <CommandesPage />;
    case "admin-colis":            return <ColisPage />;
    case "admin-historique":       return <HistoriquePage />;
    case "admin-stock-historique": return <StockHistoriquePage />;
    case "admin-gouvernorats":     return <AdminGouvernorats />;   // ← ajouté
    case "admin-points-vente":     return <AdminPointsVente />;    // ← ajouté
    default:                       return <AdminDashboard />;
  }
};

const AppRouter = () => {
  const page = useAppStore((s) => s.page);
  const user = useAppStore((s) => s.user);

  // ── Pages admin ──────────────────────────────────────────────
  if (ADMIN_PAGES.includes(page)) {
    if (!user || user.role !== "admin") {
      return <AdminLoginPage />;
    }
    return (
      <AdminLayout>
        <AdminContent page={page} />
      </AdminLayout>
    );
  }

  // ── Pages publiques ──────────────────────────────────────────
  switch (page) {
    case "products":  return <ProductsPage />;
    case "about":     return <AboutPage />;
    case "contact":   return <ContactPage />;
    case "track":     return <TrackPage />;
    case "favorites": return <FavoritesPage />;
    case "detail":    return <DetailPage />;
    case "cart":      return <CartPage />;
    case "checkout":  return <CheckoutPage />;
    case "map":       return <MapPage />;
    case "profile":   return <ProfilePage />;
    default:          return <HomePage />;
  }
};

export default AppRouter;