`cozy-notifications` provides tools to send notifications (push or email) from a Cozy
application or konnector.

## `sendNotification`

The main entrypoint of this library is `sendNotifification(cozyClient, notificationView)`.

Before being able to use it, you must define a notification view class.

## Notification views

Notification views are responsible for

- fetching the data necessary for the notification
- providing a template for the notification
- configuring the notification (`category`, `channels`)
- deciding if the notification should be sent

```
class MyNotification {
  async buildData() {
    return {
      // data that will be used in the template
    }
  }

  getPushContent() {
    return 'push content'
  }

  getTitle() {
    return 'title'
  }
}

MyNotification.template = require('./template.hbs')
```

## Templates

Templates used in notification views are based on [`handlebars`](https://handlebarsjs.com/)
and [`handlebars-layouts`](https://www.npmjs.com/package/handlebars-layouts). This makes
it   simple to create notifications that are based on built-in templates.

For now `cozy-notifications` supports only the pre-built `cozy-layout` template.

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

Note: it is advised in an application to have your templates inside .hbs
files for syntax coloring to work correctly. You must configure your
bundler and/or test runner to require those files correctly.

`app-layout.hbs`

```handlebars
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
```

Now that you have provided generic parts, you can code a particular template.

A sample template for a particular notification:

`my-notification.hbs`

```handlebars
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
```

You can now use your template for a notification view.

```
import template from './my-notification.hbs'
import appTemplate from './app-layout.hbs'

class MyNotificationView {
  getPartials () {
    return { 'app-layout': appTemplate }
  }
}
MyNotificationView.template = template
```

## Accessing different parts

`cozy-notifications` is built with the vision that in the future, the whole
email will not be sent directly to the stack, but only rendered parts will be
sent; in other words, only `appURL`, `topLogo`, `content` etc... will be sent,
instead of the whole content). This is why `cozy-notifications` needs to know
your *uncompiled* partials. You can destructure `parts` to access rendered parts.

```
import { renderer } from 'cozy-notifications'
const render = renderer({ partials, helpers })
const { parts } = render({ template, data })
// { "emailTitle": "A notification from My App !", ... }
```

