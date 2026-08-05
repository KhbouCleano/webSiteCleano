// src/controllers/useAuthController.js
// Patch : après login, redirige vers /admin si rôle = 'admin'

import { useState } from "react";
import useAppStore  from "../store/useAppStore";

export const useAuthController = () => {
  const { closeAuthModal, setUser, navigate, addToast } = useAppStore();
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

      // Stocker le token JWT
      if (data.token) localStorage.setItem("token", data.token);

      // Enregistrer l'utilisateur dans le store (avec son rôle)
      setUser(data.user);
      closeAuthModal();

      // ✅ Redirection selon le rôle
      if (data.user.role === "admin") {
        addToast(`Bienvenue Admin ${data.user.name} 👑`);
        navigate("admin");           // → ouvre le dashboard admin
      } else {
        addToast(`Bienvenue ${data.user.name} !`);
        // reste sur la page courante pour les clients
      }
    } catch (err) {
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
      setUser(data.user);   // rôle toujours 'client' à l'inscription
      closeAuthModal();
      addToast(`Compte créé ! Bienvenue ${data.user.name} 🎉`);
    } catch (err) {
      setError("Impossible de joindre le serveur.");
    }
    setLoading(false);
  };

  return { handleLogin, handleRegister, loading, error, setError };
};