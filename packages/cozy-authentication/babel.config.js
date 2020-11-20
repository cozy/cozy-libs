module.exports = {
  env: {
    transpilation: {
      presets: [['cozy-app', { lib: true }]]
    },
    test: {
      presets: ['cozy-app']
    }
  },
  ignore: ['*.spec.js', '*.spec.jsx']
}
