import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite-plus";
import { feedsPlugin } from "./vite.feeds";
import { keystaticServerPlugin } from "./vite.keystatic-server";

const keystaticPlugin = {
  name: "keystatic-content",
  async buildStart() {
    const { buildContent } = await import("./scripts/keystatic-content.mjs");
    await buildContent();
  },
  async configureServer(server: import("vite-plus").ViteDevServer) {
    const { buildContent } = await import("./scripts/keystatic-content.mjs");
    await buildContent();
    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleRebuild = (file: string) => {
      const rel = path.relative(server.config.root, file).split(path.sep).join("/");
      if (!rel.startsWith("content/posts") || rel.includes("covers/")) return;
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(async () => {
        try {
          await buildContent();
        } catch (e) {
          console.error("[keystatic-content] rebuild error:", e);
        }
      }, 200);
    };
    server.watcher.on("change", scheduleRebuild);
    server.watcher.on("add", scheduleRebuild);
    server.watcher.on("unlink", scheduleRebuild);
    server.watcher.add(".velite");
  },
};

export default defineConfig(({ isSsrBuild }) => {
  const commonPlugins = [
    // voidPlugin(),
    keystaticServerPlugin(),
    keystaticPlugin,
    feedsPlugin(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ];

  const resolve = {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@velite": path.resolve(import.meta.dirname, ".velite"),
    },
  };

  if (isSsrBuild) {
    return {
      plugins: commonPlugins,
      resolve,
      build: {
        ssr: "src/entry-server.tsx",
        outDir: "dist/server",
        target: "es2023",
      },
    };
  }

  return {
    plugins: commonPlugins,
    resolve,
    build: {
      outDir: "dist/client",
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, "index.html"),
        },
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
  };
});
