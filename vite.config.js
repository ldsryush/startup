import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000', // Proxy API calls to the backend
    },
  },
});
