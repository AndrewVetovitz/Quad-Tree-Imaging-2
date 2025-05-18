import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";

export default defineConfig({
  plugins: [vike(), react({}), tailwindcss()],
  base: "/static/quad-tree/",
  build: {
    target: "esnext",
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
