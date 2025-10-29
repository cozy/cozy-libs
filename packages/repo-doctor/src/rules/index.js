const { validate } = require('schema-utils')

const DepSameVersion = require('./depSameVersion')
const { DepUpToDate, NoForbiddenDep } = require('./dependencies')
const { LocalesInRepo } = require('./locales')
const { TravisIsOK } = require('./travis')

const ruleFns = {
  DepUpToDate,
  NoForbiddenDep,
  LocalesInRepo,
  TravisIsOK,
  DepSameVersion
}

/**
 * Instantiate rules according to config and CLI args
 */
const setupRules = (config, args) => {
  const rules = config.rules
    .map(rule => {
      let ruleName
      let ruleConfig
      if (Array.isArray(rule)) {
        ruleName = rule[0]
        ruleConfig = rule[1]
      } else if (rule) {
        ruleName = rule
        ruleConfig = {}
      }

      let Rule = ruleFns[ruleName]
      if (!Rule) {
        // eslint-disable-next-line no-console
        console.warn('Unknown rule', rule)
        return null
      }

      if (Rule.configSchema) {
        validate(Rule.configSchema, {}, ruleConfig)
      }

      return new Rule(ruleConfig, args)
    })
    .filter(Boolean)
  return rules
}

/**
 * Executes rules against a repository and yields rule results
 */
const runRules = async function* (repositoryInfo, rules) {
  for (const rule of rules) {
    const generator = rule.run(repositoryInfo)
    for await (const ruleResult of generator) {
      yield ruleResult
    }
  }
}

module.exports = {
  setupRules,
  runRules
}
