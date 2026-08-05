// ============================================================
// src/data/gouvernoratsStore.js
// Source unique de vérité pour les gouvernorats + points de vente.
// Persistance simple via localStorage (remplaçable plus tard par un appel API).
// ============================================================

const STORAGE_KEY = "cleano_gouvernorats_v1";

const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// ── Données initiales (reprises de MapPage.jsx) ──────────────
const DEFAULT_DATA = [
  { id: "tunis",      name: "Tunis",       points: [
    { id: uid(), ville: "Tunis Centre", adresse: "Avenue Habib Bourguiba, Tunis", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "La Marsa",     adresse: "Rue de la Corniche, La Marsa", tel: "(+216) 55 777 400" },
    { id: uid(), ville: "Bab El Bhar",  adresse: "Médina de Tunis",              tel: "(+216) 54 444 428" },
  ]},
  { id: "ariana",     name: "Ariana",      points: [
    { id: uid(), ville: "Ariana Ville", adresse: "Avenue de la République, Ariana", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Raoued",       adresse: "Route de Raoued",                 tel: "(+216) 55 777 400" },
  ]},
  { id: "benarous",   name: "Ben Arous",   points: [
    { id: uid(), ville: "Ben Arous",  adresse: "Route de Sousse km 5, Ben Arous", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Hammam Lif", adresse: "Rue Principale, Hammam Lif",      tel: "(+216) 55 777 400" },
  ]},
  { id: "manouba",    name: "Manouba",     points: [
    { id: uid(), ville: "Manouba", adresse: "Avenue Principale, Manouba", tel: "(+216) 54 444 428" },
  ]},
  { id: "nabeul",     name: "Nabeul",      points: [
    { id: uid(), ville: "Nabeul",    adresse: "Avenue Habib Bourguiba, Nabeul", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Hammamet",  adresse: "Zone Touristique, Hammamet",     tel: "(+216) 55 777 400" },
  ]},
  { id: "zaghouan",   name: "Zaghouan",    points: [
    { id: uid(), ville: "Zaghouan", adresse: "Rue de la Source, Zaghouan", tel: "(+216) 54 444 428" },
  ]},
  { id: "bizerte",    name: "Bizerte",     points: [
    { id: uid(), ville: "Bizerte Centre",     adresse: "Avenue Habib Bourguiba, Bizerte", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Menzel Bourguiba",   adresse: "Rue de la Liberté",               tel: "(+216) 55 777 400" },
  ]},
  { id: "beja",       name: "Béja",        points: [
    { id: uid(), ville: "Béja", adresse: "Avenue de l'Indépendance, Béja", tel: "(+216) 54 444 428" },
  ]},
  { id: "jendouba",   name: "Jendouba",    points: [
    { id: uid(), ville: "Jendouba", adresse: "Rue Habib Bourguiba, Jendouba", tel: "(+216) 54 444 428" },
  ]},
  { id: "lekef",      name: "Le Kef",      points: [
    { id: uid(), ville: "Le Kef", adresse: "Place de l'Indépendance, Le Kef", tel: "(+216) 54 444 428" },
  ]},
  { id: "siliana",    name: "Siliana",     points: [
    { id: uid(), ville: "Siliana", adresse: "Rue Principale, Siliana", tel: "(+216) 54 444 428" },
  ]},
  { id: "kairouan",   name: "Kairouan",    points: [
    { id: uid(), ville: "Kairouan", adresse: "Avenue de la République, Kairouan", tel: "(+216) 54 444 428" },
  ]},
  { id: "sousse",     name: "Sousse",      points: [
    { id: uid(), ville: "Hammam Sousse",     adresse: "Route de la Plage, 1er étage — 4011", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Sousse Centre",     adresse: "Avenue Habib Bourguiba, Sousse",       tel: "(+216) 55 777 400" },
    { id: uid(), ville: "Port El Kantaoui",  adresse: "Zone Hôtelière",                       tel: "(+216) 54 444 428" },
  ]},
  { id: "monastir",   name: "Monastir",    points: [
    { id: uid(), ville: "Monastir", adresse: "Avenue Habib Bourguiba, Monastir", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Skanes",   adresse: "Route de l'Aéroport, Skanes",      tel: "(+216) 55 777 400" },
  ]},
  { id: "mahdia",     name: "Mahdia",      points: [
    { id: uid(), ville: "Mahdia", adresse: "Médina de Mahdia",                  tel: "(+216) 54 444 428" },
    { id: uid(), ville: "El Jem", adresse: "Rue de l'Amphithéâtre, El Jem",     tel: "(+216) 55 777 400" },
  ]},
  { id: "sfax",       name: "Sfax",        points: [
    { id: uid(), ville: "Sfax Centre", adresse: "Avenue Hedi Chaker, Sfax", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Sfax Médina", adresse: "Médina de Sfax",           tel: "(+216) 55 777 400" },
  ]},
  { id: "kasserine",  name: "Kasserine",   points: [
    { id: uid(), ville: "Kasserine", adresse: "Rue Principale, Kasserine", tel: "(+216) 54 444 428" },
  ]},
  { id: "sididouzid", name: "Sidi Bouzid", points: [
    { id: uid(), ville: "Sidi Bouzid", adresse: "Avenue Farhat Hached, Sidi Bouzid", tel: "(+216) 54 444 428" },
  ]},
  { id: "gafsa",      name: "Gafsa",       points: [
    { id: uid(), ville: "Gafsa", adresse: "Avenue Habib Bourguiba, Gafsa", tel: "(+216) 54 444 428" },
  ]},
  { id: "tozeur",     name: "Tozeur",      points: [
    { id: uid(), ville: "Tozeur", adresse: "Avenue Aboul Kacem Chebbi, Tozeur", tel: "(+216) 54 444 428" },
  ]},
  { id: "kebili",     name: "Kébili",      points: [
    { id: uid(), ville: "Kébili", adresse: "Rue Principale, Kébili",  tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Douz",   adresse: "Porte du Sahara, Douz",   tel: "(+216) 55 777 400" },
  ]},
  { id: "gabes",      name: "Gabès",       points: [
    { id: uid(), ville: "Gabès",    adresse: "Avenue Habib Bourguiba, Gabès", tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Matmata",  adresse: "Route de Matmata",              tel: "(+216) 55 777 400" },
  ]},
  { id: "mednine",    name: "Médenine",    points: [
    { id: uid(), ville: "Médenine", adresse: "Rue de la République, Médenine",  tel: "(+216) 54 444 428" },
    { id: uid(), ville: "Djerba",   adresse: "Zone Touristique, Djerba",        tel: "(+216) 55 777 400" },
    { id: uid(), ville: "Zarzis",   adresse: "Avenue Principale, Zarzis",       tel: "(+216) 54 444 428" },
  ]},
  { id: "tataouine",  name: "Tataouine",   points: [
    { id: uid(), ville: "Tataouine", adresse: "Avenue Habib Bourguiba, Tataouine", tel: "(+216) 54 444 428" },
  ]},
];

// ── Lecture / écriture ────────────────────────────────────────
export function loadGouvernorats() {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
      return DEFAULT_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DATA;
  }
}

function persist(data) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  window.dispatchEvent(new Event("gouvernorats-updated"));
  return data;
}

export function saveGouvernorats(data) {
  return persist(data);
}

// ── CRUD gouvernorats ──────────────────────────────────────────
export function addGouvernorat(name) {
  const data = loadGouvernorats();
  const id = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || uid();
  if (data.some(g => g.id === id)) {
    return { error: "Ce gouvernorat existe déjà." };
  }
  const next = [...data, { id, name: name.trim(), points: [] }];
  persist(next);
  return { data: next };
}

export function renameGouvernorat(govId, newName) {
  const data = loadGouvernorats();
  const next = data.map(g => g.id === govId ? { ...g, name: newName.trim() } : g);
  persist(next);
  return next;
}

export function deleteGouvernorat(govId) {
  const data = loadGouvernorats();
  const next = data.filter(g => g.id !== govId);
  persist(next);
  return next;
}

// ── CRUD points de vente ────────────────────────────────────────
export function addPoint(govId, point) {
  const data = loadGouvernorats();
  const next = data.map(g => g.id === govId
    ? { ...g, points: [...g.points, { id: uid(), ...point }] }
    : g);
  persist(next);
  return next;
}

export function updatePoint(govId, pointId, patch) {
  const data = loadGouvernorats();
  const next = data.map(g => g.id !== govId ? g : {
    ...g,
    points: g.points.map(p => p.id === pointId ? { ...p, ...patch } : p),
  });
  persist(next);
  return next;
}

export function deletePoint(govId, pointId) {
  const data = loadGouvernorats();
  const next = data.map(g => g.id !== govId ? g : {
    ...g,
    points: g.points.filter(p => p.id !== pointId),
  });
  persist(next);
  return next;
}

// Déplace un point vers un autre gouvernorat (utile depuis la page Points de vente)
export function movePoint(fromGovId, pointId, toGovId) {
  const data = loadGouvernorats();
  let moved = null;
  const stripped = data.map(g => {
    if (g.id !== fromGovId) return g;
    const found = g.points.find(p => p.id === pointId);
    if (found) moved = found;
    return { ...g, points: g.points.filter(p => p.id !== pointId) };
  });
  if (!moved) return data;
  const next = stripped.map(g => g.id === toGovId ? { ...g, points: [...g.points, moved] } : g);
  persist(next);
  return next;
}