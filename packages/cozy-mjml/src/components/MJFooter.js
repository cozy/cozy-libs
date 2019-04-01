const validator = require('mjml-validator')
const core = require('mjml-core')

validator.registerDependencies({
  'mj-body': ['mj-footer'],
  'mj-footer': []
})

class MJFooter extends core.BodyComponent {
  displayInstance(instance) {
    if (instance) {
      return `
        <mj-section padding="16px 0">
          <mj-column vertical-align="middle">
            <mj-button href="https://${instance}" background-color="#fff" font-size="14px" color="#297ef2" text-decoration="none" font-weight="bold" padding="0" inner-padding="4px 16px" vertical-align="middle" border-radius="16px">
              <img width="24" height="24" src="../src/assets/images/cozy-logo-round.png" style="vertical-align:middle;" />&nbsp;
              ${instance}
            </mj-button>
          </mj-column>
        </mj-section>`
    } else {
      return `
        <mj-section padding="16px 0 8px">
          <mj-column align="center">
            <mj-image padding="0" width="32px" src="../src/assets/images/cozy-logo-round.png"></mj-image>
          </mj-column>
        </mj-section>`
    }
  }

  render() {
    if (this.getAttribute('locale') === 'fr') {
      return this.renderMJML(
        `<mj-wrapper padding="0">
          ${this.displayInstance(this.getAttribute('instance'))}
          <mj-section padding="0">
            <mj-column>
              <mj-text padding="0" align="center" mj-class="highlight">Cozy, votre domicile numérique</mj-text>
              <mj-text align="center" font-size="14px" color="#95999d">Hébergé en France • Respectueux de votre vie privée • Sécurisé</mj-text>
            </mj-column>
          </mj-section>
          <mj-section padding="0">
            <mj-group>
              <mj-column width="49.5%" padding="0">
                <mj-button href="https://blog.cozy.io" mj-class="primary-link" font-size="12px" align="right">Blog de Cozy Cloud</mj-button>
              </mj-column>
              <mj-column width="1%" padding="0">
                <mj-text align="center" padding="5px 0" color="#95999d" font-size="16px">|</mj-text>
              </mj-column>
              <mj-column width="49.5%" padding="0">
                <mj-button href="https://support.cozy.io" mj-class="primary-link" font-size="12px" align="left">Aide et support</mj-button>
              </mj-column>
            </mj-group>
          </mj-section>
          <mj-section padding-bottom="5px">
            <mj-group>
              <mj-column width="50%">
                <mj-image align="right" alt="Appstore" padding="4px" width="130px" src="../src/assets/images/appstore-fr.png" href="https://itunes.apple.com/fr/developer/cozy-cloud/id1131616091?mt=8"></mj-image>
              </mj-column>
              <mj-column width="50%">
                <mj-image align="left" alt="Play Store" padding="4px" width="130px" src="../src/assets/images/playstore-fr.png" href="https://play.google.com/store/apps/developer?id=Cozy+Cloud&hl=fr"></mj-image>
              </mj-column>
              <mj-column width="100%">
                <mj-image align="center" alt="Cozy Desktop" padding="4px" width="130px" src="../src/assets/images/desktop-fr.png" href="https://cozy.io/fr/download/#desktop"></mj-image>
              </mj-column>
            </mj-group>
          </mj-section>
          <mj-section padding="0">
            <mj-column>
              <mj-text align="center" font-size="12px">
                <a href="https://cozy.io/fr/legal/" style="color:#5d6165;">Mentions légales</a>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>`
      )
    } else if (this.getAttribute('locale') === 'en') {
      return this.renderMJML(
        `<mj-wrapper padding="0">
          ${this.displayInstance(this.getAttribute('instance'))}
          <mj-section padding="0">
            <mj-column>
              <mj-text padding="0" align="center" mj-class="highlight">Cozy, your smart personal cloud</mj-text>
              <mj-text align="center" font-size="14px" color="#95999d">Hosted in France • Respectful of your privacy • Secure</mj-text>
            </mj-column>
          </mj-section>
          <mj-section padding="0">
            <mj-group>
              <mj-column width="49.5%" padding="0">
                <mj-button href="https://blog.cozy.io" mj-class="primary-link" font-size="12px" align="right">Cozy Cloud's blog</mj-button>
              </mj-column>
              <mj-column width="1%" padding="0">
                <mj-text align="center" padding="5px 0" color="#95999d" font-size="16px">|</mj-text>
              </mj-column>
              <mj-column width="49.5%" padding="0">
                <mj-button href="https://support.cozy.io" mj-class="primary-link" font-size="12px" align="left">Help & support</mj-button>
              </mj-column>
            </mj-group>
          </mj-section>
          <mj-section padding-bottom="5px">
            <mj-group>
              <mj-column width="50%">
                <mj-image align="right" alt="Appstore" padding="4px" width="130px" src="../src/assets/images/appstore-en.png" href="https://itunes.apple.com/us/developer/cozy-cloud/id1131616091?mt=8"></mj-image>
              </mj-column>
              <mj-column width="50%">
                <mj-image align="left" alt="Play Store" padding="4px" width="130px" src="../src/assets/images/playstore-en.png" href="https://play.google.com/store/apps/developer?id=Cozy+Cloud"></mj-image>
              </mj-column>
              <mj-column width="100%">
                <mj-image align="center" alt="Cozy Desktop" padding="4px" width="130px" src="../src/assets/images/desktop-en.png" href="https://cozy.io/en/download/#desktop"></mj-image>
              </mj-column>
            </mj-group>
          </mj-section>
          <mj-section padding="0">
            <mj-column>
              <mj-text align="center" font-size="12px">
                <a href="https://cozy.io/en/legal/" style="color:#5d6165;">Legal</a>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>`
      )
    }
  }
}

MJFooter.endingTag = true

MJFooter.allowedAttributes = {
  locale: 'enum(fr,en)',
  instance: 'string'
}

MJFooter.defaultAttributes = {
  locale: 'en'
}

module.exports = MJFooter
