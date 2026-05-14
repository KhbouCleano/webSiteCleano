// ============================================================
// src/controllers/useAuthController.js
// ============================================================

import { useState } from "react";
import useAppStore from "../store/useAppStore";
import { mockLogin, mockRegister } from "../models/User";

export const useAuthController = () => {
  const user          = useAppStore((s) => s.user);
  const authModal     = useAppStore((s) => s.authModal);
  const authTab       = useAppStore((s) => s.authTab);
  const setUser       = useAppStore((s) => s.setUser);
  const logout        = useAppStore((s) => s.logout);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const closeAuthModal= useAppStore((s) => s.closeAuthModal);
  const addToast      = useAppStore((s) => s.addToast);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const loggedUser = await mockLogin(email, password);
      setUser(loggedUser);
      closeAuthModal();
      addToast(`Bienvenue, ${loggedUser.name} ! 👋`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email, password, name) => {
    setLoading(true);
    setError("");
    try {
      const newUser = await mockRegister(email, password, name);
      setUser(newUser);
      closeAuthModal();
      addToast(`Compte créé avec succès ! Bienvenue ${newUser.name} 🎉`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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
