const j = require('jscodeshift')
const flatten = require('lodash/flatten')
const groupBy = require('lodash/groupBy')
const remove = require('lodash/remove')

const isSameSpec = (eSpec, spec) => {
  if (eSpec.imported) {
    return eSpec.imported.name == spec.imported.name
  } else if (eSpec.local && spec.local) {
    return eSpec.local.name == spec.local.name
  }
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

const ensure = (root, specifierObj, sourceOrFilter, maybeSource) => {
  if (!specifierObj) {
    // eslint-disable-next-line no-console
    console.warn(`Example usage of imports.add:

imports.add(root, {
  default: 'MagnifierIcon'
}, 'cozy-ui/transpiled/react/Icons/Magnifier')`)
    throw new Error('Invalid usage of imports.add')
  }
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
    if (imports.length > 0) {
      imports.at(-1).insertAfter(decl)
    } else {
      root.find('Program').forEach(path => {
        path.node.body.unshift(decl)
      })
    }
  }
}

const removeUnused = root => {
  const removeIfUnused = (importSpecifier, importDeclaration) => {
    if (!importSpecifier.value.local) {
      return
    }
    const varName = importSpecifier.value.local.name
    if (varName === 'React') {
      return false
    }

    const isUsedInScopes = () => {
      return (
        j(importDeclaration)
          .closestScope()
          .find(j.Identifier, { name: varName })
          .filter(p => {
            if (p.value.start === importSpecifier.value.local.start)
              return false
            if (p.parentPath.value.type === 'Property' && p.name === 'key')
              return false
            if (p.name === 'property') return false
            return true
          })
          .size() > 0
      )
    }

    // Caveat, this doesn't work with annonymously exported class declarations.
    const isUsedInDecorators = () => {
      // one could probably cache these, but I'm lazy.
      let used = false
      root.find(j.ClassDeclaration).forEach(klass => {
        used =
          used ||
          (klass.node.decorators &&
            j(klass.node.decorators)
              .find(j.Identifier, { name: varName })
              .filter(p => {
                if (p.parentPath.value.type === 'Property' && p.name === 'key')
                  return false
                if (p.name === 'property') return false
                return true
              })
              .size() > 0)
      })
      return used
    }

    if (!(isUsedInScopes() || isUsedInDecorators())) {
      j(importSpecifier).remove()
      return true
    }
    return false
  }

  const removeUnusedDefaultImport = importDeclaration => {
    return (
      j(importDeclaration)
        .find(j.ImportDefaultSpecifier)
        .filter(s => removeIfUnused(s, importDeclaration))
        .size() > 0
    )
  }

  const removeUnusedNonDefaultImports = importDeclaration => {
    return (
      j(importDeclaration)
        .find(j.ImportSpecifier)
        .filter(s => removeIfUnused(s, importDeclaration))
        .size() > 0
    )
  }

  // Return True if somethin was transformed.
  const processImportDeclaration = importDeclaration => {
    // e.g. import 'styles.css'; // please Don't Touch these imports!
    if (importDeclaration.value.specifiers.length === 0) return false

    const hadUnusedDefaultImport = removeUnusedDefaultImport(importDeclaration)
    const hadUnusedNonDefaultImports =
      removeUnusedNonDefaultImports(importDeclaration)

    if (importDeclaration.value.specifiers.length === 0) {
      j(importDeclaration).remove()
      return true
    }
    return hadUnusedDefaultImport || hadUnusedNonDefaultImports
  }

  root.find(j.ImportDeclaration).forEach(processImportDeclaration)
}

/**
 * Merge imports with the same source.
 *
 * @param  {Object} j - The jscodeshift API
 * @param  {Object} root - The jscodeshift root node
 *
 * @example
 * Before:
 *
 * ```
 * import { A } from 'my-package'
 * import { B } from 'my-package'
 * ```
 *
 * After:
 *
 * ```
 * import { A, B } from 'my-package'
 * ```
 */
const mergeImports = root => {
  const imports = root.find(j.ImportDeclaration).paths()
  const groupedBySource = groupBy(imports, path => path.node.source.value)
  for (const group of Object.values(groupedBySource)) {
    if (group.length === 1) {
      continue
    }
    const specifiers = flatten(group.map(x => x.node.specifiers))
    group[0].replace(j.importDeclaration(specifiers, group[0].node.source))
    for (let toRemove of group.slice(1)) {
      toRemove.prune()
    }
  }
}

/**
 * Transform import statements so that they match paths passed in options.
 *
 * @param  {Object} j - The jscodeshift API
 * @param  {Object} root - The jscodeshift root node
 * @param  {Object} options
 *
 * @example
 *
 * ```jsx
 * // See https://github.com/facebook/jscodeshift
 * transformImports(j, root, {
 *   imports: {
 *     Dialog: {
 *       importPath: 'cozy-ui/transpiled/react/Dialog',
 *       defaultImport: true
 *     },
 *     DialogFile: {
 *       importPath: 'cozy-ui/transpiled/react/Dialog',
 *       defaultImport: false
 *     },
 *     DialogContent: {
 *       importPath: 'cozy-ui/transpiled/react/Dialog',
 *       defaultImport: false
 *     }
 *   }
 * })
 * ```
 *
 * Before:
 *
 * ```
 * import DialogFile from 'cozy-ui/transpiled/react/DialogFile'
 * import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
 * import Dialog from 'cozy-ui/transpiled/react/Dialog'
 * ```
 *
 * After:
 *
 * ```
 * import Dialog, { DialogFile, DialogContent } from "cozy-ui/transpiled/react/Dialog";
 * ```
 */
const simplify = (root, options) => {
  const imports = options.imports
  const identifiers = Object.keys(imports)
  root.find(j.ImportDeclaration).forEach(path => {
    const specifiers = path.node.specifiers
    if (!specifiers || !specifiers.length) {
      return
    }
    for (let i = specifiers.length - 1; i >= 0; i--) {
      const specifier = specifiers[i]
      const found = identifiers.find(id => id === specifier.local.name)
      if (found) {
        const importSpec = imports[found]
        specifiers.splice(i, 1)
        path.insertAfter(
          j.importDeclaration(
            [
              importSpec.defaultImport
                ? j.importDefaultSpecifier(j.identifier(found))
                : j.importSpecifier(j.identifier(found))
            ],
            j.literal(importSpec.importPath)
          )
        )
      }
    }

    if (specifiers.length === 0) {
      path.prune()
    }
  })
  mergeImports(root)
}

const getAttributeName = attribute => attribute?.name?.name

const getAttributeValue = attribute => attribute?.value?.expression?.value

const getAttributeByName = ({ attributes, name }) =>
  attributes.find(attribute => getAttributeName(attribute) === name)

const makeAttribute = ({ name, value }) =>
  j.jsxAttribute(j.jsxIdentifier(name), j.literal(value))

const renameAttributeByName = ({ oldName, newName, attributes }) => {
  const attrToRename = getAttributeByName({ name: oldName, attributes })
  if (attrToRename) {
    attrToRename.name.name = newName
  }
}

/**
 * Make an JSXElement easily with different options
 *
 * @param {object} param
 * @param {string} param.name - Name of the element
 * @param {object[]} [param.attributes] - Attributes of the element
 * @param {object[]} [param.children] - Children of the element
 * @param {boolean} [param.autoClose] - If the element should auto close
 * @returns {namedTypes.JSXElement}
 */
const makeJSXElement = ({
  name,
  attributes = [],
  children = [],
  autoClose = true
}) => {
  if (autoClose && children.length === 0) {
    return j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier(name), attributes, true)
    )
  }

  return j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier(name), attributes),
    j.jsxClosingElement(j.jsxIdentifier(name)),
    children
  )
}

/**
 *
 * @param {*} attribute
 * @returns
 */
const getAttributeProperties = attribute =>
  attribute.value.expression.properties

/**
 * Move the property from an attribute into an other
 *
 * @param {obejct} param
 * @param {object[]} param.attributes - Attributes of the element
 * @param {} param.attributeName - Name of attribute to move
 * @param {} param.targetAttributeName - Name of target attribute where the property will be moved
 * @param {} param.propertyName - Name of the property inserted in the target attribute
 */
const moveAttributeIntoProperty = ({
  attributes,
  attributeName,
  targetAttributeName,
  propertyName
}) => {
  const attribute = getAttributeByName({
    attributes,
    name: attributeName
  })

  if (attribute) {
    const properties = getAttributeProperties(attribute)
    const newProperty = j.property(
      'init',
      j.identifier(propertyName),
      j.objectExpression(properties)
    )
    const nextAttribute = getAttributeByName({
      attributes,
      name: targetAttributeName
    })
    if (nextAttribute) {
      getAttributeProperties(nextAttribute).push(newProperty)
    } else {
      const newAttribute = j.jsxAttribute(
        j.jsxIdentifier(targetAttributeName),
        j.jsxExpressionContainer(j.objectExpression([newProperty]))
      )
      attributes.push(newAttribute)
    }
  }
  remove(attributes, attribute => getAttributeName(attribute) === attributeName)
}

module.exports = {
  simplify,
  ensure,
  removeUnused,
  getAttributeName,
  getAttributeValue,
  getAttributeByName,
  makeAttribute,
  makeJSXElement,
  renameAttributeByName,
  moveAttributeIntoProperty
}
