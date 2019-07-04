const countJSX = (root, j) => {
  return root.find(j.JSXOpeningElement).length
}

/** Removes unused imports by counting usage */
const removeUnusedImports = (root, j) => {
  const importsToRemove = root.find(j.ImportDeclaration)
  importsToRemove.forEach(path => {
    const toKeep = []
    for (let specifier of path.node.specifiers) {
      const identifierName = specifier.local.name
      const usages = root.find(j.Identifier, { name: identifierName })
      const nUsage =
        usages.size() + (identifierName === 'React' ? countJSX(root, j) : 0)
      // import { toto } from 'lib' counts as 2 usages of toto
      // import toto from 'lib' counts a 1 usage of toto
      const importUsages =
        specifier.type === 'ImportSpecifier'
          ? specifier.imported.name === specifier.local.name
            ? 2
            : 1
          : 1
      if (nUsage > importUsages) {
        toKeep.push(specifier)
      }
    }
    if (toKeep.length === 0 && path.node.specifiers.length > 0) {
      path.replace(null)
    } else {
      path.node.specifiers = toKeep
    }
  })
}

export default removeUnusedImports
