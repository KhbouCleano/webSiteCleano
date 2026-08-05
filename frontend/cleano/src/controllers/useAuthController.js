// src/controllers/useAuthController.js
import { useState } from "react";
import useAppStore from "../store/useAppStore";

export const useAuthController = () => {
  const user           = useAppStore((s) => s.user);
  const authModal      = useAppStore((s) => s.authModal);
  const authTab        = useAppStore((s) => s.authTab);
  const setUser        = useAppStore((s) => s.setUser);
  const logout         = useAppStore((s) => s.logout);
  const openAuthModal  = useAppStore((s) => s.openAuthModal);
  const closeAuthModal = useAppStore((s) => s.closeAuthModal);
  const addToast       = useAppStore((s) => s.addToast);
  const navigate       = useAppStore((s) => s.navigate);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // ── LOGIN ──────────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Identifiants incorrects.");
        setLoading(false);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      setUser(data.user);
      closeAuthModal();

      // Admin → dashboard, client → reste sur la page courante
      if (data.user.role === "admin") {
        addToast(`Bienvenue Admin ${data.user.name} 👑`, "success");
        navigate("admin");
      } else {
        addToast(`Bienvenue, ${data.user.name} ! 👋`, "success");
      }
    } catch (_) {
      setError("Impossible de joindre le serveur.");
    }
    setLoading(false);
  };

  // ── REGISTER ───────────────────────────────────────────────
  const handleRegister = async (email, password, name) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      setUser(data.user);
      closeAuthModal();
      addToast(`Compte créé avec succès ! Bienvenue ${data.user.name} 🎉`, "success");
    } catch (_) {
      setError("Impossible de joindre le serveur.");
    }
    setLoading(false);
  };

  // ── LOGOUT ─────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    addToast("Déconnexion réussie", "info");
  };

  return {
    user,
    authModal,
    authTab,
    loading,
    error,
    setError,
    openAuthModal,
    closeAuthModal,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};