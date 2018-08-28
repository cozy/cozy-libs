const runHooks = require('../utils/runhooks')
const spawn = require('cross-spawn')

/**
 * Returns only expected value, avoid data injection by hook
 */
const sanitize = options => {
  const {
    appBuildUrl,
    appSlug,
    appType,
    appVersion,
    buildCommit,
    registryUrl,
    registryEditor,
    registryToken,
    spaceName
  } = options

  return {
    appBuildUrl,
    appSlug,
    appType,
    appVersion,
    buildCommit,
    registryUrl,
    registryEditor,
    registryToken,
    spaceName
  }
}

const isRequiredFromManifest = manifestAttribute => [
  field => typeof field !== 'undefined',
  () => `Property ${manifestAttribute} must be defined in manifest.`
]

const isRequired = [
  field => typeof field !== 'undefined',
  key => `Option ${key} is required.`
]

const isOneOf = values => [
  field => values.includes(field),
  key => `${key} should be one of the following values: ${values.join(', ')}`
]

const optionsTypes = {
  appBuildUrl: [isRequired],
  appSlug: [isRequiredFromManifest('slug')],
  appType: [isRequiredFromManifest('type'), isOneOf(['webapp', 'konnector'])],
  appVersion: [isRequired],
  registryUrl: [isRequired],
  registryEditor: [isRequired],
  registryToken: [isRequired]
}

/**
 * Check if all expected options are defined
 */
const check = options => {
  for (const option in optionsTypes) {
    const validators = optionsTypes[option]
    validators.forEach(validator => {
      if (!validator[0](options[option])) {
        throw new Error(validator[1](option))
      }
    })
  }

  return options
}

const shasum = options => {
  const { appBuildUrl, verbose } = options
  // get the sha256 hash from the archive from the url
  const shaSumProcess = spawn.sync(
    'sh',
    ['-c', `curl -sSL --fail "${appBuildUrl}" | shasum -a 256 | cut -d" " -f1`],
    {
      stdio: verbose ? 'inherit' : 'pipe'
    }
  )
  // Note: if the Url don't return an archive or if 404 Not found,
  // the shasum will be the one of the error message from the curl command
  // so no error throwed here whatever the url is
  if (shaSumProcess.status !== 0) {
    throw new Error(
      `Error from archive shasum computing (${appBuildUrl}). Publishing failed.`
    )
  }
  // remove also the ending line break
  options.sha256Sum = shaSumProcess.stdout.toString().replace(/\r?\n|\r/g, '')
  return options
}

module.exports = async options =>
  shasum(
    check(sanitize(await runHooks(options.prepublishHook, 'pre', options)))
  )
