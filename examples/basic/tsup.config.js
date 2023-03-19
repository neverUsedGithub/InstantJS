import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [ "main.jsx" ],
  esbuildOptions(options, context) {
    options.jsxFactory = "Framework.createElement";
    options.jsxFragment = "Framework.Fragment";
  }
})