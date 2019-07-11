Expose package information
======================

This plugin is useful if you want to expose chosen package information to
a bundle created via webpack.

The mechanism uses the DefinePlugin to define a variable that will contain
package informations.

### Usage

```
const PackageInfoPlugin = require('webpack-expose-packages-version')

new PackageInfoPlugin({
  packages: ['cozy-bar', 'cozy-ui']
})
```

#### Exposed variable

By default the exposed variable is __PACKAGES__ but it can be customized
via the `varName` option.

```patch
 new PackageInfoPlugin({
   packages: ['cozy-bar', 'cozy-ui'],
+  varName: 'PACKAGES'
 })
```

You can now access package information in your app.

```
/* global PACKAGES */

console.log(PACKAGES)
/* {"cozy-bar": {"version": "1.0.0"}, "cozy-ui": {"version": "6.26.2"}} */
```

#### Fields

By default the only information retrieved from the package is the `version` but
you can customize this with the `fields` options.

```patch
 new PackageInfoPlugin({
   packages: ['cozy-bar', 'cozy-ui'],
   varName: 'PACKAGES',
+  fields: ['version', 'repository']
 })
```
