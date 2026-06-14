import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite-plus";

const velitePlugin = {
  name: "velite",
  async buildStart() {
    const { build } = await import("velite");
    await build({ clean: true });
  },
  async configureServer(server: import("vite-plus").ViteDevServer) {
    const { build } = await import("velite");
    await build({ watch: true, clean: false });
    server.watcher.add(".velite");
  },
};

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    velitePlugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@velite": path.resolve(import.meta.dirname, ".velite"),
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
