const keyBy = require('lodash/keyBy')

/**
 * Rule that checks if groups of dependencies are at the same version.
 * Useful for dependencies from a monorepo.
 */
class DepSameVersion {
  constructor(config) {
    this.config = config
  }

  async *run(repositoryInfo) {
    const repDepsByName = keyBy(repositoryInfo.dependencies, dep => dep.name)
    for (let depGroup of this.config.dependencyGroups) {
      const repoDeps = depGroup
        .map(depName => repDepsByName[depName])
        .filter(Boolean)
      const versions = repoDeps.map(depInfo => {
        return depInfo ? depInfo.version : null
      })
      const notSameVersion =
        versions.slice(1).filter(x => x !== versions[0]).length > 0
      if (notSameVersion) {
        yield {
          severity: 'warn',
          type: 'DepSameVersion',
          message: `Different versions for ${repoDeps
            .map(r => `${r.name}@${r.version}`)
            .join(', ')}`
        }
      }
    }
  }
}

DepSameVersion.configSchema = {
  name: 'DepSameVersion',
  type: 'object',
  properties: {
    dependencyGroups: {
      type: 'array'
    }
  },
  additionalProperties: false
}

module.exports = DepSameVersion
