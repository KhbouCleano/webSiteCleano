// vite.config.js  — à la racine du projet frontend
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // accessible depuis le réseau local
    port: 5173,
    proxy: {
      // Toutes les requêtes /api/* sont redirigées vers le backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});