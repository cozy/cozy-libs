import appTemplate from './__tests__/app-layout.hbs'
import template from './__tests__/email-layout.hbs'
import emailTemplates from './templates'

const helpers = {
  greeting: name => `Hello ${name} !`,
  t: x => x
}

const partials = {
  'app-layout': appTemplate
}

describe('template utils', () => {
  it('should extract parts and parents from template', () => {
    const renderer = emailTemplates.renderer({ partials, helpers })
    const templateInfo = renderer.collectInfo(template)
    expect(templateInfo.parents).toEqual(['app-layout', 'cozy-layout'])
    expect(Object.keys(templateInfo.contentASTByName)).toEqual([
      'emailTitle',
      'emailSubtitle',
      'content',
      'logoUrl',
      'appName',
      'topLogo',
      'footerHelp'
    ])
  })

  it('should inject content blocks', () => {
    const renderer = emailTemplates.renderer({ partials, helpers })
    const { ast } = renderer.collectInfo(template, partials)
    renderer.injectContent(ast, {
      emailTitle: 'emailTitle',
      emailSubtitle: 'emailSubtitle',
      content: 'content',
      logoUrl: 'logoUrl',
      appName: 'appName',
      topLogo: 'topLogo',
      appURL: 'appURL',
      settingsURL: 'settingsUrl',
      footerHelp: 'footerHelp'
    })
    const compiled = renderer.Handlebars.compile(ast)
    const rendered = compiled()
    expect(rendered).toMatchSnapshot()
  })

  it('should render parts and full', () => {
    const renderer = emailTemplates.renderer({ partials, helpers })
    const data = {
      name: 'Homer',
      appUrl: 'https://homer-myapp.mycozy.cloud',
      settingsUrl: 'https://homer-settings.mycozy.cloud'
    }
    const compiled = renderer.render({
      template,
      data
    })
    expect(compiled.full).toMatchSnapshot()
    expect(compiled.parts.emailSubtitle.trim()).toBe('Hello Homer !')
  })
})
