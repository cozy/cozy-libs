const Document = require('./Document')

class Application extends Document {}

Application.schema = {
  doctype: 'io.cozy.apps',
  attributes: {}
}

module.exports = Application
