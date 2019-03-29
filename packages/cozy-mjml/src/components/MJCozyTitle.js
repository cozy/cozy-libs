const validator = require('mjml-validator')
const core = require('mjml-core')

validator.registerDependencies({
  'mj-body': ['mj-cozy-title'],
  'mj-cozy-title': []
})

class MJCozyTitle extends core.BodyComponent {
  render() {
    return this.renderMJML(
      `<mj-text mj-class="title content">${this.getContent()}</mj-text>`
    )
  }
}

module.exports = MJCozyTitle
