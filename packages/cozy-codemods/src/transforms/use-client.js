const { hocToHookReplacer } = require('../hoc')

const isClientProp = prop => {
  return prop.key && prop.key.name === 'client'
}

const findClientProps = objPattern => {
  if (!objPattern) {
    return
  }
  if (objPattern.type !== 'ObjectPattern') {
    return
  }
  return objPattern.properties
    ? objPattern.properties.filter(isClientProp).map(prop => prop.key.name)
    : []
}

module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  const replaceClientPropsByHook = hocToHookReplacer({
    propsFilter: isClientProp,
    propsFinder: findClientProps,
    hookUsage: `const client = useClient()`,
    hocName: 'withClient',
    noOptionsHoc: true,
    j,
    importOptions: {
      specifiers: {
        useClient: true
      },
      package: 'cozy-client',
      filter: importNode => importNode.source.value == 'cozy-client'
    }
  })

  return replaceClientPropsByHook(root).toSource()
}
