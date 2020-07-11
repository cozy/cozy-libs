const { depUpToDate, noForbiddenDep } = require('./dependencies')
const { localesInRepo } = require('./locales')

const checkFns = { depUpToDate, noForbiddenDep, localesInRepo }

/**
 * Instantiate rules according to config and CLI args
 */
const setupChecks = (config, args) => {
  const checks = config.rules.map(rule => {
    let ruleName
    let options
    if (Array.isArray(rule)) {
      ruleName = rule[0]
      options = rule[1]
    } else {
      ruleName = rule
      options = {}
    }
    const checkFn = checkFns[ruleName]
    return checkFn(options, args)
  })
  return checks
}

/**
 * Yields checkResults
 */
const runChecks = async function*(repositoryInfo, checks) {
  for (const check of checks) {
    for await (const checkResult of check(repositoryInfo)) {
      yield checkResult
    }
  }
}

module.exports = {
  setupChecks,
  runChecks
}
