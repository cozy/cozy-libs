import webpack from 'webpack'
import path from 'path'

export default {
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },
  optimization: {
    minimize: false
  },
  module: {
    // mjml-core/lib/helpers/mjmlconfig and encoding/lib/iconv-loader use
    // expressions inside require. We do not need the functionality provided
    // by the dynamic require
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/uglify-js\/tools\/node.js$/,
      path.join(__dirname, './uglify-node.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/mimer\/lib\/data\/parser.js$/,
      path.join('./src/hacks/mimer-parser.js')
    )
  ]
}
