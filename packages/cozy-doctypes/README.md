## Doctypes

This repository is meant to bring together methods and functions for doctypes that are shared across several applications.

- [Bank transactions](./src/banking/BankTransaction.js)
- [Bank accounts](./src/banking/BankAccount.js)
- [Balance histories](./src/banking/BalanceHistory.js)

## `Document`

The [Document](./src/Document.js) API is useful when you need to have global models, available across files.

It can be used as a base for other document types (see [BankTransaction](https://github.com/cozy/cozy-libs/blob/master/packages/cozy-doctypes/src/banking/BankTransaction.js) for example).

### How to use it

In the following section, we will see how to deal with a fictitious `io.cozy.simpsons` doctype (we are developing a konnector to retrieve al the Simpson characters). First, let's create a class `Simpson` that inherits from `Document` :

```js
const { Document } = require('cozy-doctypes')

class Simpson extends Document {}
```

Second, let's specify the doctype:

```js
const { Document } = require('cozy-doctypes')

class Simpson extends Document {}
Simpson.doctype = 'io.cozy.simpsons'
```

Then we provide a `cozy-client-js` instance to our class. We are going to use [cozy-konnector-libs](https://github.com/konnectors/libs/tree/master/packages/cozy-konnector-libs) to get this instance. Take a look at the [konnectors documentation](https://docs.cozy.io/en/tutorials/konnector/) to learn more about that.

```
const { Document } = require('cozy-doctypes')
const { cozyClient } = require('cozy-konnector-libs')

class Simpson extends Document {}
Simpson.doctype = 'io.cozy.simpsons'

Simpson.registerClient(cozyClient)
```

With this, the class is already usable. For example, we can create a new document:

```js
Simpson.create({
  name: 'Homer'
})
```

Or get some documents given their ids:

```js
const documents = await Simpson.getAll(['id1', 'id2', 'id3']
```

Take a look at [the Document class](https://github.com/cozy/cozy-libs/blob/master/packages/cozy-doctypes/src/Document.js) to see all the methods it implements.

### Special class properties

There are some properties that can be given to `Document` that have a special meaning.

#### `idAttributes`

`idAttributes` is an array of attributes that are seen as ids. When `Document` knows that, it becomes able to determine if a given document must be created or updated. This is used in the `createOrUpdate` method. Let's say that we want the `name` of our `Simpson`s to be an id:

```js
Simpson.idAttributes = ['name']
```

Now, if we do the following:

```js
Simpson.createOrUpdate({ name: 'Homer', description: 'Likes donuts' })
```

Since we said that `name` is an id attribute, the document we previously created with the name « Homer » will be updated. But if we do:

```js
Simpson.createOrUpdate({ name: 'Marge', description: "Homer's wife" })
```

This document will be created, because no document exists with this `name`.

#### `checkedAttributes`

`checkedAttributes` is an array of attributes. But it is used to determine if a document should be updated or not. Let's say that we want a document to be updated only if its `description` changed:

```js
Simpson.checkedAttributes = ['description']
```

Now, if we try to update a document, without changing its `description`:

```js
Simpson.createOrUpdate({ name: 'Marge', children: ['Bart', 'Lisa', 'Maggie'] })
```

Then it will not be updated, even if we specified a new `children` attribute.

#### `createdByApp`

`createdByApp` is the slug of an application / konnector that creates the document. This information is used for cozy metadatas (see the [metadatas documentation](https://github.com/cozy/cozy-doctypes#document-metadata) to learn more). If we provide this, the metadata is automatically added to any created or updated document:

```js
Simpson.createdByApp = 'my-awesome-simpsons-konnector'

Simpson.createOrUpdate({ name: 'Bart' })
```

The created document will have a `cozyMetadata` property like this:

```js
{
  "_id": "the_id_generated_by_couchdb",
  "name": "Bart",
  "cozyMetadata": {
    "createdByApp": "my-awesome-simpsons-konnector"
  }
}
```

## Environments

The `package.json` has both `main` and `browser` fields. This allows

- a nodeJS runtime to run the non transpiled code (async/await are for example
supported in nodeJS) which allows for easier to read stacktraces.

- browser runtimes to use transpiled code

The only caveat here is that we must pay attention to features that we use that are not supported yet
in nodeJS, for example 

- the lack of ES6 module support in nodeJS, we have to use `module.exports`
- class properties: must bind the methods in the constructor

webpack doc for browser field: https://webpack.js.org/configuration/resolve/#resolvealiasfields

package.json doc for browser field: https://docs.npmjs.com/files/package.json#browser
