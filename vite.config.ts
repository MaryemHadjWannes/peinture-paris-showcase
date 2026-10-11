import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Only the React runtime gets its own long-cached chunk. Everything else
        // follows the import graph, so libraries used by lazy sections (icons,
        // Radix, toasts…) are not downloaded before the first render.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run\/router|react-helmet-async)\//.test(id)) {
            return "vendor-react";
          }
        },
      },
    },
  },
}));
