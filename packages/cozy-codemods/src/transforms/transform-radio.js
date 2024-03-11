/**
 * Original:
 *  <Radio
 *    value="radioValue1"
 *    label="This is a radio button"
 *    error={true}
 *    disabled={false}
 *    gutter={true}
 *  />
 * New :
 *  <FormControlLabel
 *    value="radioValue1"
 *    label="This is a radio button"
 *    control={<Radio disabled={false} color="secondary" edge="start" />}
 *  />
 */

import remove from 'lodash/remove'

import { imports } from '..'

const getAttributeName = attribute => attribute?.name?.name
const getAttributeValue = attribute => attribute?.value?.expression?.value
const getAttribute = (attributes, name) =>
  attributes.find(attribute => getAttributeName(attribute) === name)

export default function transformRadio(file, api) {
  var j = api.jscodeshift
  const root = j(file.source)

  root.find(j.ImportDeclaration).forEach(nodePath => {
    if (nodePath.value.source.value === 'cozy-ui/transpiled/react/Radio') {
      imports.ensure(
        root,
        { default: 'FormControlLabel' },
        'cozy-ui/transpiled/react/FormControlLabel'
      )

      nodePath.value.source.value = 'cozy-ui/transpiled/react/Radios'
      nodePath.value.source.raw = 'cozy-ui/transpiled/react/Radios'
    }
  })

  const wrapRadioInFormControlLabel = () => {
    root.findJSXElements('Radio').replaceWith(nodePath => {
      const parentAttributeName =
        nodePath?.parentPath?.parentPath?.value?.name?.name
      const isInCompWithControlAttribute = parentAttributeName === 'control'

      if (isInCompWithControlAttribute) {
        return nodePath.value
      }

      const { attributes } = nodePath.node.openingElement
      const valueAtttribute = getAttribute(attributes, 'value')
      const labelAttribute = getAttribute(attributes, 'label')

      const formControlLabelAttributes = [
        j.jsxAttribute(
          j.jsxIdentifier('control'),
          j.jsxExpressionContainer(nodePath.value)
        )
      ]
      if (valueAtttribute) {
        formControlLabelAttributes.push(
          j.jsxAttribute(j.jsxIdentifier('value'), valueAtttribute.value)
        )
      }
      if (labelAttribute) {
        formControlLabelAttributes.push(
          j.jsxAttribute(j.jsxIdentifier('label'), labelAttribute.value)
        )
      }

      const jsxFormControlLabel = j.jsxElement(
        j.jsxOpeningElement(
          j.jsxIdentifier('FormControlLabel'),
          formControlLabelAttributes.reverse()
        )
      )
      jsxFormControlLabel.selfClosing = true
      jsxFormControlLabel.openingElement.selfClosing = true

      remove(attributes, attribute => getAttributeName(attribute) === 'value')
      remove(attributes, attribute => getAttributeName(attribute) === 'label')

      return jsxFormControlLabel
    })
  }

  const transformRadio = nodePath => {
    const { attributes } = nodePath.node.openingElement

    // add edge prop if previous Radio had no gutter prop
    if (!getAttribute(attributes, 'gutter')) {
      attributes.push(
        j.jsxAttribute(j.jsxIdentifier('edge'), j.literal('start'))
      )
    }

    attributes.forEach(attribute => {
      // replace error={true} by color='secondary'
      if (
        getAttributeName(attribute) === 'error' &&
        getAttributeValue(attribute) === true
      ) {
        attributes.push(
          j.jsxAttribute(j.jsxIdentifier('color'), j.literal('secondary'))
        )
        remove(attributes, attribute => getAttributeName(attribute) === 'error')
      }

      // replace gutter={true} by edge='start'
      // remove gutter={false}
      if (getAttributeName(attribute) === 'gutter') {
        if (getAttributeValue(attribute) === true) {
          attributes.push(
            j.jsxAttribute(j.jsxIdentifier('edge'), j.literal('start'))
          )
        }
        remove(
          attributes,
          attribute => getAttributeName(attribute) === 'gutter'
        )
      }
    })
  }

  root.findJSXElements('Radio').forEach(transformRadio)
  wrapRadioInFormControlLabel()

  return root.toSource()
}
