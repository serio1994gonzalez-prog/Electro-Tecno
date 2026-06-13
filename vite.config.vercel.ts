// ============================================================================
// VERCEL-ONLY BUILD CONFIG — do NOT use in Lovable
// ============================================================================
// Lovable usa `vite.config.ts` (con @lovable.dev/vite-tanstack-config).
// Este archivo es SOLO para el build de Vercel desde GitHub.
//
// Uso:
//   npm run build:vercel
//   (equivale a: vite build --config vite.config.vercel.ts)
//
// Output: `.vercel/output/` (Vercel Build Output API v3) — Vercel lo detecta
// automáticamente, no requiere adaptador adicional.
// ============================================================================
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
      // Wrapper SSR de errores (src/server.ts)
      server: { entry: "server" },
    }),
    viteReact(),
    // Nitro empaqueta el build SSR con preset Vercel → emite `.vercel/output/`
    nitro({ preset: "vercel" }),
  ],
});
