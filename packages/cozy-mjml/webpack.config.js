const path = require('path')
const webpack = require('webpack')

module.exports = {
  bail: true,
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false
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
