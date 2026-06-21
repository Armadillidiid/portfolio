import path from "path";
import { build as veliteBuild } from "velite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite-plus";
import { gtmInjectPlugin } from "./vite.gtm";
import { feedsPlugin } from "./vite.feeds";
import { voidPlugin } from "void";

const velitePlugin = {
  name: "velite",
  async buildStart() {
    await veliteBuild({ clean: false });
  },
  async configureServer(server: import("vite-plus").ViteDevServer) {
    await veliteBuild({ watch: true, clean: false });
    server.watcher.add(".velite");
  },
};

export default defineConfig({
  plugins: [
    voidPlugin(),
    velitePlugin,
    gtmInjectPlugin(),
    feedsPlugin(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
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
