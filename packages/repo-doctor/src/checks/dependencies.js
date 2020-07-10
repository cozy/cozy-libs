const semverDiff = require('semver-diff')
const { fetchDependencyInfo } = require('../fetch')
const { keyBy } = require('../toolbelt')

const severityByDiffType = {
  patch: 'info',
  minor: 'warn',
  major: 'error',
  undefined: 'success'
}

/**
 * Returns a function that will check if options.dependencies are
 * up-to-date in the concerned repository
 */
const depUpToDate = options =>
  async function*(repositoryInfo) {
    const repDepsByName = keyBy(repositoryInfo.dependencies, dep => dep.name)

    for (const depName of options.dependencies) {
      const depInfo = await fetchDependencyInfo(depName)
      const repDep = repDepsByName[depName]
      if (!repDep) {
        continue
      }
      const diffType = semverDiff(
        repDep.version.replace('^', ''),
        depInfo.lastVersion
      )
      const severity = severityByDiffType[diffType]
      yield {
        severity,
        type: 'dep-up-to-date',
        message: `${repDep.name}: ${repDep.version}, last is ${depInfo.lastVersion}`
      }
    }
  }

/**
 * Returns a function that will warn if options.dependencies are
 * are present in the concerned repository
 */
const noForbiddenDep = options =>
  async function*(repositoryInfo) {
    for (let dep of repositoryInfo.dependencies) {
      const forbiddenDep = options.dependencies.find(
        optionDep => optionDep.name == dep.name
      )
      if (forbiddenDep) {
        yield {
          severity: 'warn',
          type: 'forbidden-dep',
          message: `${dep.name} is forbidden (reason: ${forbiddenDep.reason})`
        }
      }
    }
  }

module.exports = { depUpToDate, noForbiddenDep }
