module.exports = {
  presets: ['cozy-app'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src']
      }
    ],
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
    ],
    [
      'inline-react-svg',
      {
        svgo: {
          plugins: [
            {
              cleanupIDs: {
                minify: false
              }
            }
          ]
        }
      }
    ],
    ['inline-json-import', {}]
  ]
}
