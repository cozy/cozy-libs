import { renameAttributeByName } from '../imports'

export default function transformInput(file, api) {
  var j = api.jscodeshift
  const root = j(file.source)

  root.findJSXElements('Input').forEach(nodePath => {
    const { attributes } = nodePath.node.openingElement

    renameAttributeByName({ attributes, oldName: 'inputRef', newName: 'ref' })
  })

  return root.toSource()
}
