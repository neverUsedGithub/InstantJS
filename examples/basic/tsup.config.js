import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [ "main.jsx" ],
  esbuildOptions(options, context) {
    options.jsxFactory = "Instant.createElement";
    options.jsxFragment = "Instant.Fragment";
  }
})