// ============================================================
// src/models/User.js — User entity & auth helpers
// ============================================================

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} name
 */

/** Validate email format */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Validate password strength */
export const isValidPassword = (password) => password.length >= 6;

/** Mock login — replace with real API call */
export const mockLogin = async (email, password) => {
  await new Promise((r) => setTimeout(r, 800)); // simulate network
  if (!isValidEmail(email)) throw new Error("Email invalide");
  if (!isValidPassword(password)) throw new Error("Mot de passe trop court");
  return { email, name: email.split("@")[0] };
};

/** Mock register */
export const mockRegister = async (email, password, name) => {
  await new Promise((r) => setTimeout(r, 800));
  if (!isValidEmail(email)) throw new Error("Email invalide");
  if (!isValidPassword(password)) throw new Error("Mot de passe trop court (min. 6 caractères)");
  if (!name || name.trim() === "") throw new Error("Nom requis");
  return { email, name };
};
