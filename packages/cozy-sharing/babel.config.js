module.exports = {
  presets: [
    [
      'cozy-app',
      { presetEnv: { modules: false }, transformRuntime: { helpers: true } }
    ]
  ],
  plugins: [
    [
      'css-modules-transform',
      {
        extensions: ['.styl'],
        preprocessCss: './preprocess',
        extractCss: './dist/stylesheet.css',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    ]
  ],
  env: {
    test: {
      presets: [['cozy-app', { transformRuntime: { helpers: true } }]]
    }
  }
}
