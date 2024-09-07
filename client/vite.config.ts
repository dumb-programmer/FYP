import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '/home/asadk/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '/home/asadk/localhost.pem')),
    },
    // Make sure the server is accessible over the local network
    host: '0.0.0.0',
  },
});
