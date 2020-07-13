const { DepUpToDate, NoForbiddenDep } = require('./dependencies')
const { LocalesInRepo } = require('./locales')
const validate = require('schema-utils')

const ruleFns = { DepUpToDate, NoForbiddenDep, LocalesInRepo }

/**
 * Instantiate rules according to config and CLI args
 */
const setupRules = (config, args) => {
  const rules = config.rules.map(rule => {
    let ruleName
    let ruleConfig
    if (Array.isArray(rule)) {
      ruleName = rule[0]
      ruleConfig = rule[1]
    } else {
      ruleName = rule
      ruleConfig = {}
    }
    let ruleFn = ruleFns[ruleName]

    if (ruleFn.configSchema) {
      validate(ruleFn.configSchema, {}, ruleConfig)
    }

    return ruleFn.prototype
      ? new ruleFn(ruleConfig, args)
      : ruleFn(ruleConfig, args)
  })
  return rules
}

/**
 * Yields ruleResults
 */
const runRules = async function*(repositoryInfo, rules) {
  for (const rule of rules) {
    const generator =
      rule.constructor && rule.constructor.prototype.run
        ? rule.run(repositoryInfo)
        : rule(repositoryInfo)
    for await (const ruleResult of generator) {
      yield ruleResult
    }
  }
}

module.exports = {
  setupRules,
  runRules
}
