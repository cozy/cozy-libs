import simplifyConditions from '../utils/simplify-conditions'
import removeUnusedImports from '../utils/remove-unused-imports'
import replaceBooleanVars from '../utils/replace-boolean-vars'

export default function removeBooleanVars(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  replaceBooleanVars(root, j)
  simplifyConditions(root, j)
  removeUnusedImports(root, j)

  return root.toSource()
}
