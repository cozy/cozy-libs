Cozy-MJML
=========

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

## Get Cozy styled mails

For starters, you must add those lines to your `<mj-head>` element in your template or simply use our `layout.mjml` file as a base.

```xml
<mj-font name="Lato" href="https://fonts.googleapis.com/css?family=Lato" />
<mj-attributes>
  <mj-class name="content-small" padding="0 24px 8px" />
  <mj-class name="content-medium" padding="0 24px 16px" />
  <mj-class name="content-large" padding="0 24px 24px" />
  <mj-class name="content-xlarge" padding="0 24px 32px" />
  <mj-class name="highlight" color="#297ef2" font-weight="bold" />
  <mj-class name="title" color="#95999d" text-transform="uppercase" font-size="12px" font-weight="bold" />
  <mj-class name="title-h2" font-size="18px" font-weight="bold" />
  <mj-class name="primary-button" inner-padding="10px 16px" background-color="#297ef2" border-radius="2px" color="#fff" text-transform="uppercase" font-size="14px" font-weight="bold" line-height="1.43" />
  <mj-class name="primary-link" background-color="transparent" color="#297ef2" text-decoration="none" font-weight="bold" padding="0" inner-padding="10px 8px" />
  <mj-all font-family="Lato,Arial" color="#32363f" font-size="16px" line-height="1.5" />
</mj-attributes>
```

📌 Couldn't find a way to make a component out of this due to some MJML limitations.

## Our available classes

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

## Our custom components

### `<mj-header>`

#### Available props
- `mycozy`: bool, default `false` - Displays a header with *MyCozy* logo instead of *CozyCloud* logo
- `locale`: `en`|`fr`, default `en` - Displays the *MyCozy* logo in english or french

```xml
<mj-header></mj-header>
<mj-header mycozy="true" locale="fr"></mj-header>
```

### `<mj-footer>`

#### Available props
- `locale`: `en`|`fr`, default `en` - Displays the footer texts & urls in english or french
- `instance`: `string` - Displays the user's instance text & link instead of Cozy logo

```xml
<mj-footer></mj-footer>
<mj-footer instance="isabelledurand.mycozy.cloud" locale="fr"></mj-footer>
```

