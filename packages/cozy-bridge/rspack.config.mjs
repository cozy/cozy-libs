import { defineConfig } from '@rspack/cli'

export default defineConfig({
  entry: {
    main: './dist/embedded/index.js'
  },
  output: {
    filename: './embedded/bundle.js'
  }
})
