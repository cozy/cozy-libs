const findNearest = require('./find-nearest')
const makeUtils = require('./utils')

const prepend = (arr, item) => {
  arr.splice(0, 0, item)
}

const findPropObjectPattern = (j, functionBodyPath) => {
  const functionBody = functionBodyPath.node
  const propsArg = functionBody.params[0]
  const propObjPattern =
    propsArg && propsArg.type === 'ObjectPattern' ? propsArg : null
  if (propObjPattern) {
    return { objPattern: propObjPattern, from: 'params' }
  }

  const bodyPropsDeclarators = j(functionBodyPath).find(j.VariableDeclarator, {
    init: {
      name: 'props'
    }
  })
  const bodyPropsDeclarator =
    bodyPropsDeclarators.length > 0 ? bodyPropsDeclarators.get(0) : 0

  if (
    bodyPropsDeclarator &&
    bodyPropsDeclarator.node.id.type === 'ObjectPattern'
  ) {
    return {
      objPattern: bodyPropsDeclarator.node.id,
      from: 'body',
      declarator: bodyPropsDeclarator
    }
  }
}

/**
 * Creates a function that can replace a HOC with a hook.
 *
 * Before:
 *
 * ```
 * const Component = ({ client }) => { ... }
 * export default withClient(Component)
 * ```
 *
 * After:
 *
 * ```
 * const Component = () => {
 *   const client = useClient()
 *   ...
 * }
 *
 * export default Component
 * ```
 *
 * Supports `compose`.
 *
 * @example
 * See example in cozy-client/codemods/use-client.js
 */
const hocReplacer = options => {
  const {
    propsFinder,
    propsFilter,
    hookUsage,
    hocName,
    importOptions,
    j
  } = options
  const utils = makeUtils(j)

  const replacer = (root, arrowFunctionBodyPath) => {
    const arrowFunctionBody = arrowFunctionBodyPath.node
    const objPattern = findPropObjectPattern(j, arrowFunctionBodyPath)
    if (!objPattern) {
      return
    }

    const {
      objPattern: propObjPattern,
      from: objPatternOrigin,
      declarator: objPatternDeclarator
    } = objPattern

    const hocProps = propsFinder(propObjPattern)

    if (!hocProps || !hocProps.length) {
      return
    }

    if (!arrowFunctionBody.body.body || !arrowFunctionBody.body.body.splice) {
      arrowFunctionBody.body = j.blockStatement([
        j.returnStatement(arrowFunctionBody.body)
      ])
    }

    const updatedProperties = propObjPattern.properties.filter(
      prop => !propsFilter(prop)
    )

    if (
      updatedProperties.length === 0 &&
      arrowFunctionBody.params.length === 1 &&
      objPatternOrigin === 'params'
    ) {
      arrowFunctionBody.params = []
    } else if (objPatternOrigin === 'params') {
      arrowFunctionBody.params[0].properties = updatedProperties
    } else if (updatedProperties.length > 0 && objPatternOrigin === 'body') {
      objPatternDeclarator.node.id.properties = updatedProperties
    } else if (updatedProperties === 0 && objPatternOrigin === 'body') {
      objPatternDeclarator.prune()
    }

    prepend(
      arrowFunctionBody.body.body,
      typeof hookUsage === 'function' ? hookUsage(hocProps) : hookUsage
    )
    utils.hoc.removeHOC(arrowFunctionBodyPath, hocName)

    const declarator = findNearest(
      arrowFunctionBodyPath,
      x => x.node.type === 'VariableDeclarator'
    )
    const ComponentName = declarator.node.id.name
    j(declarator)
      .closestScope()
      .find(j.Identifier, {
        name: ComponentName
      })
      .forEach(path => {
        utils.hoc.removeHOC(path, hocName)
      })

    utils.hoc.removeDefaultExportHOC(root, ComponentName, hocName)
    return true
  }

  return root => {
    const components = root.find(j.ArrowFunctionExpression)

    let needToAddImport = false
    components.forEach(path => {
      if (replacer(root, path)) {
        needToAddImport = true
      }
    })

    if (needToAddImport) {
      utils.imports.add(
        root,
        importOptions.specifiers,
        importOptions.filter,
        importOptions.package
      )
      utils.simplifyCompose(root)
      utils.imports.removeUnused(root)
      return root.toSource()
    }
  }
}

module.exports = hocReplacer
