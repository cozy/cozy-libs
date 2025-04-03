const path = require('path')
const getManifestAsObject = require('./utils/getManifestAsObject')
const tags = require('./tags')
const { getDevVersion } = require('./tags')
const publisher = require('./publisher')
const { getGithubActionsVariables } = require('./utils/getGithubActionsVariables')

const getAutoGithubActionsVersion = async ctx => {
  const tag = getRelevantTagGithubActions(ctx)
  const { GITHUB_SHA } = getGithubActionsVariables()
  if (tag) {
    return tag
  } else {
    const shortCommit = GITHUB_SHA.slice(0, 7)
    return await getDevVersion(ctx.appManifestObj.version, shortCommit)
  }
}

const getRelevantTagGithubActions = ctx => {
  const { GITHUB_REF_NAME, GITHUB_REF_TYPE } = getGithubActionsVariables()
  if (GITHUB_REF_TYPE === 'tag') {
    const parsed = tags.parse(GITHUB_REF_NAME)
    if (ctx.tagPrefix) {
      if (parsed.prefix === ctx.tagPrefix) {
        return GITHUB_REF_NAME
      }
    } else {
      return GITHUB_REF_NAME
    }
  }
}

const getAppBuildURLFromGithubActions = ctx => {
  const { GITHUB_REPOSITORY, GITHUB_SHA } = getGithubActionsVariables()
  const tag = getRelevantTagGithubActions(ctx)
  const buildUrl = ctx.buildUrl
  const buildCommit = ctx.buildCommit
  const githubUrl = `https://github.com/${GITHUB_REPOSITORY}/archive`
  const buildHash = buildCommit || GITHUB_SHA
  if (buildUrl) {
    return buildUrl
  } else if (!buildCommit && tag) {
    return `${githubUrl}/${tag}.tar.gz`
  } else {
    return `${githubUrl}/${buildHash}.tar.gz`
  }
}

const getGithubActionsRegistryToken = () => {
  const { REGISTRY_TOKEN } = getGithubActionsVariables()
  return REGISTRY_TOKEN
}

const getManifestGithubActions = ctx => {
  const { GITHUB_WORKSPACE } = getGithubActionsVariables()
  const p = path.join(GITHUB_WORKSPACE, ctx.buildDir)
  return getManifestAsObject(p)
}

const githubActionsPublish = publisher({
  getManifest: getManifestGithubActions,
  getAppBuildURL: getAppBuildURLFromGithubActions,
  getAppVersion: getAutoGithubActionsVersion,
  getRegistryToken: getGithubActionsRegistryToken,
  showConfirmation: false
})

module.exports = githubActionsPublish