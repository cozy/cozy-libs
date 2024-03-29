# Cozy App Publish

![https://npmjs.org/package/cozy-app-publish](https://img.shields.io/npm/v/cozy-app-publish.svg)
![https://github.com/cozy/cozy-libs/blob/master/packages//LICENSE](https://img.shields.io/npm/l/cozy-app-publish.svg)
![https://npmcharts.com/compare/cozy-app-publish](https://img.shields.io/npm/dm/cozy-app-publish.svg)

### What's cozy-app-publish?

`cozy-app-publish` is a command line tool that publish a Cozy application to the Cozy registry according to some options.

#### Requirements

- Node.js version 8 or higher;

### Install

```
yarn add --dev cozy-app-publish
```

### Registry documentation

You can find more information about the registry and how to prepare an application to be published in the [official registry documentation](https://github.com/cozy/cozy-stack/blob/master/docs/registry.md).

### Usage via Travis CI (recommended)

First of all, don't forget to build the application:

```
# build the application (in the ./build folder here)
yarn build
```

Then, just publish it using the Travis CI workflow:

```
# publish it, REGISTRY_TOKEN should be
# encrypted and provided via Travis CI environment
# BUILD_COMMIT is your last build commit hash (git rev-parse build)
yarn cozy-app-publish \
--token $REGISTRY_TOKEN \
--build-commit $BUILD_COMMIT
```

Published version is inferred from the tag set on current commit or the version defined in the manifest `version` property:

- If the current commit has no tag associated, then this is a dev version in the form `<manifest_version>-dev.<commit_sha><date>`
- If the current commit has a beta tag `x.y.z-beta.n` or a stable tag `x.y.z`, then this is a beta or stable version and the tag value is used as the version

### Manual usage (not recommended)

First of all, don't forget to build the application:

```
# build the application (in the ./build folder here)
yarn build
```

Then, just publish it using:

```
yarn cozy-app-publish \
--token $REGISTRY_TOKEN \
--build-url https://github.com/cozy/cozy-collect/archive/042cef26d9d33ea604fe4364eaab569980b500c9.tar.gz \
--manual-version 1.0.2-dev.042cef26d9d33ea604fe4364eaab569980b500c9
```

#### Publishing a beta version

Beta versions are only available through beta channel of the registry and are not automatically deployable on production instances. However a beta tester can
force deployment of beta versions of a given (installed) app from Cozy store. Ask your Cozy representative to explain you how to do this.

Let's say you plan to publish version `1.0.2` of your application and want to test it before publishing it to stable. Then you will publish a `1.0.2-beta.1` version,
test it, publish other beta versions if some adjustement are needed and when you're satisfied with the version you will publish a stable version.

To publish a beta version:

- Have the target stable version as the `version` in your manifest file (eg `1.0.2` in our example). The manifest file always reference stable version.
- Publish with `cozy-app-publish` using the beta version like `1.0.2-beta.1`

```
yarn cozy-app-publish \
--token $REGISTRY_TOKEN \
--build-url https://github.com/cozy/cozy-collect/archive/042cef26d9d33ea604fe4364eaab569980b500c9.tar.gz \
--manual-version 1.0.2-beta.1
```

#### Publishing a stable version

Instances auto-update app versions as soon as they are published as stable. Publishing a new stable version will make it available immediately to all instances
(existing and new ones) unless permission changes requiring user's validation.

To publish a stable version, simply use a version in the form `x.y.z` and it will be considered as stable.

Because manifest's `version` doesn't need to be changed between beta and stable, you don't need to rebuild the application and can publish the exact same app package
you built for beta publication

```
yarn cozy-app-publish \
--token $REGISTRY_TOKEN \
--build-url https://github.com/cozy/cozy-collect/archive/042cef26d9d33ea604fe4364eaab569980b500c9.tar.gz \
--manual-version 1.0.2
```

### Options

#### `--token <editor-token>` (required)

The registry editor token. This token must match the editor name and is provided by Cozy Cloud (with the name) in order to use the registry.

#### `--build-dir <relative-path>`

The path to the build folder, relative to the current directory. Since the 'standard' Cozy application builds in the `build/` folder, `build` is the default value. This folder is mainly used to read the application manifest during publishing.

#### `--build-url <url>`

For now, the registry a build archive (.tar.gz file) from an external link to be used in the cozy-stack. In the travis script, this url is computed using the Github trick to get archives from a commit url (but it's overwritten if provided by this option). For the manual script, we have to provide it.

#### `--build-commit <commit-hash>`

Using the `travis` mode, the archive tarball URL is computed using github and the build commit hash. If you are not on your build branch to publish, you can specify the correct build commit hash using this parameter.

#### `--manual-version <version>` (required for manual usage only)

In the manual mode, we don't have a way to compute the version like in the Travis mode for example. So we have to provide it using this option.

#### `--prepublish <script_path>`

Specify custom prepublish hook to manage how the app archive is generated and uploaded. The script must export a asynchronous function which has the following signature:

```js
module.exports = async ({
  appBuildUrl,
  appSlug,
  appType,
  appVersion,
  buildCommit,
  registryUrl,
  registryEditor,
  registryToken,
  spaceName
}) => {
 // ...
}
```

This function must return an object containing the same options given as parameter, which can have been updated. For example, you may specifiy a new appBuildUrl in the hook. Here's a description of the different options:

| Options          | Description                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `appBuildUrl`    | The url where the build can be retrieved. For example, `http://github.com/cozy/cozy-foo/archives/cozy-foo.tar.gz`          |
| `appSlug`        | The slug of the application, as defined in the manifest. Should not be mutated                                             |
| `appType`        | `webapp` or `konnector`                                                                                                    |
| `appVersion`     | App version, as defined in the manifest. Should not be mutated.                                                            |
| `buildCommit`    | sha of the commit, should not be mutated.                                                                                  |
| `registryUrl`    | URL of the Cozy registry, should not be mutated.                                                                           |
| `registryEditor` | Editor as it appears in the Cozy registry.                                                                                 |
| `registryToken`  | Registry Token. See [registry documentation](https://docs.cozy.io/en/cozy-stack/registry-publish/). Should not be mutated. |
| `spaceName`      | Space name in the Cozy registry.                                                                                           |

#### `--postpublish <script_path>`

Works exactly like the `prepublish` option, but will be executed after the publication.

#### Multiple hooks and built-in hooks

You can specify more than one hook by separating them with a `,`:

```
cozy-app-publish --prepublish <hook_name>,<other_hook_name>
```

Some hooks are shipped with cozy-app-publish and can be used by specifying their name:

```
cozy-app-publish --prepublish <builtin_hook_name>
```

##### Downcloud prepublish hook

```
cozy-app-publish --prepublish downcloud
```

This hook allows to upload the app to our downcloud server and sets the `appBuildUrl` accordingly.

In order to upload files to our downcloud server, you will need to generate a new pair of RSA keys, add the private key to your ssh-agent and make sure the corresponding public key is present on the downcloud server. Here's how to do it:

- Generate a new key pair with `ssh-keygen -t rsa -b 4096 -f id_rsa_downcloud_myapp -C downcloud_myapp_deploy`.
- Communicate the public key to someone who can deposit it on the downcloud server.
- If you're running things locally, you'll want to run `ssh-add id_rsa_downcloud_myapp` to add it to your ssh-agent.
- If you're planing to run this `cozy-app-publish` on Travis, you'll want to [encrypt that file first](https://docs.travis-ci.com/user/encrypting-files/#Automated-Encryption). Run `travis encrypt-file id_rsa_downcloud_myapp` and copy the output. This command also generates a `id_rsa_downcloud_myapp.enc`.
- To add the key to Travis's ssh-agent, add the following lines in the `before_install` section of your `.travis.yml`, but don't forget to paste the output of `travis encrypt-file` where it's needed.

```
- if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then PASTE_TRAVIS_ENCRYPT_OUTPUT_HERE; fi
- if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then eval "$(ssh-agent -s)"; fi
- if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then chmod 600 id_rsa_downcloud_myapp; fi
- if [ "$TRAVIS_SECURE_ENV_VARS" != "false" ]; then ssh-add id_rsa_downcloud_myapp; fi
```

- We recommend changing the path used for the private key. You can change the `-out` argument of the command output by `travis encrypt-file` and the corresponding path's in the commands above. `/tmp/id_rsa_downcloud_myapp` is a good place to store this key. You mays also change the `-in` argument of the same command, and change the path of the file `id_rsa_downcloud_myapp.enc` to whatever you want. We recomend using `./deploy/id_rsa_downcloud_myapp.enc` (don't forget to move the file as well!).
- Finally, **secure the private key**. If you're using Travis, the key is now stored by Travis so you should delete your local copy. If you're running things on your machine, make sure the private key doesn't end up in version control.

##### Mattermost postpublish hook

```
cozy-app-publish --postpublish mattermost
```

Sends a message to a mattermost channel to notify of the app's deployment. Requires the following options:

- `MATTERMOST_HOOK_URL`: You will need to set up a new [Incoming Hook](https://docs.mattermost.com/developer/webhooks-incoming.html).
- `MATTERMOST_CHANNEL`: (optional) The name of the channel messages will be posted to or else the
  default channel of the hook will be used

#### `--registry-url <url>`

The url of the registry, by default it will be <https://staging-apps-registry.cozycloud.cc>.

#### `--space <space-name>`

Use this options to provide a specific space name of the registry to publish the application in. By default it will be published in the default space.

#### `--verbose`

To print more logs when using tool (useful for debug).

### Recommended workflow

#### Day to day

- Development is done on feature branches that are merged into `master`,  once they are complete.
- Every time someone commits on `master`, a new archive is created and uploaded on Downcloud and then published to Cozy Cloud registry.

#### Release workflow

- A new release branch is created from the current state of `master`. Let's say we want to deploy version `1.0.0` of the app, we will create `release/1.0.0`.
- Since we created a new branch, we have to bump the version of `master`, so we have to create a PR to bump to `1.1.0` everywhere it is necessary. This depends on the app, but most of the time it requires to change the `package.json` and `manifest.webapp` versions.
- The only type of commits allowed on this release branch are bug fixes, that should be made on the release branch.
- To release a stable or beta version, generally we use directly github and the release creation interface. In this interface, don't forget to fill in the changelog and to check "prelease" for a beta version. The title of the release must be the released version (ex.: `1.40.0-beta.1`)
- Every time bugs are fixed and the version is considered for release, the latest commit is tagged with a prerelease version number, eg. `1.0.0-beta.1`, `1.0.0-beta.2`, etc…
- Each of these prereleases is automatically uploaded on downcloud and deployed on instances that are on the `beta` channel.
- Once the branch is deemed ready for release, the last commit is tagged with the final version — `1.0.0` in our example. It is then, again, uploaded on downcloud, published on the registry and deployed on specific instances as needed.
- The release branch is merged back into `master` so that all the bugfixes aren't lost.

### Versions

We apply the semver convention:

- If the release brings only bug fixes, then we should create a patch version.
- If the release brings at least one feature, then we should create a minor version.
- If the release changes its application's permissions, we should create a minor version even if this release is for bug fixes only.

### Hot Fix

If you need to quickly fix a bug in production, then you have to:

- fetch the latest branch release
- create a new release branch from there (since this is a bug fix, this is a patch version)
- fix the bug
- Make a beta
- Publish
- Merge it on master

Example: You have to hot fix Drive. The current `stable` version of Drive is : 1.45.0. Master is on 1.47.0.

- Then you need to fetch release/1.45.0
- Create a branch from this release: git checkout -b release/1.45.1
- git commit -m "fix: Bug fix.."
- git push
- git tag
  ...
