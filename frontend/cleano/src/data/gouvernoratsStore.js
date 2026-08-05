// src/data/gouvernoratsStore.js
//
// Petit "store" persistant (localStorage) pour gérer les gouvernorats
// et leurs points de vente. Utilisé par :
//   - src/admin/pages/AdminGouvernorats.jsx
//   - src/admin/pages/AdminPointsVente.jsx
//
// Chaque écriture déclenche un CustomEvent "gouvernorats-updated" sur window,
// que les deux pages écoutent pour se resynchroniser automatiquement.

const STORAGE_KEY = "cleano_gouvernorats";

// ── Données par défaut (premier lancement) ─────────────────────
const DEFAULT_DATA = [
  {
    id: "gov-tunis",
    name: "Tunis",
    points: [
      { id: "pt-1", ville: "Tunis Centre", adresse: "Avenue Habib Bourguiba", tel: "(+216) 71 000 000" },
    ],
  },
  {
    id: "gov-ariana",
    name: "Ariana",
    points: [],
  },
  {
    id: "gov-sousse",
    name: "Sousse",
    points: [],
  },
];

// ── Utils ───────────────────────────────────────────────────────
const generateId = () =>
  `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const notifyUpdated = () => {
  window.dispatchEvent(new CustomEvent("gouvernorats-updated"));
};

const readRaw = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeRaw = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage indisponible (mode privé, quota, etc.) — on ignore silencieusement
  }
  notifyUpdated();
  return data;
};

// ── API : Gouvernorats ────────────────────────────────────────

/** Charge la liste des gouvernorats (initialise avec des valeurs par défaut si vide). */
export function loadGouvernorats() {
  const existing = readRaw();
  if (existing) return existing;
  writeRaw(DEFAULT_DATA);
  return DEFAULT_DATA;
}

/** Ajoute un nouveau gouvernorat. Retourne { data } ou { error }. */
export function addGouvernorat(name) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { error: "Le nom est obligatoire." };

  const current = loadGouvernorats();
  const exists = current.some(
    (g) => g.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (exists) return { error: "Ce gouvernorat existe déjà." };

  const updated = [...current, { id: generateId(), name: trimmed, points: [] }];
  return { data: writeRaw(updated) };
}

/** Renomme un gouvernorat existant. Retourne la liste mise à jour. */
export function renameGouvernorat(id, newName) {
  const trimmed = (newName ?? "").trim();
  const current = loadGouvernorats();
  if (!trimmed) return current;

  const updated = current.map((g) =>
    g.id === id ? { ...g, name: trimmed } : g
  );
  return writeRaw(updated);
}

/** Supprime un gouvernorat (et ses points de vente). Retourne la liste mise à jour. */
export function deleteGouvernorat(id) {
  const current = loadGouvernorats();
  const updated = current.filter((g) => g.id !== id);
  return writeRaw(updated);
}

// ── API : Points de vente ────────────────────────────────────

/** Ajoute un point de vente à un gouvernorat donné. Retourne la liste mise à jour. */
export function addPoint(govId, payload) {
  const current = loadGouvernorats();
  const updated = current.map((g) =>
    g.id === govId
      ? { ...g, points: [...g.points, { id: generateId(), ...payload }] }
      : g
  );
  return writeRaw(updated);
}

/** Met à jour un point de vente existant. Retourne la liste mise à jour. */
export function updatePoint(govId, pointId, payload) {
  const current = loadGouvernorats();
  const updated = current.map((g) =>
    g.id === govId
      ? {
          ...g,
          points: g.points.map((p) =>
            p.id === pointId ? { ...p, ...payload } : p
          ),
        }
      : g
  );
  return writeRaw(updated);
}

/** Supprime un point de vente. Retourne la liste mise à jour. */
export function deletePoint(govId, pointId) {
  const current = loadGouvernorats();
  const updated = current.map((g) =>
    g.id === govId
      ? { ...g, points: g.points.filter((p) => p.id !== pointId) }
      : g
  );
  return writeRaw(updated);
}
