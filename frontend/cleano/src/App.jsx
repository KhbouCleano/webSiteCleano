// ============================================================
// src/App.jsx — Root component
// La navbar est fixed/floating → pas de margin-top global.
// La HomePage gère son propre padding-top pour le hero.
// Les autres pages ont un padding-top via .page-padded.
// ============================================================
import "./styles/global.css";
import AppRouter      from "./router/AppRouter";
import Header         from "./views/components/shared/Header";
import Footer         from "./views/components/shared/Footer";
import AuthModal      from "./views/components/auth/AuthModal";
import CartDrawer     from "./views/components/cart/CartDrawer";
import ToastContainer from "./views/components/shared/Toast";
import useAppStore    from "./store/useAppStore";

function App() {
  const page = useAppStore((s) => s.page);
  // La home a son propre hero qui gère le padding (minHeight 100vh + paddingTop 96px)
  // Les autres pages ont besoin d'un padding-top pour la navbar fixe
  const needsOffset = page !== "home";

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
