const transformUiBC133 = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const deprecatedComponentsPath = ['react/providers/I18n']

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
      const newPath = absoluteImportPath.replace(
        /^cozy-ui\/transpiled\/react\/providers\/I18n(\/.*)?/,
        'twake-i18n'
      )

      nodePath.value.source.value = newPath
      nodePath.value.source.raw = newPath
    }
  })

  return root.toSource()
}

module.exports = transformUiBC133
