# Intents

Library to create intents : actions that need to be fullfilled by another app than the current one.

See cozy-stack [documentation](https://docs.cozy.io/en/cozy-stack/intents/) for more details.


### Initialization

```js
import CozyClient from 'cozy-client'
import Intents from 'cozy-interapp'

const client = new CozyClient({ uri, token })
const intents = new Intents({ client })
```

### `intents.create()`

`intents.create(action, doctype [, data, permissions])` create an intent. It returns a modified Promise for the intent document, having a custom `start(element)` method. This method interacts with the DOM to append an iframe to the given HTML element. This iframe will provide an access to an app, which will serve a service page able to manage the intent action for the intent doctype. The `start(element)` method returns a promise for the result document provided by intent service.

> __On Intent ready callback:__ This `start` method also takes a second optional argument which is a callback function (`start(element, onReadyCallback)`). When provided, this function will be run when the intent iframe will be completely loaded (using the `onload` iframe listener). This callback could be useful to run a client code only when the intent iframe is ready and loaded.

An intent has to be created everytime an app need to perform an action over a doctype for wich it does not have permission. For example, the Cozy Drive app should create an intent to `pick` a `io.cozy.contacts` document. The cozy-stack will determines which app can offer a service to resolve the intent. It's this service's URL that will be passed to the iframe `src` property.

Once the intent process is terminated by service, the iframe is removed from DOM.

You can also use `.then` to run some code after the intents is terminated like following:

#### Example

```js
intents.create('CREATE', 'io.cozy.apps')
  .start()
  .then(intent => {
    // do something with the result of the intent
    // intent = {
    //    id: '1337',
    //    attributes: {...}
    // }
  })
```

Example to use `removeIntentFrame()` method (by passing the flag `exposeIntentFrameRemoval` flag):

```js
intents.create('EDIT', 'io.cozy.apps')
  .start(document.getElementById('intent-service-wrapper'))
  .then({removeIntentFrame, doc} => { // after service.terminate(doc)
      // Code to be run before removing the terminated intent iframe
      removeIntentFrame()
      // Other code, use doc
  })
```

### `intents.createService()`

`intents.createService([intentId, window])` has to be used in the intent service page. It initializes communication with the parent window (remember: the service is supposed to be in an iframe).

If `intentId` and `window` parameters are not provided the method will try to retrieve them automatically.

It returns a *service* object, which provides the following methods :
 * `compose(action, doctype, data)`: request the client to make a second intent. This returns a promise fulfilled with the second intent result.

```js
// ...
const app = await service.compose('INSTALL', 'io.cozy.apps', { slug: 'drive' })
 ```

 * `getData()`: returns the data passed to the service by the client.
 * `getIntent()`: returns the intent
 * `resizeClient(doc, transitionProperty)`: forces the size of the intent modale to a given width, maxWidth, height, maxHeight, or dimensions of a given element. The second optional argument `transitionProperty` can be used to add a CSS transition property on the intent in order to 'animate' the resizing.

 ```js
 // resize the client ot 300 pixels max height
 service.resizeClient({
    maxHeight: 300
}, '.2s linear') // will be in css -> transition: .2s linear;
 // or
 service.resizeClient({
    element: document.querySelector('.class')
 })
 ```

> __On intent size:__ If an intent is used by multiple applications, we don't use resizeClient(), since each application can have his own layout. You have to define the size of the intent in your application


 * `terminate(doc)`: ends the intent process by passing to the client the resulting document `doc`. An intent service may only be terminated once.
   > If a boolean `exposeIntentFrameRemoval` is found as `true` in the data sent by the client, the `terminate()` method will return an object with as properties a function named `removeIntentFrame` to remove the iframe DOM node (in order to be run by the client later on) and the resulting document `doc`. This could be useful to animate an intent closing and remove the iframe node at the animation ending.

 * `cancel()`: ends the intent process by passing a `null` value to the client. This method terminate the intent service the same way that `terminate()`.
 * `throw(error)`: throw an error to client and causes the intent promise rejection.

#### Example

```js
intents.createService('77bcc42c-0fd8-11e7-ac95-8f605f6e8338', window)
  .then(service => {
    const data = service.getData()

    // [...]
    // Do stuff with data
    // [...]

    const resultingDoc = {
      type: 'io.cozy.photos',
      width: 100,
      height: 100
    }

    service.terminate(resultingDoc)
  })
```

### `intents.getRedirectionURL()`

`intents.getRedirectionURL(doctype, data)` retrieves a redirection URL for a given doctype, with specified data. It relies internally on a regular intent mechanism, which creates an intent for the `REDIRECT` action. It then build the redirection URL from URL sent by the stack and returns it. This URL can be used as link `href` for example, to show the doctype or the document in an application able to handle it.

#### Example

```jsx
  const myFolder = {
    folder: '4bce4649-e7b7-4226-d82e-6b87dbb684e7'
  }

  const url = await intents.getRedirectionURL('io.cozy.files', myFolder)
  // url is http://domain-app.cozy.rocks/#/files?folder=4bce4649-e7b7-4226-d82e-6b87dbb684e7
```

### `intents.redirect()`

`intents.redirect(doctype, data)` is based on `intents.getRedirectionURL()` and it redirects the browser to the retrieved URL.
