const path = require('path')
const getManifestAsObject = require('../utils/getManifestAsObject')
const getTravisVariables = require('../utils/getTravisVariables')
const { getDevVersion } = require('./tags')
const publisher = require('./publisher')

const getAutoTravisVersion = async ctx => {
  const { TRAVIS_TAG, TRAVIS_COMMIT } = getTravisVariables()
  if (TRAVIS_TAG) {
    return TRAVIS_TAG
  } else {
    const shortCommit = TRAVIS_COMMIT.slice(0, 7)
    return await getDevVersion(shortCommit, ctx.appManifestObj.version)
  }
}

const getAppBuildURLFromTravis = ctx => {
  const { TRAVIS_TAG, TRAVIS_COMMIT, TRAVIS_REPO_SLUG } = getTravisVariables()
  // get archive url from github repo
  // FIXME push directly the archive to the registry
  // for now, the registry needs an external URL
  let appBuildUrl = ''
  const buildUrl = ctx.buildUrl
  const buildCommit = ctx.buildCommit
  const githubUrl = `https://github.com/${TRAVIS_REPO_SLUG}/archive`
  const buildHash = buildCommit || TRAVIS_COMMIT
  if (buildUrl) {
    appBuildUrl = buildUrl
  } else if (!buildCommit && TRAVIS_TAG) {
    // if we use --build-commit => we are not on the build branch
    // so we can't use this branch tag directly for the url
    // if not, we suppose that we are on the build tagged branch here
    appBuildUrl = `${githubUrl}/${TRAVIS_TAG}.tar.gz`
  } else {
    appBuildUrl = `${githubUrl}/${buildHash}.tar.gz`
  }
  return appBuildUrl
}

const getTravisRegistryToken = () => {
  const { REGISTRY_TOKEN } = getTravisVariables()
  return REGISTRY_TOKEN
}

const getManifestTravis = ctx => {
  const { TRAVIS_BUILD_DIR } = getTravisVariables()
  const p = path.join(TRAVIS_BUILD_DIR, ctx.buildDir)
  return getManifestAsObject(p)
}

const travisPublish = publisher({
  getManifest: getManifestTravis,
  getAppBuildURL: getAppBuildURLFromTravis,
  getAppVersion: getAutoTravisVersion,
  getRegistryToken: getTravisRegistryToken,
  showConfirmation: false
})

module.exports = travisPublish
