const semverDiff = require('semver-diff')
const { fetchDependencyInfo } = require('../fetch')

const severityByDiffType = {
  patch: 'info',
  minor: 'warn',
  major: 'error',
  undefined: 'success'
}

const depUpToDate = async function*(repositoryInfo) {
  for (const dependency of repositoryInfo.dependencies) {
    const depInfo = await fetchDependencyInfo(dependency.name)
    const diffType = semverDiff(
      dependency.version.replace('^', ''),
      depInfo.lastVersion
    )
    const severity = severityByDiffType[diffType]
    yield {
      severity,
      type: 'dep-up-to-date',
      message: `${dependency.name}: ${dependency.version}, last is ${depInfo.lastVersion}`
    }
  }
}

module.exports = { checkDependencies }
