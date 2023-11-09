import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";

const remarkDiceJS = () => (tree, file) => {
  console.log(tree);
}

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        'src/*': './src/*'
      }
    }
  },
  output: "server",
  adapter: cloudflare(),
  markdown: {
    remarkPlugins: [remarkDiceJS]
  }
});