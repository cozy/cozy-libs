const stylus = require('stylus')
const cozyStylusPlugin = require('cozy-ui/stylus')

const renderStylus = function(css, filename) {
  try {
    return stylus(css)
      .use(cozyStylusPlugin())
      .set('filename', filename)
      .render()
  } catch (e) {
    console.log(e) // eslint-disable-line no-console
  }
}

module.exports = renderStylus
