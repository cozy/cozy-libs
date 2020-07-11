const { depUpToDate, noForbiddenDep } = require('./dependencies')
const { localesInRepo } = require('./locales')

const ruleFns = { depUpToDate, noForbiddenDep, localesInRepo }

/**
 * Instantiate rules according to config and CLI args
 */
const setupRules = (config, args) => {
  const rules = config.rules.map(rule => {
    let ruleName
    let options
    if (Array.isArray(rule)) {
      ruleName = rule[0]
      options = rule[1]
    } else {
      ruleName = rule
      options = {}
    }
    const ruleFn = ruleFns[ruleName]
    return ruleFn(options, args)
  })
  return rules
}

/**
 * Yields ruleResults
 */
const runRules = async function*(repositoryInfo, rules) {
  for (const rule of rules) {
    for await (const ruleResult of rule(repositoryInfo)) {
      yield ruleResult
    }
  }
}

module.exports = {
  setupRules,
  runRules
}
