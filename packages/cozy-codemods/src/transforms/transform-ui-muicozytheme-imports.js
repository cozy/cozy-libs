const transformUiDeprecatedImports = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const deprecatedComponentsPath = [
    'react/MuiCozyTheme/Buttons',
    'react/MuiCozyTheme/MuiBreadcrumbs',
    'react/MuiCozyTheme/Dialog',
    'react/MuiCozyTheme/Accordion',
    'react/MuiCozyTheme/AccordionDetails',
    'react/MuiCozyTheme/AccordionSummary',
    'react/MuiCozyTheme/Divider',
    'react/MuiCozyTheme/Grid',
    'react/MuiCozyTheme/List',
    'react/MuiCozyTheme/ListItem',
    'react/MuiCozyTheme/ListItemIcon',
    'react/MuiCozyTheme/ListItemSecondaryAction',
    'react/MuiCozyTheme/ListSubheader',
    'react/MuiCozyTheme/Menu',
    'react/MuiCozyTheme/Switch',
    'react/MuiCozyTheme/TextField'
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
        .replace('MuiBreadcrumbs', 'Breadcrumbs')
        .replace('Buttons', 'Button')

      nodePath.value.source.value = newPath
      nodePath.value.source.raw = newPath
    }
  })

  return root.toSource()
}

module.exports = transformUiDeprecatedImports
