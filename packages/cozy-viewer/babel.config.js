module.exports = {
  presets: ['cozy-app'],
  env: {
    transpilation: {
      ignore: ['**/*.spec.jsx', '**/*.spec.js', '**/*.spec.tsx', '**/*.spec.ts']
    }
  },
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
    ],
    ['inline-json-import', {}]
  ],
  ignore: ['examples/**/*', '**/*.md', '**/*.styl', '**/*.json', '**/*.snap']
}
