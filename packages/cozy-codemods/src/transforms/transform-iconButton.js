import { getAttributeByName, makeAttribute } from '../imports'

export default function transformIconButton(file, api) {
  var j = api.jscodeshift
  const root = j(file.source)

  root.findJSXElements('IconButton').forEach(nodePath => {
    const { attributes } = nodePath.node.openingElement

    const sizeAttribute = getAttributeByName({ attributes, name: 'size' })

    if (!sizeAttribute) {
      attributes.push(makeAttribute({ name: 'size', value: 'medium' }))
    }
  })

  return root.toSource()
}
