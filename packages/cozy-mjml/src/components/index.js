const core = require('mjml-core')

const components = [
  require('./MJCozyTitle'),
]

components.forEach(component => {
  core.registerComponent(component)
})
