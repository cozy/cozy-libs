const transformUiBC133 = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const deprecatedComponentsPath = [
    'react/AppIcon',
    'react/AppLinker',
    'react/AppSections',
    'react/AppTile',
    'react/CipherIcon',
    'react/ContactPicker',
    'react/Contacts/AddModal',
    'react/Contacts/GroupsSelect',
    'react/Contacts/Header',
    'react/ContactsList',
    'react/ContactsListModal',
    'react/CozyDialogs/SpecificDialogs/AuthentificationDialog',
    'react/Field',
    'react/FileImageLoader',
    'react/FilePicker',
    'react/hooks/useClientErrors',
    'react/IntentDialogOpener',
    'react/IntentIframe',
    'react/Labs/CollectionField',
    'react/ListItem/ListItemByDoc',
    'react/ListItem/ListItemBase',
    'react/ListItem/ListItemContact',
    'react/ListItem/ListItemFile',
    'react/Paywall',
    'react/providers/CozyTheme',
    'react/providers/Intent',
    'react/QualificationGrid',
    'react/QualificationIcon',
    'react/QualificationItem',
    'react/QualificationModal',
    'react/ShortcutTile',
    'react/SquareAppIcon',
    'react/Storage',
    'react/UploadQueue',
    'react/Wizard',
    'react/deprecated/QuotaAlert'
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
        .replace('CozyDialogs/SpecificDialogs/', 'Dialogs/')
        .replace('Labs/', '')
        .replace('deprecated/QuotaAlert', 'Paywall/QuotaPaywall')
        .replace(
          /react\/Qualification/,
          () => 'react/Qualification/Qualification'
        )
        .replace(/react\/Intent/, () => 'react/Intent/Intent')
        .replace('cozy-ui/transpiled/react/', 'cozy-ui-plus/dist/')

      nodePath.value.source.value = newPath
      nodePath.value.source.raw = newPath
    }
  })

  return root.toSource()
}

module.exports = transformUiBC133
