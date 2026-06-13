import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: mode !== "production",
    rollupOptions: {
      output: {
        manualChunks: {
          // Convex runtime — rarely changes, long cache life
          "vendor-convex": ["convex"],
          // React ecosystem
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Radix UI / Shadcn component primitives
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-label",
            "@radix-ui/react-switch",
          ],
          // Heavy utilities
          "vendor-utils": ["date-fns", "lucide-react", "clsx", "tailwind-merge"],
        },
      },
    },
  },

  server: {
    host: "::",
    port: 3000,
  },

  preview: {
    host: "0.0.0.0",
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

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}));
