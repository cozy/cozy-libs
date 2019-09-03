module.exports = {
  presets: [
    [
      'cozy-app',
      { presetEnv: { modules: false }, transformRuntime: { helpers: true } }
    ]
  ],
  plugins: ['inline-react-svg'],
  env: {
    test: {
      presets: [['cozy-app', { transformRuntime: { helpers: true } }]]
    }
  }
}
