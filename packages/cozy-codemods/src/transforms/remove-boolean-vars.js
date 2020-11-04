import { removeBooleanVars, simplifyConditions, imports } from '..'

export default function(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  removeBooleanVars(root, j)
  simplifyConditions(root, j)
  imports.removeUnused(root, j)

  return root.toSource()
}
