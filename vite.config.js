import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // TAMBAHKAN BLOK INI
  server: {
    proxy: {
      // Teruskan request dari /api ke server json-server Anda
      "/api": {
        target: "http://localhost:3001", // Sesuaikan port jika berbeda
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
