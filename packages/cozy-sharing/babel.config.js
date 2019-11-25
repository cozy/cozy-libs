module.exports = {
  presets: [
    [
      'cozy-app',
      { presetEnv: { modules: false }, transformRuntime: { helpers: true } }
    ]
  ],
  env: {
    test: {
      presets: [['cozy-app', { transformRuntime: { helpers: true } }]]
    }
  }
}
