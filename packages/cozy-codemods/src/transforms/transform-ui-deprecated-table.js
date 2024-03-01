const transformUiDeprecatedImports = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  root.find(j.ImportDeclaration).forEach(nodePath => {
    const absoluteImportPath = nodePath.value.source.value
    const relativeImportPath = absoluteImportPath.replace(
      'cozy-ui/transpiled/',
      ''
    )

    const regex = new RegExp('^react/Table(/.*)?$', 'g')
    const shouldBeTransformed = relativeImportPath.match(regex)

    if (shouldBeTransformed) {
      const newPath = absoluteImportPath.replace('react/', 'react/deprecated/')
      nodePath.value.source.value = newPath
      nodePath.value.source.raw = newPath
    }
  })

  return root.toSource()
}

module.exports = transformUiDeprecatedImports
