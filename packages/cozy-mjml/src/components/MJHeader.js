const core = require('mjml-core')
const validator = require('mjml-validator')

validator.registerDependencies({
  'mj-body': ['mj-header'],
  'mj-header': []
})

class MJHeader extends core.BodyComponent {
  render() {
    let img = 'cozycloud.png'
    let alt = 'Cozy Cloud'
    let width = 122
    let height = 24
    if (this.getAttribute('mycozy')) {
      // The default locale is 'en'
      img = 'cozy-logo-myCozy.png'
      alt = 'My Cozy'
      width = 129
      height = 32
      if (this.getAttribute('locale') == 'fr') {
        img = 'cozy-logo-monCozy.png'
        alt = 'Mon Cozy'
        width = 142
        height = 32
      }
    }

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

MJHeader.allowedAttributes = {
  locale: 'string',
  mycozy: 'boolean'
}

MJHeader.defaultAttributes = {
  locale: 'en'
}

module.exports = MJHeader
