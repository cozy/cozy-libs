const { imports } = require('..')

const iconNameToComponentName = iconName => {
  return (
    iconName[0].toUpperCase() +
    iconName.slice(1).replace(/-([a-z])/g, x => x[1].toUpperCase())
  )
}

module.exports = function replaceSvgrIcons(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  const transform = path => {
    const iconAttr = path.node.attributes.find(
      attr => attr.name && attr.name.name === 'icon'
    )

    if (iconAttr && iconAttr.value.type === 'Literal') {
      const componentName = iconNameToComponentName(iconAttr.value.value)

      imports.ensure(
        root,
        {
          default: `${componentName}Icon`
        },
        `cozy-ui/transpiled/react/Icons/${componentName}`
      )
      iconAttr.value = j.jsxExpressionContainer(
        j.jsxIdentifier(`${componentName}Icon`)
      )
    }
  }

  for (let componentName of ['Avatar', 'Icon', 'Button', 'ButtonLink']) {
    root
      .find(j.JSXOpeningElement, {
        name: {
          name: componentName
        }
      })
      .forEach(transform)
  }

  return root.toSource()
}

module.exports.description =
  'Replaces Icon that come from a sprite with an SVGr version'
