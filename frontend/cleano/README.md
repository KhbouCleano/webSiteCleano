# 🧼 Cleano — Application React MVC

> Application e-commerce de produits de nettoyage premium, reconstruite avec une architecture **MVC propre et modulaire**.

---

## 🏗️ Architecture MVC

```
src/
│
├── models/                      # M — Entités & logique métier pure
│   ├── Product.js               # Données produits + helpers (findById, filter, search)
│   ├── Category.js              # Données catégories
│   ├── Cart.js                  # Logique panier (add / remove / update / totaux)
│   ├── Order.js                 # Entité commande & suivi
│   └── User.js                  # Entité utilisateur, validation, mock auth
│
├── store/                       # État global (Zustand)
│   └── useAppStore.js           # Source unique de vérité
│
├── controllers/                 # C — Hooks custom (logique + état local)
│   ├── useCartController.js
│   ├── useAuthController.js
│   ├── useProductsController.js
│   └── useFavoritesController.js
│
├── views/                       # V — Composants React purs
│   ├── pages/                   # 9 pages
│   └── components/              # shared / auth / cart
│
├── router/
│   └── AppRouter.jsx            # Table de routage centralisée
│
├── styles/
│   └── global.css               # Design tokens CSS + base
│
├── App.jsx                      # Shell layout
└── main.jsx                     # Point d'entrée React
```

## 🚀 Démarrage

```bash
npm install
npm run dev
```

## 🛠️ Stack

- React 18 + Vite
- Zustand (état global + persistence)
- CSS Variables (design tokens)
