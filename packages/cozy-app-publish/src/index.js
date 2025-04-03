const travisScript = require('./travis')
const githubActionsScript = require('./github-actions')
const manualScript = require('./manual')

module.exports = {
  gitbubActions: githubActionsScript,
  travis: travisScript,
  manual: manualScript
}
