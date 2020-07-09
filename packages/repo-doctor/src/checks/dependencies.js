const semverDiff = require('semver-diff')

const severityByDiffType = {
  'patch': 'info',
  'minor': 'warn',
  'major': 'error'
}

const checkDependencies = function * (repositoryInfo, { dependencyInfos }) {
  for (const dependency of repositoryInfo.dependencies) {
    const depInfo = dependencyInfos[dependency.name]
    if (!depInfo.lastVersion) {
      console.log(`No version for ${dependencyName}`)
      continue
    }
    if (!dependency.version) {
      console.log(`No version for ${dependencyName}`)
      continue
    }
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
