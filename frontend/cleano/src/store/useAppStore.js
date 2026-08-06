// src/store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, removeFromCart, updateQty } from "../models/Cart";

<<<<<<< HEAD
const PAGE_URLS = {
  home:              "/",
  products:          "/products",
  detail:            "/product",
  cart:              "/cart",
  checkout:          "/checkout",
  track:             "/track",
  favorites:         "/favorites",
  about:             "/about",
  contact:           "/contact",
  map:               "/map",
  profile:           "/profile",
  // Admin
  admin:             "/admin",
  "admin-produits":  "/admin/produits",
  "admin-stock":     "/admin/stock",
  "admin-clients":   "/admin/clients",
  "admin-commandes": "/admin/commandes",
  "admin-colis":     "/admin/colis",
  "admin-historique":"/admin/historique",
  "admin-stock-historique":"/admin/stock-historique"
=======
// Map page → URL
const PAGE_URLS = {
  home:      "/",
  products:  "/products",
  detail:    "/product",   // + /:id
  cart:      "/cart",
  checkout:  "/checkout",  // ✅ Assurez-vous que c'est bien présent
  track:     "/track",
  favorites: "/favorites",
  about:     "/about",
  contact:   "/contact",
>>>>>>> frontend
};

const URL_PAGES = {
<<<<<<< HEAD
  "/":                  "home",
  "/products":          "products",
  "/cart":              "cart",
  "/checkout":          "checkout",
  "/track":             "track",
  "/favorites":         "favorites",
  "/about":             "about",
  "/contact":           "contact",
  "/map":               "map",
  "/profile":           "profile",
  // Admin
  "/admin":             "admin",
  "/admin/produits":    "admin-produits",
  "/admin/stock":       "admin-stock",
  "/admin/clients":     "admin-clients",
  "/admin/commandes":   "admin-commandes",
  "/admin/colis":       "admin-colis",
  "/admin/historique":  "admin-historique",
=======
  "/":           "home",
  "/products":   "products",
  "/cart":       "cart",
  "/checkout":   "checkout",  // ✅ Ajoutez cette ligne
  "/track":      "track",
  "/favorites":  "favorites",
  "/about":      "about",
  "/contact":    "contact",
>>>>>>> frontend
};

const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Navigation ────────────────────────────────────────
      page: "home",
      selectedProductId: null,

<<<<<<< HEAD
      // ✅ "detail" ET "checkout" incluent maintenant l'ID produit dans l'URL,
      // ex: /product/12 ou /checkout/12
      navigate: (page, productId = null) => {
        set({ page, selectedProductId: productId });
        const url = PAGE_URLS[page] ?? "/";
        const needsId = (page === "detail" || page === "checkout") && productId;
        const fullUrl = needsId ? `${url}/${productId}` : url;
=======
      navigate: (page, productId = null) => {
        set({ page, selectedProductId: productId });
        // Change l'URL dans le navigateur
        const url = PAGE_URLS[page] ?? "/";
        const fullUrl = page === "detail" && productId ? `${url}/${productId}` : url;
>>>>>>> frontend
        window.history.pushState({}, "", fullUrl);
      },

      setPageFromUrl: (pathname) => {
<<<<<<< HEAD
=======
        // Gestion spéciale pour /product/:id
>>>>>>> frontend
        if (pathname.startsWith("/product/")) {
          const id = pathname.split("/")[2];
          set({ page: "detail", selectedProductId: id });
          return;
        }
<<<<<<< HEAD
        // ✅ Reconnaît /checkout/:id et restaure le produit sélectionné
        // (utile en cas de rafraîchissement de page ou d'accès direct au lien)
        if (pathname.startsWith("/checkout/")) {
          const id = pathname.split("/")[2];
          set({ page: "checkout", selectedProductId: id });
          return;
        }
=======
>>>>>>> frontend
        const page = URL_PAGES[pathname] ?? "home";
        set({ page });
      },

      // ── Auth ─────────────────────────────────────────────
      user: null,
      authModal: false,
      authTab: "login",
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      openAuthModal: (tab = "login") => set({ authModal: true, authTab: tab }),
      closeAuthModal: () => set({ authModal: false }),

      // ── Cart ─────────────────────────────────────────────
      cartItems: [],
      cartOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      addToCart: (product, qty = 1) =>
        set((s) => ({
          cartItems: addToCart(s.cartItems || [], product, qty)
        })),
      removeFromCart: (productId) =>
        set((s) => ({
          cartItems: removeFromCart(s.cartItems || [], productId)
        })),
      updateQty: (productId, qty) =>
        set((s) => ({
          cartItems: updateQty(s.cartItems || [], productId, qty)
        })),
      clearCart: () => set({ cartItems: [] }),

      // ── Favorites ────────────────────────────────────────
      favorites: [],
      toggleFavorite: (productId) =>
        set((s) => ({
          favorites: (s.favorites || []).includes(productId)
            ? (s.favorites || []).filter((id) => id !== productId)
            : [...(s.favorites || []), productId],
        })),

      // ── Tracking ─────────────────────────────────────────
      trackingNumber: null,
      setTrackingNumber: (num) => set({ trackingNumber: num }),

      // ── Notifications ──────────────────────────────────────
      notifications: [],
      addNotification: (notif) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        set((s) => ({
          notifications: [
            { id, read: false, createdAt: new Date().toISOString(), ...notif },
            ...(s.notifications || []),
          ].slice(0, 50), // on garde les 50 dernières notifications
        }));
        return id;
      },
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: (s.notifications || []).map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: (s.notifications || []).map((n) => ({ ...n, read: true })),
        })),
      removeNotification: (id) =>
        set((s) => ({
          notifications: (s.notifications || []).filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // ── Toasts ───────────────────────────────────────────
      toasts: [],
      addToast: (message, type = "success") => {
        const id = Date.now();
        set((s) => ({ toasts: [...(s.toasts || []), { id, message, type }] }));
        setTimeout(() => {
          set((s) => ({ toasts: (s.toasts || []).filter((t) => t.id !== id) }));
        }, 3000);
      },
      removeToast: (id) =>
        set((s) => ({ toasts: (s.toasts || []).filter((t) => t.id !== id) })),
    }),
    {
      name: "cleano-store",
      partialize: (state) => ({
        cartItems:     state.cartItems || [],
        favorites:     state.favorites || [],
        user:          state.user || null,
        notifications: state.notifications || [],
      }),
    }
  )
);

<<<<<<< HEAD
// ✅ Add selectors to prevent unnecessary re-renders
export const useCartItems = () => useAppStore((state) => state.cartItems || []);
export const useFavorites = () => useAppStore((state) => state.favorites || []);
export const useUser = () => useAppStore((state) => state.user);
export const useNotifications = () => useAppStore((state) => state.notifications || []);
export const useUnreadNotifications = () => {
  const notifications = useAppStore((state) => state.notifications || []);
  return notifications.filter((n) => !n.read).length;
};
export const useCartTotal = () => {
  const cartItems = useAppStore((state) => state.cartItems || []);
  return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
};

=======
>>>>>>> frontend
export default useAppStore;