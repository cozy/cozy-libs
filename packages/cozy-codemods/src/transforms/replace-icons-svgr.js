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

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Icon'
      }
    })
    .forEach(path => {
      const iconAttr = path.node.attributes.find(
        attr => attr.name.name === 'icon'
      )

      if (iconAttr.value.type === 'Literal') {
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
    })

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Button'
      }
    })
    .forEach(path => {
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
        imports.ensure(
          root,
          {
            default: `Icon`
          },
          `cozy-ui/transpiled/react/Icon`
        )
        iconAttr.value = `{<Icon icon={${componentName}Icon} />}`
      }
    })

  root
    .find(j.JSXOpeningElement, {
      name: {
        name: 'Avatar'
      }
    })
    .forEach(path => {
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
        imports.ensure(
          root,
          {
            default: `Icon`
          },
          `cozy-ui/transpiled/react/Icon`
        )
        iconAttr.value = `{<Icon icon={${componentName}Icon} />}`
      }
    })
  return root.toSource()
}
