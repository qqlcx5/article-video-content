import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "../src")
    }
  },
  server: {
    strictPort: true,
    fs: {
      allow: [path.resolve(__dirname, "..")]
    }
  }
});

