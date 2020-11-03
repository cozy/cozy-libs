const importUtils = require('../imports')

const mappings = {
  MainTitle: {
    componentName: 'Typography',
    props: {
      variant: 'h3',
      component: 'h1'
    }
  },
  Title: {
    componentName: 'Typography',
    props: {
      variant: 'h4'
    }
  },
  SubTitle: {
    componentName: 'Typography',
    props: {
      variant: 'h5'
    }
  },
  Bold: {
    componentName: 'Typography',
    props: {
      variant: 'h6'
    }
  },
  Caption: {
    componentName: 'Typography',
    props: {
      variant: 'caption',
      color: 'textSecondary'
    }
  },
  Text: {
    componentName: 'Typography',
    props: {
      variant: 'body1'
    }
  }
}

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  let toImport = {}

  Object.entries(mappings).forEach(([oldComponent, newSpec]) => {
    // Replace JSX opening elements
    root
      .find(j.JSXOpeningElement, { name: { name: oldComponent } })
      .forEach(path => {
        path.node.name = j.jsxIdentifier(newSpec.componentName)
        toImport[newSpec.componentName] = true

        for (let [propName, propValue] of Object.entries(newSpec.props)) {
          path.node.attributes.push(
            j.jsxAttribute(j.jsxIdentifier(propName), j.literal(propValue))
          )
        }
      })

    // Replace JSX closing elements
    root
      .find(j.JSXClosingElement, { name: { name: oldComponent } })
      .forEach(path => {
        path.node.name = j.jsxIdentifier(newSpec.componentName)
      })
  })

  importUtils.removeUnused(root)

  // Ensures Typography is imported
  if (Object.keys(toImport).length > 0) {
    importUtils.ensure(
      root,
      {
        default: 'Typography'
      },
      'cozy-ui/transpiled/react/Typography'
    )
  }

  return root.toSource()
}
