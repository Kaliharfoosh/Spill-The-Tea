import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite runs with frontend/ as its root (see the scripts in the root package.json),
// so the build lands in frontend/dist, which vercel.json serves.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3001' },
  },
});
