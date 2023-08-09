import { moveAttributeIntoProperty } from '../imports'

export default function transformViewerComponentsProps(file, api) {
  var j = api.jscodeshift
  const root = j(file.source)

  const updateViewer = nodePath => {
    const { attributes } = nodePath.node.openingElement
    moveAttributeIntoProperty({
      attributes,
      attributeName: 'toolbarProps',
      propertyName: 'toolbarProps',
      targetAttributeName: 'componentsProps'
    })

    moveAttributeIntoProperty({
      attributes,
      attributeName: 'onlyOfficeProps',
      propertyName: 'OnlyOfficeViewer',
      targetAttributeName: 'componentsProps'
    })
  }

  root.findJSXElements('Viewer').forEach(updateViewer)

  return root.toSource({ quote: 'single' })
}
