const core = require('mjml-core')

const components = [require('./MJCozyTitle')]

exports.register = () => {
  components.forEach(component => {
    core.registerComponent(component)
  })
}
