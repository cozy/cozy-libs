const j = require('jscodeshift')

const findNearest = require('./find-nearest')
const imports = require('./imports')

/**
 * Before
 *
 * compose(onlyOneFunction)()
 *
 * After
 *
 * onlyOneFunction()
 *
 */
const simplifyCompose = root => {
  root
    .find(j.CallExpression, {
      callee: {
        callee: {
          name: 'compose'
        }
      }
    })
    .forEach(path => {
      if (path.node.callee.arguments.length === 1) {
        path.node.callee = path.node.callee.arguments[0]
      }
    })
}

const removeHOC = (arrowFunctionBodyPath, hocName, noOptionsHOC) => {
  let curPath = arrowFunctionBodyPath
  while (curPath) {
    const curNode = curPath.node
    if (
      (!noOptionsHOC &&
        curNode.type === 'CallExpression' &&
        curNode.callee.callee &&
        curNode.callee.callee.name === hocName) ||
      (noOptionsHOC &&
        curNode.type === 'CallExpression' &&
        curNode.callee &&
        curNode.callee.name === hocName)
    ) {
      const component = curPath.parentPath.node.arguments[0]
      curPath.parentPath.replace(component)
      break
    }
    curPath = curPath.parentPath
  }
}

const removeDefaultExportHOC = (root, ComponentName, hocName, noOptionsHOC) => {
  const defaultExports = root.find(j.ExportDefaultDeclaration)
  if (!defaultExports.length) {
    return
  }
  const defaultExport = defaultExports.get(0)
  const decl = defaultExport.node.declaration
  if (decl.type !== 'CallExpression') {
    return
  } else if (
    (!noOptionsHOC &&
      decl.callee &&
      decl.callee.callee &&
      decl.callee.callee.name == hocName &&
      decl.arguments[0].name == ComponentName) ||
    (noOptionsHOC &&
      decl.callee &&
      decl.callee &&
      decl.callee.name == hocName &&
      decl.arguments[0].name == ComponentName)
  ) {
    defaultExport.node.declaration = decl.arguments[0]
  } else if (
    decl.callee &&
    decl.callee.callee &&
    decl.callee.callee.name == 'compose' &&
    decl.arguments[0].name == ComponentName
  ) {
    decl.callee.arguments = decl.callee.arguments.filter(node => {
      if (node.callee) {
        // hoc with options called in compose like compose(hoc())
        return node.callee.name !== hocName
      } else if (node.name) {
        // hoc without options called in compose like compose(hoc)
        return node.name !== hocName
      } else {
        return true
      }
    })
  }
}

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
const hocToHookReplacer = options => {
  const {
    propsFinder,
    propsFilter,
    hookUsage,
    hocName,
    importOptions,
    noOptionsHOC
  } = options

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

    removeHOC(arrowFunctionBodyPath, hocName, noOptionsHOC)

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
        removeHOC(path, hocName)
      })

    removeDefaultExportHOC(root, ComponentName, hocName, noOptionsHOC)
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
      imports.ensure(
        root,
        importOptions.specifiers,
        importOptions.filter,
        importOptions.package
      )
      simplifyCompose(root)
      imports.removeUnused(root)
      return root
    } else {
      return root
    }
  }
}

module.exports = {
  simplifyCompose,
  removeDefaultExportHOC,
  hocToHookReplacer
}
