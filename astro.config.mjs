import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "src/*": "./src/*",
      },
    },
  },
  output: "server",
  adapter: cloudflare({
    mode: 'directory'
  }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  },
});
