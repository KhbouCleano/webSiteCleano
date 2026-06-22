// ============================================================
// src/store/useAppStore.js — Global Zustand store (v5)
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, removeFromCart, updateQty } from "../models/Cart";

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
};

// Map URL → page (pour le sync retour navigateur)
const URL_PAGES = {
  "/":           "home",
  "/products":   "products",
  "/cart":       "cart",
  "/checkout":   "checkout",  // ✅ Ajoutez cette ligne
  "/track":      "track",
  "/favorites":  "favorites",
  "/about":      "about",
  "/contact":    "contact",
};

const useAppStore = create(
  persist(
    (set) => ({
      // ── Navigation ────────────────────────────────────────
      page: "home",
      selectedProductId: null,

      navigate: (page, productId = null) => {
        set({ page, selectedProductId: productId });
        // Change l'URL dans le navigateur
        const url = PAGE_URLS[page] ?? "/";
        const fullUrl = page === "detail" && productId ? `${url}/${productId}` : url;
        window.history.pushState({}, "", fullUrl);
      },

      setPageFromUrl: (pathname) => {
        // Gestion spéciale pour /product/:id
        if (pathname.startsWith("/product/")) {
          const id = pathname.split("/")[2];
          set({ page: "detail", selectedProductId: id });
          return;
        }
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
        set((s) => ({ cartItems: addToCart(s.cartItems, product, qty) })),
      removeFromCart: (productId) =>
        set((s) => ({ cartItems: removeFromCart(s.cartItems, productId) })),
      updateQty: (productId, qty) =>
        set((s) => ({ cartItems: updateQty(s.cartItems, productId, qty) })),
      clearCart: () => set({ cartItems: [] }),

      // ── Favorites ────────────────────────────────────────
      favorites: [],
      toggleFavorite: (productId) =>
        set((s) => ({
          favorites: s.favorites.includes(productId)
            ? s.favorites.filter((id) => id !== productId)
            : [...s.favorites, productId],
        })),

      // ── Toasts ───────────────────────────────────────────
      toasts: [],
      addToast: (message, type = "success") => {
        const id = Date.now();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3000);
      },
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "cleano-store",
      partialize: (state) => ({
        cartItems: state.cartItems,
        favorites: state.favorites,
        user: state.user,
      }),
    }
  )
);

export default useAppStore;