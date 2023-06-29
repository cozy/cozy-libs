const transformUiDeprecatedImports = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const deprecatedComponentsPath = [
    'react/ActionMenu',
    'react/Alerter',
    'react/BottomDrawer',
    'react/Button',
    'react/ButtonAction',
    'react/Chip',
    'react/CompositeRow',
    'react/Infos',
    'react/InfosCarrousel',
    'react/InlineCard',
    'react/IntentModal',
    'react/IntentOpener',
    'react/Media',
    'react/Modal',
    'react/NarrowContent',
    'react/Overlay',
    'react/PercentageBar',
    'react/PercentageLine',
    'react/PushClientButton',
    'react/QuotaAlert',
    'react/Radio',
    'react/ViewStack',
    'react/MuiCozyTheme/Menus',
    'react/MuiCozyTheme/RaisedList',
    'react/Labs/GridItem'
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
        .replace('MuiCozyTheme/', '')
        .replace('Labs/', '')
        .replace('react/', 'react/deprecated/')

      nodePath.value.source.value = newPath
      nodePath.value.source.raw = newPath
    }
  })

  return root.toSource()
}

module.exports = transformUiDeprecatedImports
