import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";

// https://astro.build/config

// https://astro.build/config

const today = new Date().toISOString().slice(0, 10);
export default defineConfig({
  output: "server",
  // Enable Lit to support LitHTML components and templates.
  integrations: [lit()],
});


