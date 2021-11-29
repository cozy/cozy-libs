const { removeBooleanVars, simplifyConditions, imports } = require('..')

module.exports = function (file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeBooleanVars(root, j)
  simplifyConditions(root, j)
  imports.removeUnused(root, j)

  return root.toSource()
}

module.exports.description = 'Simplify boolean vars'
