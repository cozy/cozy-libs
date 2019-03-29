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

## Our custom components

### `<mj-cozy-title>`

This very simple component that just output a title, a bit like `<h1>` in HTML
world. Example:

```xml
<mj-cozy-title>✉️ Confirmation de votre inscription</mj-cozy-title>
```

will be transformed to:

```html
<div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
✉️ Confirmation de votre inscription
</div>
```
