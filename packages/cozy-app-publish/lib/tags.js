const git = require('./git')
const fs = require('fs')

const getDevVersion = async (shortCommit, pkgVersion) => {
  return `${pkgVersion}-dev.${shortCommit}${Date.now()}`
}

const VERSION = String.raw`(?:v)?(\d+\.\d+\.\d+)`
const BETA = String.raw`-beta.(\d{1,4})`
const DEV = String.raw`-dev\.([a-z0-9]+)`
const COMPLETE = new RegExp(`^${VERSION}(?:${BETA})?(?:${DEV})?$`)

const parse = tag => {
  const match = tag.match(COMPLETE)
  if (!match) {
    return null
  } else {
    const version = match[1]
    const beta = match[2]
    const dev = match[3]
    if (beta && dev) {
      throw new Error(`Invalid tag ${tag}, beta and dev are present`)
    }
    const channel = dev ? 'dev' : beta ? 'beta' : 'stable'
    return {
      channel: channel,
      beta: beta ? parseInt(beta) : null,
      dev: dev || null,
      version, // 1.0.17
      fullVersion: `${version}${
        channel !== 'stable' ? `-${channel}.${beta || dev}` : ''
      }`, // 1.0.17-beta.2
      tag
    }
  }
}

const assertTagOK = (tagInfo, pkgVersion) => {
  if (!tagInfo.dev && tagInfo.version && tagInfo.version !== pkgVersion) {
    throw new Error(
      `The version number is different between package.json (${pkgVersion}) and tag (${
        tagInfo.version
      })`
    )
  }
}

const readPackage = () => {
  return JSON.parse(fs.readFileSync('package.json'))
}

/**
 * Returns the version to be published.
 * If no tag is present on the current commit, returns a dev version made
 * from the package.json version + commit + date.
 *
 * If it is not a dev version, it throws if the tag does not correspond
 * to the `pkgVersion`
 */
const getAutoVersion = async (shortCommit_, currentTags_) => {
  const pkg = readPackage()
  const pkgVersion = pkg.version
  const shortCommit = shortCommit_ || (await git.getShortCommit())
  const currentTags = currentTags_ || (await git.getCurrentTags())
  const tagInfos = currentTags.map(parse)
  const tagInfo =
    tagInfos.slice(-1)[0] || parse(await getDevVersion(shortCommit, pkgVersion))

  if (!tagInfo.dev) {
    assertTagOK(tagInfo, pkgVersion)
  }
  return tagInfo.fullVersion
}

const main = async () => {
  const version = await getAutoVersion()
  console.log(version)
}

if (require.main === module) {
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}

module.exports = {
  getAutoVersion,
  getDevVersion,
  parse
}
