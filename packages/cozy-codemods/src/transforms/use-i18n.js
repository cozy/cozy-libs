const { hocToHookReplacer } = require('../hoc')

const isI18nProp = prop =>
  prop.key && (prop.key.name === 't' || prop.key.name === 'f')

const findI18nProps = objPattern => {
  if (!objPattern) {
    return
  }
  if (objPattern.type !== 'ObjectPattern') {
    return
  }
  return objPattern.properties
    ? objPattern.properties.filter(isI18nProp).map(prop => prop.key.name)
    : []
}

module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  const replaceI18nPropsByHook = hocToHookReplacer({
    propsFilter: isI18nProp,
    propsFinder: findI18nProps,
    hookUsage: foundProps => `const { ${foundProps.join(', ')} } = useI18n()`,
    hocName: 'translate',
    j,
    importOptions: {
      filter: x =>
        x.source.value == 'cozy-ui/transpiled/react' ||
        x.source.value == 'cozy-ui/react',
      specifiers: {
        useI18n: true
      },
      package: 'cozy-ui/transpiled/react'
    }
  })

  return replaceI18nPropsByHook(root).toSource()
}
