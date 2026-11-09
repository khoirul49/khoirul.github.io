import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Situs di-deploy di domain sendiri (alvalens.my.id), jadi base-nya "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
