import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import netlify from '@astrojs/netlify/functions';


// https://astro.build/config

// https://astro.build/config

const today = new Date().toISOString().slice(0, 10);
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [lit()],
});


