/**
 * Removes unused imports from a file.
 *
 * Example:
 *
 * ```
 * import React from 'react'
 * import App from './App'
 * import Toto from './Toto'
 *
 * <App />
 * ```
 *
 * - React is used because of the JSX
 * - App is used via JSX
 * - Toto is unused, the import will be removed
 *
 * ```
 * import React from 'react'
 * import App from './App'
 *
 * <App />
 * ```
 */
import { imports } from '..'

export default function removeUnusedImportsTransform(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  imports.removeUnused(root)
  return root.toSource()
}
