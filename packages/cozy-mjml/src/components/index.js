const core = require('mjml-core')

const components = [
  require('./MJDefaults'),
  require('./MJHeader'),
  require('./MJFooter')
]

exports.register = () => {
  components.forEach(component => {
    core.registerComponent(component)
  })
}
