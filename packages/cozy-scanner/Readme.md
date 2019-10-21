# Cozy Scanner

Cozy-Scanner provides a component to take a picture of a document and describe it

## Installation

Cozy-Scanner requires :

- a cordova plugin : `cordova plugin add https://github.com/cozy/cordova-plugin-camera.git#bf519ca009eeaec3a47237ee07a09d515cc733df`
- At least Cozy-UI 25.7
- Cozy-Doctypes

To use the component and get the style, you need to import the css in your app

```js
import "cozy-scanner/dist/stylesheet.css";
```

Since Cozy-Scanner uses a few `Aleter` you also have to put `<Alerter />` (from Cozy-UI)
somewhere in your React Tree.

### Translation

If you need to access to the translated categories, you can use getBoundT helper

```js
import { getBoundT } from 'cozy-scanner'
...
const scannerT = getBoundT(lang) //lang coming from cozy-ui translate()
scannerT(`Scan.items.${file.metadata.label}`)

```
