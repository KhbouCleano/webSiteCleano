// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import useAppStore from "./store/useAppStore";

// ── Restaurer la page depuis l'URL au chargement ──────────────
const pathname = window.location.pathname;
useAppStore.getState().setPageFromUrl(pathname);

// ── Gérer le bouton Précédent/Suivant du navigateur ───────────
window.addEventListener("popstate", () => {
  useAppStore.getState().setPageFromUrl(window.location.pathname);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);