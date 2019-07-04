import simplifyConditions from '../utils/simplify-conditions'
import removeUnusedImports from '../utils/remove-unused-imports'
import replaceBooleanVars from '../utils/replace-boolean-vars'
import removeFalseJSXExpressionContainers from '../utils/remove-false-jsx-expression-containers'

const flagCallFinder = name => ({
  callee: { name: 'flag' },
  arguments: [{ value: name }]
})

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Replace flags by true
  const flagName =
    typeof process !== 'undefined' ? process.env.FLAG : 'reimbursement-tag'
  const flags = root.find(j.CallExpression, flagCallFinder(flagName))
  flags.forEach(flagCall => {
    flagCall.replace(j.literal(true))
  })

  replaceBooleanVars(root, j)
  simplifyConditions(root, j)
  removeUnusedImports(root, j)
  removeFalseJSXExpressionContainers(root, j)
  return root.toSource()
}
