import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// On GitHub Pages the site is served from /<repo-name>/, so asset URLs need that prefix.
// In GitHub Actions the repo name comes from GITHUB_REPOSITORY ("owner/repo"); locally it stays "/".
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  base: process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});