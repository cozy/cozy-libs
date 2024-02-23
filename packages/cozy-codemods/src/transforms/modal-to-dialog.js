const j = require('jscodeshift')

const { imports } = require('..')

const transformComponent = (root, options) => {
  const { oldName, newName, propsMapping, newProps, onOpeningElement } = options
  let res = false
  root.find(j.JSXOpeningElement, { name: { name: oldName } }).forEach(path => {
    res = true
    path.node.name.name = newName

    for (let prop of path.node.attributes) {
      let newProp = propsMapping && propsMapping[prop.name && prop.name.name]
      if (newProp) {
        if (typeof newProp === 'string') {
          prop.name.name = newProp
        } else {
          prop.value.value = newProp(prop.value.value)
        }
      }
    }

    if (newProps) {
      for (const [propName, propValue] of Object.entries(newProps)) {
        path.node.attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier(propName),
            j.jsxExpressionContainer(j.literal(propValue))
          )
        )
      }
    }

    if (onOpeningElement) {
      onOpeningElement(path)
    }
  })

  root.find(j.JSXClosingElement, { name: { name: oldName } }).forEach(path => {
    path.node.name.name = newName
  })
  return res
}

// text, action and type are jsxAttributes
const makeButton = (text, action, type) => {
  const props = [
    j.jsxAttribute(j.jsxIdentifier('label'), text.value),
    j.jsxAttribute(j.jsxIdentifier('onClick'), action.value)
  ]
  if (type) {
    props.push(j.jsxAttribute(j.jsxIdentifier('variant'), type.value))
  }
  const selfClosing = true
  return j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier('Button'), props, selfClosing)
  )
}

module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  let shouldImport = {}
  shouldImport.Dialog = transformComponent(root, {
    oldName: 'Modal',
    newName: 'Dialog',
    propsMapping: {
      dismissAction: 'onClose',
      size: x => {
        if (x === 'large') {
          return 'l'
        }
        if (x === 'medium') {
          return 'm'
        }
        if (x === 'small' || x === 'xsmall') {
          return 's'
        }
        throw new Error(`Unknown size: ${x}`)
      }
    },
    newProps: {
      open: true
    },
    onOpeningElement: path => {
      const propsByName = {}
      for (let attr of path.node.attributes) {
        propsByName[attr.name.name] = attr
      }
      const onClose = propsByName.onClose
      if (onClose) {
        const selfClosing = true
        path.parent.node.children.unshift(
          j.jsxOpeningElement(
            j.jsxIdentifier('DialogCloseButton'),
            [onClose],
            selfClosing
          )
        )
        shouldImport.DialogCloseButton = true
      }

      // Save actions
      const actions = []
      const primaryAction = propsByName.primaryAction
      const primaryText = propsByName.primaryText
      const primaryType = propsByName.primaryType
      const secondaryAction = propsByName.secondaryAction
      const secondaryText = propsByName.secondaryText
      const secondaryType = propsByName.secondaryType

      const buttonAttrs = [
        'primaryAction',
        'primaryText',
        'primaryType',
        'secondaryAction',
        'secondaryText',
        'secondaryType'
      ]

      if (primaryText) {
        const primaryBtn = makeButton(primaryText, primaryAction, primaryType)
        actions.push(primaryBtn)
      }

      if (secondaryText) {
        const secondBtn = makeButton(
          secondaryText,
          secondaryAction,
          secondaryType
        )
        actions.push(secondBtn)
      }

      if (actions.length > 0) {
        path.node.attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier('actions'),
            j.jsxExpressionContainer(
              j.jsxFragment(
                j.jsxOpeningFragment(),
                j.jsxClosingFragment(),
                actions
              )
            )
          )
        )

        imports.ensure(
          root,
          {
            default: 'Button'
          },
          `cozy-ui/transpiled/react/Button`
        )
      }

      // Remove button attributes
      path.node.attributes = path.node.attributes.filter(attr => {
        const name = attr.name.name
        return buttonAttrs.indexOf(name) === -1
      })
    }
  })
  shouldImport.DialogContent = transformComponent(root, {
    oldName: 'ModalContent',
    newName: 'DialogContent'
  })

  if (shouldImport.Dialog) {
    imports.ensure(
      root,
      {
        Dialog: 'Dialog'
      },
      `cozy-ui/transpiled/react/CozyDialogs`
    )
  }

  if (shouldImport.DialogContent) {
    imports.ensure(
      root,
      {
        default: 'DialogContent'
      },
      `@material-ui/core/DialogContent`
    )
  }

  if (shouldImport.DialogCloseButton) {
    imports.ensure(
      root,
      {
        DialogCloseButton: 'DialogCloseButton'
      },
      `cozy-ui/transpiled/react/CozyDialogs`
    )
  }

  imports.removeUnused(root)

  return root.toSource()
}
