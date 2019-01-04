Cozy-Harvest-Lib
=====

Cozy-Harvest-Lib will bring the logic, modules and components used in harvest applications.

Harvest applications will be apps which will allow to configure konnectors, setup authentification informations and check for synchronized data (And much more in the future).
Each harvest application will be associated with only one konnector.

This first version is just an "Hello world" version aimed at initializing the lib and make it available in NPM

# Components

## AccountForm

The AccountForm displays a form generated from the `fields` object of a [konnector manifest](https://docs.cozy.io/en/cozy-apps-registry/README/#1-prepare-your-application).

For now, the form is just the most basic as possible. Next steps are:
* Handling password fields
* Handling I18n and custom locales

### AccountForm properties
#### `fields`
Object containing fields declared in konnector's manifest. Fields are used to create a `io.cozy.accounts` document. This document helps konnector connecting to remote service.

Fields are declared by their name and can have several properties:

|Property|Role|
|-|-|
|`encrypted` | Specify if field should be encrypted by stack (default: `true` if `type=password`, `false` otherwise). |
|`required` | Specify if field is required (default: `true`). |
|`type` | Can be `date`, `dropdown`, `email`, `text` or `password` (default: `text`). |

##### Example of `fields` object
```js
{
  username: {
    type: 'text'
  },
  passphrase: {
    type: 'password'
  }
}
```

#### `locales`

Object containing the local as specified in konnector's manifest.

##### Example of `locales` object
```js
{
  en: {
    fields:
      username: {
        label: "Username"
      }
    }
  },
  fr: {
    fields: {
      username: {
        label: "Nom d'utilisateur"
      }
    }
  }
}
```
Cozy-Harvest-Lib provides a defined range of field labels which do not need to be specified in the manifest. Those field labels are: `answer`, `birthdate`, `code`, `date`, `email`, `firstname`, `lastname`, `login`, `password`, `phone`.

Any konnector can provide new locales for this field labels or add new ones. They will be loaded by the AccountForm component.

### AccountForm usage
```js
<AccountForm fields={konnector.fields} locales={} />
```

## OAuthForm

The OAuthForm is used for OAuth konnector and display a single "Connect" button.
