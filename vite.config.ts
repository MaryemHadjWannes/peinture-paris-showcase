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
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes("react-helmet-async")) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("framer-motion") || id.includes("recharts") || id.includes("sonner")) {
              return "vendor-ui";
            }
            return "vendor";
          }
        },
      },
    },
  },
}));
