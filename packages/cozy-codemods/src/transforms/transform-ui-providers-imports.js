const transformUiDeprecatedImports = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const deprecatedComponentsPath = [
    'react/CozyTheme',
    'react/I18n',
    'react/hooks/useBreakpoints'
  ]

  root.find(j.ImportDeclaration).forEach(nodePath => {
    const absoluteImportPath = nodePath.value.source.value
    const relativeImportPath = absoluteImportPath.replace(
      'cozy-ui/transpiled/',
      ''
    )

    const shouldBeTransformed = deprecatedComponentsPath.some(path => {
      const regex = new RegExp('^' + path + '(/.*)?$', 'g')
      return relativeImportPath.match(regex)
    })

    if (shouldBeTransformed) {
      const newPath = absoluteImportPath
        .replace('hooks/', '')
        .replace('useBreakpoints', 'Breakpoints')
        .replace('react/', 'react/providers/')

      nodePath.value.source.value = newPath
      nodePath.value.source.raw = newPath
    }
  })

  return root.toSource()
}

module.exports = transformUiDeprecatedImports
