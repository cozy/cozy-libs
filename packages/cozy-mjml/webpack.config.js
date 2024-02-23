const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

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
      })
    ]
  },
  /**
   * Needed in order to be able to build cozy-mjml on Mac OS.
   * cozy-mjml `require(mjml)` and mjml use fsevents > node-pre-gyp.
   * See this comment for more information : https://github.com/mapbox/node-pre-gyp/issues/238#issuecomment-267889753
   *
   * We simply tell webpack that fsevents should be required at runtime and not during the build
   */
  externals: {
    fsevents: 'fsevents'
  },
  module: {
    rules: [{ test: /node_modules\/datauri\/index.js$/, use: 'shebang-loader' }]
  },
  plugins: [
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
