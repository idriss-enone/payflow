import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

// 1. Remplacement moderne de __dirname pour les environnements ESM (Vite standard)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration Vite de l'application PayFlow
 * Intègre Tailwind CSS v4 et configure l'alias sécurisé '@' vers le dossier 'src'
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // 2. Utilisation de l'alias pour simplifier les futures importations inter-modules
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true // Ouvre automatiquement le navigateur au démarrage
  }
});
