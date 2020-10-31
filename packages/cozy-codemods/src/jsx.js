const j = require('jscodeshift')

const isJsxElementOfClass = (element, klass) => {
  return element.openingElement && element.openingElement.name.name === klass
}

const addJsxAttribute = (element, name, value) => {
  element.openingElement.attributes.push(
    new j.jsxAttribute(new j.jsxIdentifier(name), maybeWrap(value))
  )
}

const getAttributeName = x => x && x.name && x.name.name
const getAttributeValue = x => x && x.value && x.value.value

const strip = s => s.replace(/^[\s\n]+/g, '').replace(/[\s\n]+$/g, '')

const maybeWrap = x => {
  if (x.type === 'Literal') {
    return new j.literal(strip(x.value))
  }
  if (x.type === 'JSXExpressionContainer') {
    return x
  }
  return new j.jsxExpressionContainer(x)
}

/**
 * Remove redundant expression containers.
 *
 * @example
 * <div>{<div></div>}</div> -> <div><div></div></div>
 *
 * @param  {PathNode} root
 * @param  {Object} j
 * @return
 */
const removeRedundantExpressionContainers = root => {
  root.find(j.JSXExpressionContainer).forEach(path => {
    if (
      path.parentPath.node.type == 'JSXElement' &&
      path.node.expression.type === 'JSXElement'
    ) {
      path.replace(path.node.expression)
    }
  })
}

/**
 * Removes falsy JSX containers
 * JSX identifiers are counted as React usage.
 *
 * @example
 * <div>{false}</div> -> <div></div>
 *
 * @param  {PathNode} root
 * @param  {Object} j
 */
const removeFalseExpressionContainers = root => {
  // Remove empty declarations
  root
    .find(j.JSXExpressionContainer, {
      expression: { type: 'Literal', value: false }
    })
    .forEach(p => {
      if (p.parentPath.node.type === 'JSXAttribute') {
        return
      }
      p.replace(null)
    })
}

module.exports = {
  isJsxElementOfClass,
  addJsxAttribute,
  getAttributeName,
  getAttributeValue,
  maybeWrap,
  removeRedundantExpressionContainers,
  removeFalseExpressionContainers
}
