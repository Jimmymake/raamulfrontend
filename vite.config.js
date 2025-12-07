// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow access from network
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: ['edc8d759c392.ngrok-free.app', 'localhost','127.0.0.1',],
    proxy: {
      '/api': {
        target: 'https://vault.impalapay.com',
        changeOrigin: true
      }
    }
  }
});
