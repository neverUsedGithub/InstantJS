import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [ "src/*" ],
  dts: true,
  bundle: false,
  target: "esnext"
})