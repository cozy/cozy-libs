const semverDiff = require('semver-diff')

const severityByDiffType = {
  patch: 'info',
  minor: 'warn',
  major: 'error',
  undefined: 'success'
}

const checkDependencies = function*(repositoryInfo, { dependencyInfos }) {
  for (const dependency of repositoryInfo.dependencies) {
    const depInfo = dependencyInfos[dependency.name]
    const diffType = semverDiff(
      dependency.version.replace('^', ''),
      depInfo.lastVersion
    )
    const severity = severityByDiffType[diffType]
    yield {
      severity,
      type: 'depcheck',
      message: `${dependency.name}: ${dependency.version}, last is ${depInfo.lastVersion}`
    }
  }
}

module.exports = { checkDependencies }
