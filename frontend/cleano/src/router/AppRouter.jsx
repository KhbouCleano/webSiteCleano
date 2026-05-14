// src/router/AppRouter.jsx
import useAppStore from "../store/useAppStore";
import HomePage       from "../views/pages/HomePage";
import ProductsPage   from "../views/pages/ProductsPage";
import AboutPage      from "../views/pages/AboutPage";
import ContactPage    from "../views/pages/ContactPage";
import TrackPage      from "../views/pages/TrackPage";
import FavoritesPage  from "../views/pages/FavoritesPage";
import DetailPage     from "../views/pages/DetailPage";
import CartPage       from "../views/pages/CartPage";
import CheckoutPage   from "../views/pages/CheckoutPage";

const AppRouter = () => {
  const page = useAppStore((s) => s.page);

  switch (page) {
    case "products":  return <ProductsPage />;
    case "about":     return <AboutPage />;
    case "contact":   return <ContactPage />;
    case "track":     return <TrackPage />;
    case "favorites": return <FavoritesPage />;
    case "detail":    return <DetailPage />;
    case "cart":      return <CartPage />;
    case "checkout":  return <CheckoutPage />;
    default:          return <HomePage />;
  }
};

export default AppRouter;