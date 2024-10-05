import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "lifecycle-server": path.resolve(__dirname, "../server/src"),
    },
  },
});
