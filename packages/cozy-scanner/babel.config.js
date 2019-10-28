module.exports = {
  presets: ['cozy-app'],
  ignore: ['*.spec.js', '*.spec.jsx'],
  env: {
    transpilation: {
      presets: [['cozy-app', { lib: true }]],
      plugins: [
        [
          'css-modules-transform',
          {
            extractCss: './dist/stylesheet.css',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
            keepImport: true
          }
        ]
      ]
    }
  }
}
