`cozy-email-templates` provides a system to create emails based on templates
provided by Cozy.

It builds on [`handlebars`](https://handlebarsjs.com/) and [`handlebars-layouts`](https://www.npmjs.com/package/handlebars-layouts) to provide a simple way to create emails extending pre-made templates.

## Usage

For now `cozy-email-templates` supports only the pre-built `cozy-layout` template.

This template has the following parts to be filled:

- `appName`
- `topLogo`
- `appURL`
- `footerHelp`
- `content`

Since `appName`, `topLogo` and `appURL` will mostly never change inside a particular
application, it is advised to create a template extending `cozy-layout` in your
application and then refer to it in each of your email templates.

To provide the content for a particular part, use the following syntax:

```
{{#content "part"}}
  Content of the part
{{/content}}
```

where you replace `"part"` with the name of the part you want to fill.

```jsx
// It is advised in an application to have your templates inside .hbs
// files for syntax coloring to work correctly
const appLayout = `
{{#extend "cozy-layout"}}
  {{#content "logoUrl"}}https://example.com/logo-url{{/content}}

  {{#content "appName"}}
    My App
  {{/content}}

  {{#content "topLogo"}}<mj-image width="100px" src="https://downcloud.cozycloud.cc/upload/cozy-banks/email-assets/logo-cozy.png" />{{/content}}

  {{#content "appURL"}}https://my-app.com{{/content}}

  {{#content "footerHelp"}}
    <a css-class="footer__help" href="{{ settingsUrl }}">
      {{tGlobal @root.lang 'settings'}}
    </a>
    <a css-class="footer__help" href="https://support.cozy.io/">
      {{tGlobal @root.lang 'support'}}
    </a>
  {{/content}}
{{/extend}}
`
```

Now that you have provided generic parts, you can code a particular template.

A sample template for a particular notification:

```jsx
const template = `
  {{#extend "app-layout"}}
    {{#content "emailTitle"}}
      A notification from My App !
    {{/content}}

    {{#content "emailSubtitle"}}
      You should read this :)
    {{/content}}

    {{#content "content"}}
      <mj-section>
      {{ greeting name }},

      Just to tell you that My App is awesome !
      </mj-section>
    {{/content}}

  {{/extend}}
`
```

You are now ready to create a `renderer` and use it.

```
import emailTemplates from 'cozy-email-templates'

const partials = {
  'app-layout': appLayout // ⚠️ be careful to pass uncompiled partials
}

const helpers = {
  greeting: name => `Hello ${name} !`
}

const renderer = emailTemplates.renderer({
  helpers,
  partials
})

const data = {
  'name': 'Homer Simpson'
}

const { full } = renderer({ template, data })
// full is a string containing MJML, you have to compile it yourself
```

`cozy-email-templates` is built with the vision that in the future, the whole
email will not be sent directly to the stack, but only rendered parts will be
sent; in other words, only `appURL`, `topLogo`, `content` etc... will be sent,
instead of the whole content). This is why `cozy-email-templates` needs to know
your *uncompiled* partials. You can destructure `parts` to access rendered parts.

```
const { parts } = renderer({ template, data })
// { "emailTitle": "A notification from My App !", ... }
```

