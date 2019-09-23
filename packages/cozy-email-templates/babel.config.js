module.exports = {
  presets: [
    [
      'cozy-app',
      { presetEnv: { modules: false }, transformRuntime: { helpers: true } }
    ]
  ],
  plugins: [
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.hbs', '.css']
      }
    ]
  ],
  env: {
    test: {
      presets: [['cozy-app', { transformRuntime: { helpers: true } }]]
    }
  }
}
