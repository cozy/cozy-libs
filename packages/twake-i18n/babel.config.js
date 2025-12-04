module.exports = {
  presets: ['cozy-app'],
  env: {
    transpilation: {
      ignore: ['**/*.spec.jsx', '**/*.spec.js', '**/*.spec.tsx', '**/*.spec.ts']
    },
    test: {
      presets: [['cozy-app', { transformRuntime: { helpers: true } }]]
    }
  },
  plugins: [['inline-json-import', {}]],
  ignore: ['examples/**/*', '**/*.md', '**/*.styl', '**/*.json', '**/*.snap']
}
