// src/App.jsx
import "./styles/global.css";
import AppRouter      from "./router/AppRouter";
import Header         from "./views/components/shared/Header";
import Footer         from "./views/components/shared/Footer";
import AuthModal      from "./views/components/auth/AuthModal";
import CartDrawer     from "./views/components/cart/CartDrawer";
import ToastContainer from "./views/components/shared/Toast";
import useAppStore    from "./store/useAppStore";

const ADMIN_PAGES = [
  "admin", "admin-produits", "admin-stock", "admin-stock-historique",
  "admin-gouvernorats", "admin-points-vente",
  "admin-clients", "admin-commandes", "admin-colis", "admin-historique",
];

function App() {
  const page = useAppStore((s) => s.page);

  const isAdmin    = ADMIN_PAGES.includes(page);
  const needsOffset = !isAdmin && page !== "home";

  // ── Pages admin : rendu isolé, sans Header/Footer/CartDrawer ──
  if (isAdmin) {
    return (
      <>
        <AppRouter />
        <ToastContainer />
      </>
    );
  }

  // ── Pages publiques : layout normal ──────────────────────────
  return (
    <>
      <Header />
      <main style={{ paddingTop: needsOffset ? "var(--header-h)" : 0 }}>
        <AppRouter />
      </main>
      <Footer />
      <AuthModal />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

export default App;