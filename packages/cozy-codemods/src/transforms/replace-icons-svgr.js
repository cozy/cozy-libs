const { imports } = require('..')

const iconNameToComponentName = iconName => {
  return (
    iconName[0].toUpperCase() +
    iconName.slice(1).replace(/-([a-z])/g, x => x[1].toUpperCase())
  )
}

export default function replaceSvgrIcons(file, api) {
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

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Avatar'
      }
    })
    .forEach(transform)

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Icon'
      }
    })
    .forEach(transform)

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Button'
      }
    })
    .forEach(transform)

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'ButtonLink'
      }
    })
    .forEach(transform)

  return root.toSource()
}
