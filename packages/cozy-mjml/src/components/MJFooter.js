const validator = require('mjml-validator')
const core = require('mjml-core')
const url = require('url')

validator.registerDependencies({
  'mj-body': ['mj-footer'],
  'mj-footer': []
})

class MJFooter extends core.BodyComponent {
  displayInstance(instance) {
    if (instance) {
      const hostname = url.parse(instance).hostname
      return `
        <mj-section padding="16px 0">
          <mj-column vertical-align="middle">
            <mj-button href="${instance}" background-color="#fff" font-size="14px" color="#297ef2" text-decoration="none" font-weight="bold" padding="0" inner-padding="4px 16px" vertical-align="middle" border-radius="16px">
              <img width="24" height="24" src="https://files.cozycloud.cc/cozy-mjml/cozy-logo-round.png" style="vertical-align:middle;" />&nbsp;
              ${hostname}
            </mj-button>
          </mj-column>
        </mj-section>`
    } else {
      return `
        <mj-section padding="16px 0 8px">
          <mj-column align="center">
            <mj-image padding="0" width="32px" src="https://files.cozycloud.cc/cozy-mjml/cozy-logo-round.png"></mj-image>
          </mj-column>
        </mj-section>`
    }
  }

  cozySignature(locale) {
    // The default locale is 'en'
    let text = 'Cozy Cloud hosts your personal cloud, Cozy'
    let more = 'Hosted in France • Respectful of your privacy • Secure'
    if (locale == 'fr') {
      text = 'Cozy Cloud héberge votre domicile numérique, Cozy'
      more = 'Hébergé en France • Respectueux de votre vie privée • Sécurisé'
    }
    return `
      <mj-section padding="0">
        <mj-column>
          <mj-text padding="0" align="center" mj-class="highlight">${text}</mj-text>
          <mj-text align="center" font-size="14px" color="#95999d">${more}</mj-text>
        </mj-column>
      </mj-section>`
  }

  cozyHelp(locale) {
    let blog = "Cozy Cloud's blog"
    let help = 'Help &amp; support'
    if (locale == 'fr') {
      blog = 'Blog de Cozy Cloud'
      help = 'Aide et support'
    }
    return `
      <mj-section padding="0">
        <mj-group>
          <mj-column width="49.5%" padding="0">
            <mj-button href="https://blog.cozy.io" mj-class="primary-link" font-size="12px" align="right">${blog}</mj-button>
          </mj-column>
          <mj-column width="1%" padding="0">
            <mj-text align="center" padding="5px 0" color="#95999d" font-size="16px">|</mj-text>
          </mj-column>
          <mj-column width="49.5%" padding="0">
            <mj-button href="https://support.cozy.io" mj-class="primary-link" font-size="12px" align="left">${help}</mj-button>
          </mj-column>
        </mj-group>
      </mj-section>`
  }

  appStores(locale) {
    let itunesLang = 'us'
    let playParams = ''
    if (locale == 'fr') {
      itunesLang = 'fr'
      playParams = '&hl=fr'
    }
    return `
      <mj-section padding-bottom="5px">
        <mj-group>
          <mj-column width="50%">
            <mj-image align="right" alt="Appstore" padding="4px" width="130px" src="https://files.cozycloud.cc/cozy-mjml/appstore-${locale}.png" href="https://itunes.apple.com/${itunesLang}/developer/cozy-cloud/id1131616091?mt=8"></mj-image>
          </mj-column>
          <mj-column width="50%">
            <mj-image align="left" alt="Play Store" padding="4px" width="130px" src="https://files.cozycloud.cc/cozy-mjml/playstore-${locale}.png" href="https://play.google.com/store/apps/developer?id=Cozy+Cloud${playParams}"></mj-image>
          </mj-column>
          <mj-column width="100%">
            <mj-image align="center" alt="Cozy Desktop" padding="4px" width="130px" src="https://files.cozycloud.cc/cozy-mjml/desktop-${locale}.png" href="https://cozy.io/${locale}/download/#desktop"></mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
  }

  cozyLegal(locale) {
    let text = 'Legal'
    if (locale == 'fr') {
      text = 'Mentions légales'
    }
    return `
      <mj-section padding="0">
        <mj-column>
          <mj-text align="center" font-size="12px">
            <a href="https://cozy.io/${locale}/legal/" style="color:#5d6165;">${text}</a>
          </mj-text>
        </mj-column>
      </mj-section>`
  }

  render() {
    const locale = this.getAttribute('locale')
    return this.renderMJML(
      `<mj-wrapper padding="0">
        ${this.displayInstance(this.getAttribute('instance'))}
        ${this.cozySignature(locale)}
        ${this.cozyHelp(locale)}
        ${this.appStores(locale)}
        ${this.cozyLegal(locale)}
      </mj-wrapper>`
    )
  }
}

MJFooter.endingTag = true

MJFooter.allowedAttributes = {
  locale: 'string',
  instance: 'string'
}

MJFooter.defaultAttributes = {
  locale: 'en'
}

module.exports = MJFooter
