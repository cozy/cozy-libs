const bluebird = require('bluebird')
const keyBy = require('lodash/keyBy')
const semverDiff = require('semver-diff')

const { fetchDependencyInfo } = require('../fetch')

const severityByDiffType = {
  patch: 'info',
  minor: 'warn',
  major: 'error',
  undefined: 'success'
}

/**
 * Rule that checks if options.dependencies are up-to-date in the concerned
 * repository
 */
class DepUpToDate {
  constructor(config) {
    this.config = config
  }

  async *run(repositoryInfo) {
    const repDepsByName = keyBy(repositoryInfo.dependencies, dep => dep.name)

    const runForDep = async depName => {
      const depInfo = await fetchDependencyInfo(depName)
      const repDep = repDepsByName[depName]
      if (!repDep) {
        return
      }
      const diffType = semverDiff(
        repDep.version.replace('^', ''),
        depInfo.lastVersion
      )
      const severity = severityByDiffType[diffType]
      return {
        severity,
        type: 'dep-up-to-date',
        message: `${repDep.name}: ${repDep.version}, last is ${depInfo.lastVersion}`
      }
    }

    const results = await bluebird.map(this.config.dependencies, runForDep, {
      concurrency: 10
    })
    for (let result of results) {
      if (!result) {
        continue
      }
      yield result
    }
  }
}

DepUpToDate.configSchema = {
  name: 'DepUpToDate',
  type: 'object',
  properties: {
    dependencies: {
      type: 'array'
    }
  },
  additionalProperties: false
}

/**
 * Rules that warns if options.dependencies are present in the concerned
 * repository
 */
class NoForbiddenDep {
  constructor(config) {
    this.config = config
  }

  async *run(repositoryInfo) {
    for (let dep of repositoryInfo.dependencies) {
      const forbiddenDep = this.config.dependencies.find(
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
}

module.exports = { DepUpToDate, NoForbiddenDep }
