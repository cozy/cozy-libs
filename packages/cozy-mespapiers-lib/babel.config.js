module.exports = {
  presets: ['cozy-app'],
  plugins: [
    [
      'css-modules-transform',
      {
        extensions: ['.styl'],
        preprocessCss: './preprocess',
        extractCss: './dist/stylesheet.css',
        generateScopedName:
          process.env['NODE_ENV'] == 'test'
            ? '[local]'
            : '[name]__[local]___[hash:base64:5]'
      }
    ]
  ]
}
