const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  bail: true,
  target: 'node',
  node: {
    __dirname: false
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          // XXX some lines are silently not output by mjml when function names
          // are mangled!
          keep_fnames: true,
          compress: false
        }
      }),
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/datauri\/index.js$/,
      path.resolve('./src/hacks/datauri-index.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/uglify-js\/tools\/node.js$/,
      path.resolve('./src/hacks/uglify-node.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/mimer\/lib\/data\/parser.js$/,
      path.resolve('./src/hacks/mimer-parser.js')
    ),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
  ]
}
