import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Use sensible defaults when env vars are not provided (helps CI / Vercel builds)
const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Default base path to root when not provided. In Replit or other
// environments a specific BASE_PATH may still be injected.
const basePath = process.env.BASE_PATH ?? "/";
if (!process.env.BASE_PATH) {
  // provide a non-fatal warning so local dev still informs the operator
  // while allowing automated builders (like Vercel) to proceed.
  // eslint-disable-next-line no-console
  console.warn('BASE_PATH not provided — defaulting to "/"');
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      "@workspace/api-client-react": path.resolve(import.meta.dirname, "..", "..", "lib", "api-client-react", "src"),
      "@workspace/api-zod": path.resolve(import.meta.dirname, "..", "..", "lib", "api-zod", "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: process.env.API_SERVER_URL ?? "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      allow: [path.resolve(import.meta.dirname, "..", "..")],
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('framer-motion') || id.includes('gsap')) return 'vendor-anim';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
