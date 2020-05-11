const makeRemoveImportIfUnused = require('./remove-import-if-unused')

/* eslint new-cap: 0 */

module.exports = function(j) {
  const strip = s => s.replace(/^[\s\n]+/g, '').replace(/[\s\n]+$/g, '')

  const isJsxElementOfClass = (element, klass) => {
    return element.openingElement && element.openingElement.name.name === klass
  }

  const addJsxAttribute = (element, name, value) => {
    element.openingElement.attributes.push(
      new j.jsxAttribute(new j.jsxIdentifier(name), maybeWrap(value))
    )
  }

  const getAttributeName = x => x && x.name && x.name.name
  const getAttributeValue = x => x && x.value && x.value.value

  const maybeWrap = x => {
    if (x.type === 'Literal') {
      return new j.literal(strip(x.value))
    }
    if (x.type === 'JSXExpressionContainer') {
      return x
    }
    return new j.jsxExpressionContainer(x)
  }

  const emptyTextNode = x => {
    return x.type === 'Literal' && strip(x.value).length === 0
  }

  const removeDefaultExportHOC = (
    root,
    ComponentName,
    hocName,
    noOptionsHOC
  ) => {
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

  const isSameSpec = (eSpec, spec) => {
    return eSpec.imported && eSpec.imported.name == spec.imported.name
  }

  const mergeSpecifiersToImport = (importDeclaration, specifiers) => {
    for (const spec of specifiers) {
      if (importDeclaration.specifiers.find(eSpec => isSameSpec(eSpec, spec))) {
        continue
      } else {
        importDeclaration.specifiers.push(spec)
      }
    }
  }

  const addImport = (root, specifierObj, sourceOrFilter, maybeSource) => {
    const source = maybeSource || sourceOrFilter
    const filter = maybeSource ? sourceOrFilter : null

    const specifiers = Object.entries(specifierObj).map(([k, v]) => {
      return k === 'default'
        ? j.importDefaultSpecifier(j.identifier(v))
        : j.importSpecifier(j.identifier(k))
    })

    const matchingImports = root.find(
      j.ImportDeclaration,
      filter
        ? filter
        : {
            source: {
              value: source
            }
          }
    )

    if (matchingImports.length > 0) {
      mergeSpecifiersToImport(matchingImports.get(0).node, specifiers)
    } else {
      const imports = root.find(j.ImportDeclaration)
      const decl = j.importDeclaration(specifiers, j.literal(source))
      imports.at(-1).insertAfter(decl)
    }
  }

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

  return {
    nodes: {
      isEmptyText: emptyTextNode
    },
    jsx: {
      elementOfClass: isJsxElementOfClass,
      addAttribute: addJsxAttribute,
      maybeWrap: maybeWrap,
      getAttributeValue,
      getAttributeName
    },
    hoc: {
      removeDefaultExportHOC,
      removeHOC
    },
    imports: {
      add: addImport,
      removeUnused: makeRemoveImportIfUnused(j)
    },
    simplifyCompose
  }
}
