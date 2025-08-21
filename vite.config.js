import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window'  // SockJS 때문에 넣은 global 변수 
  },
  build: {
    outDir: 'dist',
    // Bundle optimization for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          websocket: ['@stomp/stompjs', 'sockjs-client'],
          utils: ['axios', 'jwt-decode'],
          ui: ['react-icons', 'react-pro-sidebar', 'react-daum-postcode', 'xlsx-js-style'],
        },
      },
    },
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning threshold
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
