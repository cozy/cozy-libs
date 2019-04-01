const core = require('mjml-core')

const components = [require('./MJHeader'), require('./MJFooter')]

exports.register = () => {
  components.forEach(component => {
    core.registerComponent(component)
  })
}
