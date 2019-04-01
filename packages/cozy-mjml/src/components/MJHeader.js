const validator = require('mjml-validator')
const core = require('mjml-core')

validator.registerDependencies({
  'mj-body': ['mj-header'],
  'mj-header': []
})

class MJHeader extends core.BodyComponent {
  render() {
    if (this.getAttribute('mycozy')) {
      if (this.getAttribute('locale') === 'en') {
        return this.renderMJML(
          `<mj-section padding="0">
            <mj-column>
              <mj-image padding="16px 0" align="left" height="32px" width="129px" src="../src/assets/images/cozy-logo-myCozy.png" alt="My Cozy"></mj-image>
            </mj-column>
          </mj-section>`
        )
      } else if (this.getAttribute('locale') === 'fr') {
        return this.renderMJML(
          `<mj-section padding="0">
            <mj-column>
              <mj-image padding="16px 0" align="left" height="32px" width="142px" src="../src/assets/images/cozy-logo-monCozy.png" alt="Mon Cozy"></mj-image>
            </mj-column>
          </mj-section>`
        )
      }
    } else {
      return this.renderMJML(
        `<mj-section padding="0">
          <mj-column>
            <mj-image padding="16px 0" align="left" height="24px" width="122px" src="../src/assets/images/cozycloud.png" alt="Cozy Cloud"></mj-image>
          </mj-column>
        </mj-section>`
      )
    }
  }
}

MJHeader.endingTag = true

MJHeader.allowedAttributes = {
  locale: 'enum(fr,en)',
  mycozy: 'boolean'
}

MJHeader.defaultAttributes = {
  locale: 'en'
}

module.exports = MJHeader
