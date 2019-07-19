module.exports = {
  env: {
    transpilation: {
      presets: [
        [
          'cozy-app',
          { lib: true }
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
      ]
    },
    test: {
      presets: ['cozy-app']
    }
  },
  ignore: ['*.spec.js', '*.spec.jsx']
}
