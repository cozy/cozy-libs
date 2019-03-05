const path = require('path')
const fs = require('fs-extra')
const postpublish = require('./postpublish')
const prepublish = require('./prepublish')
const publish = require('./publish')
const colorize = require('../utils/colorize')
const getManifestAsObject = require('../utils/getManifestAsObject')
const constants = require('./constants')
const tags = require('./tags')
const promptConfirm = require('./confirm')

const { DEFAULT_REGISTRY_URL, DEFAULT_BUILD_DIR } = constants



async function manualPublish(
  {
    buildCommit,
    postpublishHook,
    prepublishHook,
    registryToken,
    buildDir = DEFAULT_BUILD_DIR,
    manualVersion,
    registryUrl = DEFAULT_REGISTRY_URL,
    spaceName,
    appBuildUrl
  },
  override
) {
  // registry editor token (required)
  if (!registryToken) {
    throw new Error('Registry token is missing. Publishing failed.')
  }

  // application manifest (required)
  const appManifestObj = getManifestAsObject(
    path.join(fs.realpathSync(process.cwd()), buildDir)
  )

  // registry editor (required)
  const registryEditor = appManifestObj.editor
  if (!registryEditor) {
    throw new Error(
      'Registry editor is missing in the manifest. Publishing failed.'
    )
  }

  // get application version to publish
  let autoVersion
  if (!manualVersion) {
    autoVersion = await tags.getAutoVersion()
  }
  const appVersion = manualVersion || autoVersion || appManifestObj.version

  // other variables
  const appSlug = appManifestObj.slug
  const appType = appManifestObj.type || 'webapp'

  const publishOptions = await prepublish({
    buildCommit,
    prepublishHook,
    registryUrl,
    registryEditor,
    registryToken,
    spaceName,
    appSlug,
    appVersion,
    appBuildUrl,
    appType
  })

  // ready publish the application on the registry
  console.log(
    `Attempting to publish ${colorize.bold(
      publishOptions.appSlug
    )} (version ${colorize.bold(
      publishOptions.appVersion
    )}) from ${colorize.bold(
      publishOptions.appBuildUrl
    )} (sha256 ${colorize.bold(publishOptions.sha256Sum)}) to ${colorize.bold(
      publishOptions.registryUrl
    )} (space: ${publishOptions.spaceName || 'default one'})`
  )
  console.log()

  if (!override) {
    const goFurther = await promptConfirm('Are you sure you want to publish this application above?')
    if (!goFurther) {
      console.log('Publishing cancelled')
      return
    }
  }

  try {
    await publish(publishOptions)
  } catch (e) {
    const errorMessage = '↳ ❌  Publishing failed. Publishing aborted.'
    console.error(e)
    console.error(errorMessage)
  }

  try {
    await postpublish({ ...publishOptions, postpublishHook })
  } catch (error) {
    console.error(`↳ ⚠️  Postpublish hooks failed: ${error.message}`)
  }
}

const manualPublishCLI = function() {
  return manualPublish.apply(this, arguments).catch(e => {
    console.error(e)
    console.error(e.message)
    process.exit(1)
  })
}

manualPublishCLI.manualPublish = manualPublish

module.exports = manualPublishCLI
