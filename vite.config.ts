import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          menu: path.resolve(__dirname, 'menu.html'),
          story: path.resolve(__dirname, 'story.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          reservations: path.resolve(__dirname, 'reservations.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          privacy: path.resolve(__dirname, 'privacy.html'),
          cookies: path.resolve(__dirname, 'cookies.html'),
          refunds: path.resolve(__dirname, 'refunds.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          accessibility: path.resolve(__dirname, 'accessibility.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
