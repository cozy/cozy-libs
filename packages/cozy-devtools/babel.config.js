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
  ignore: ['examples/**/*', '**/*.md', '**/*.snap']
}
