// This file replaces node_modules/uglify-js/tools/node.js, as its calls to
// require.resolve doesn't play nicely with webpack.

exports.minify = function (code) {
  return { error: 'no minify' }
}
