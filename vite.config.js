import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/tabs-pro/",
    plugins: [react()],
});
