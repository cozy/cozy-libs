const { simplifyConditions, replaceBooleanVars, jsx, imports } = require('..')

const flagCallFinder = name => ({
  callee: { name: 'flag' },
  arguments: [{ value: name }]
})

module.exports = function applyFlag(file, api, options) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Replace flags by true
  let flagName = options.flag
  if (!options.flag && process.env.NODE_ENV !== 'test') {
    throw new Error('You must pass --flag=your-flag')
  } else if (process.env.NODE_ENV === 'test') {
    flagName = 'test-flag'
  }

  const flags = root.find(j.CallExpression, flagCallFinder(flagName))
  flags.forEach(flagCall => {
    flagCall.replace(j.literal(true))
  })

  replaceBooleanVars(root)
  simplifyConditions(root)
  jsx.removeFalseExpressionContainers(root)
  jsx.removeRedundantExpressionContainers(root)
  imports.removeUnused(root)

  return root.toSource()
}

module.exports.description = 'Sets a flag to true in the code'
