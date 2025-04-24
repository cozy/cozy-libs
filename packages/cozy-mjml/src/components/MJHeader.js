const validator = require('mjml-validator')
const core = require('mjml-core')

validator.registerDependencies({
  'mj-body': ['mj-header'],
  'mj-header': []
})

class MJHeader extends core.BodyComponent {
  render() {
    let img = 'twakeworkplacelogo.png'
    let alt = 'Twake Workplace'
    let width = 370
    let height = 48
    return this.renderMJML(
      `<mj-section padding="0">
         <mj-column>
           <mj-image padding="16px 0" align="left" height="${height}px" width="${width}px" src="https://files.cozycloud.cc/cozy-mjml/${img}" alt="${alt}"></mj-image>
         </mj-column>
       </mj-section>`
    )
  }
}

MJHeader.endingTag = true

module.exports = MJHeader
