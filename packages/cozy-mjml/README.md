# Cozy-MJML

Cozy-MJML is used for emails. It brings some custom components for MJML that we
want to share between several projects (cozy-stack, clouderery, notifications,
etc.).

## How it works?

Cozy-MJML exposes a single binary that behave like mjml CLI. The goal is to
replace the mjml binary by this one on the cloudery: it will allow to use our
custom MJML components with mjml-rails, even if the mjml CLI doesn't support
custom components and mjml-rails has some expectations (like the version number
of the CLI tools). This binary will also be used by the cozy-stack to generate
HTML mails: the stack will run it like a konnector or a service.

I've had to put some hacks in the `src/hacks` directory and in the webpack
config to make the bundled version works. I'm not proud of that, if you
suggestion on how to improve that, please, let me know.

You can test in command line the output of the given example by running this
command:

```sh
$ node src/index.js example.mjml
```

The result will be output on stdout. If you prefer to test with the bundled
version, you can do:

```sh
$ yarn build && node dist/main.js example.mjml
```

To run the jest test:

```sh
$ yarn test
```

## Our available classes

## Our custom components

### `<mj-defaults>`

Put this tag in the head to load the Lato font from Google APIs and make the
following classes available in your mjml templates:

- `title` to display the main title
- `title-h2` to display a secondary title
- `highlight` to display a bold & blue text
- `primary-link` to display a blue link
- `primary-button` to display a big blue button (which is in fact a link)
- `content-small` to get a content block with a small bottom margin (8px)
- `content-medium` to get a content block with a medium bottom margin (16px)
- `content-large` to get a content block with a large bottom margin (24px)
- `content-xlarge` to get a content block with a xlarge bottom margin (32px)

To apply those classes, your must add an attribute `mj-class` to your MJML element.

```xml
<mj-text mj-class="title content-small">✉️ Confirmation de votre inscription</mj-text>
```

#### Available props

There are no props for this component.

```xml
<mj-head>
  <mj-defaults />
</mj-head>
```

### `<mj-header>`

#### Available props

There are no props for this component.

```xml
<mj-header></mj-header>
```

### `<mj-footer>`

#### Available props

- `locale`: `en`|`fr`, default `en` - Displays the footer texts & urls in english or french
- `instance`: `string` - Displays the user's instance text & link instead of Cozy logo

```xml
<mj-footer></mj-footer>
<mj-footer instance="https://isabelledurand.mycozy.cloud" locale="fr"></mj-footer>
```
