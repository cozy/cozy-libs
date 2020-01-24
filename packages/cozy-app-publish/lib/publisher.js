const postpublish = require('./postpublish')
const prepublish = require('./prepublish')
const publish = require('./publish')
const colorize = require('../utils/colorize')
const constants = require('./constants')
const promptConfirm = require('./confirm')
const defaults = require('lodash/defaults')

const {
  DEFAULT_REGISTRY_URL,
  DEFAULT_BUILD_DIR,
  DEFAULT_SPACE_NAME
} = constants

const publisher = ({
  getManifest,
  getAppVersion,
  showConfirmation,
  getAppBuildURL,
  getRegistryToken
}) => async ctx => {
  ctx = { ...ctx }

  defaults(ctx, {
    buildDir: DEFAULT_BUILD_DIR,
    registryUrl: DEFAULT_REGISTRY_URL,
    registryToken: getRegistryToken ? getRegistryToken() : undefined,
    spaceName: DEFAULT_SPACE_NAME
  })

  const {
    buildDir,
    buildCommit,
    postpublishHook,
    prepublishHook,
    registryToken,
    registryUrl,
    spaceName,
    yes
  } = ctx

  // registry editor token (required)
  if (!registryToken) {
    throw new Error('Registry token is missing. Publishing failed.')
  }

  // application manifest (required)
  const appManifestObj = getManifest(ctx)
  ctx.appManifestObj = appManifestObj

  // registry editor (required)
  const registryEditor = appManifestObj.editor
  if (!registryEditor) {
    throw new Error(
      'Registry editor is missing in the manifest. Publishing failed.'
    )
  }

  // other variables
  const appSlug = appManifestObj.slug
  const appType = appManifestObj.type || 'webapp'

  // get application version to publish
  const appVersion = await getAppVersion(ctx)
  const appBuildUrl = getAppBuildURL ? getAppBuildURL(ctx) : ctx.appBuildUrl

  let publishOptions
  try {
    publishOptions = await prepublish({
      buildDir,
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
  } catch (error) {
    throw new Error(`Prepublish failed: ${error.message}`)
  }

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

  if (showConfirmation && !yes) {
    const goFurther = await promptConfirm(
      'Are you sure you want to publish this application above?'
    )
    if (!goFurther) {
      console.log('Publishing cancelled')
      return
    }
  }

  try {
    await publish(publishOptions)
  } catch (error) {
    throw new Error(`Publish failed: ${error.message}`)
  }

  try {
    await postpublish({ ...publishOptions, postpublishHook })
  } catch (error) {
    throw new Error(`Postpublish hooks failed: ${error.message}`)
  }
}

module.exports = publisher
