import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api":
        process.env.NODE_ENV === "development"
          ? "http://localhost:4000"
          : "https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev",
    },
    hmr: process.env.NODE_ENV === "development" ? {} : false, // Disable WebSockets in production
  },
});