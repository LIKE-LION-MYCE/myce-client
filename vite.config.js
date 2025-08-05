import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: baseURL,
        changeOrigin: true,
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
});
