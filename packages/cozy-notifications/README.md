`cozy-notifications` provides tools to send notifications (push or email) from a Cozy
application or konnector.

## Installation

```
yarn add cozy-notifications
```

You will most likely also need a custom webpack config if building for node (for example
in konnectors, since mjml and its dependents are not built for node-js).

`webpack.config.js`

```javascript
const webpackMerge = require('webpack-merge')
const cozyNotificationsWebpackConfig = require('cozy-notifications/dist/webpack/config')

module.exports = webpackMerge({
  // initialConfig
}, cozyNotificationsWebpackConfig)
```

The custom webpack config provided by `cozy-notifications` applies aliases and resolves for
`cozy-notifications` to be used in a build targetting node.

## `sendNotification`

The main entrypoint of this library is `sendNotifification(cozyClient, notificationView)`.

Before being able to use it, we need to define a notification view class.

## Notification views

Notification views are responsible for

- fetching the data necessary for the notification
- providing a template for the notification
- configuring the notification (`category`, `channels`)
- deciding if the notification should be sent

```javascript
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

  getExtraAttributes() {
    return {
      data: {
        // data that will be sent in the notification payload for mobiles
        redirectLink: "settings/#/subscription"
      }
    }
  }
}

MyNotification.template = require('./template.hbs')
```

### getExtraAttributes

In `getExtraAttributes`, you can pass data that will be sent in the notification payload for mobiles.

```javascript
getExtraAttributes() {
  return {
    data: {
      // Standardized. When opening the notification, it will open settings app on subscription page.
      redirectLink: "settings/#/subscription",
      // Standardized. When opening the notification, it will refresh the app.
      refresh: true,
      // You can also pass whatever you want.
      age: 42
    }
  }
}
```

In `getExtraAttributes`, you can also pass a `state` (only needed if your notification is `stateful`).

```javascript
getExtraAttributes() {
  return {
    // State to send the notification only 1 time per day.
    state: new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}
```

### preferredChannels

We can define one which channels the user will receive the notification.

```javascript
MyNotification.preferredChannels = ['mail', 'mobile']
```

#### mobile

The mobile channels consists of a push notification. Its title will be
the result of the `getTitle` method and its content will be the result
of `getPushContent`.

#### mail

Emails need more markup and thus will need the `template` class attribute.
They are written in `mjml`, making it possible to write good looking emails in every major mail client.

## Templates

Templates serve for the HTML content of emails.

Templates used in notification views are based on

- [`handlebars`](https://handlebarsjs.com/) for templating
- [`handlebars-layouts`](https://www.npmjs.com/package/handlebars-layouts)
  to be able to extend layouts
- [`mjml`](https://mjml.io/) to build responsive emails

This makes it simple to create emails that are based on built-in templates.

For now `cozy-notifications` supports only the pre-built `cozy-layout` template.

This template has the following parts to be filled:

- `appName`
- `topLogo`
- `appURL`
- `footerHelp`
- `content`

Since `appName`, `topLogo` and `appURL` will mostly never change inside a
particular application, it is advised to create a template extending `cozy-layout`
in your application and then refer to it in each of your email templates.

To provide the content for a particular part, use the following syntax:

```handlebars
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

  {{#content "topLogo"}}<mj-image width="129px" src="https://downcloud.cozycloud.cc/upload/cozy-banks/email-assets/logo-cozy.png" />{{/content}}

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

Now that we have provided generic parts, we can code a particular template.

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

We can now use our template for a notification view.

```javascript
import template from './my-notification.hbs'
import appTemplate from './app-layout.hbs'
import { NotificationView } from 'cozy-notifications'

class MyNotificationView extends NotificationView {
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
our *uncompiled* partials. We can destructure `parts` to access rendered parts.

```javascript
import { renderer } from 'cozy-notifications'
const render = renderer({ partials, helpers })
const { parts } = render({ template, data })
// { "emailTitle": "A notification from My App !", ... }
```

## Built-in helpers

- `t` will be passed automatically as a helper in templates. We must pass
  the `locales` object when instantiating the NotificationView.

```javascript
const locales = {
  de: {
    hello: "Guten Tag %{name} !"
  }
}

const myNotifView = new MyNotificationView({
  ...,
  locales
})
```

```handlebars
{{ t "hello" name='Homer' }}
```

- `webLink` is able to build links that go the web version of an app

```handlebars
{{ webLink slug="home" }}
```

- `universalLink` is able to build links that use automatically the web or mobile version the app

```handlebars
{{ universalLink slug="banks" }}
```

- `palette` lets you pick a color by giving its --varName.

```handlebars
<mj-button background-color="{{ palette '--primaryColor' }}" color="{{ palette '--primaryContrastTextColor' }}">
  A primary button
 </mj-button>
```
