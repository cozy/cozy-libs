module.exports = {
  presets: ['cozy-app'],
  ignore: ['*.spec.js'],
  plugins: [
    [
      'import-redirect',
      {
        root: './src',
        redirect: {
          './dev-format': './prod-format'
        }
      }
    ]
  ]
}
