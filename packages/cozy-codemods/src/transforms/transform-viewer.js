import { ensure, getAttributeByName, makeJSXElement } from '../imports'

export default function transformViewer(file, api) {
  var j = api.jscodeshift
  const root = j(file.source)

  const updateViewer = element => {
    const { attributes } = element.node.openingElement
    const hasDisableSharingProp = getAttributeByName({
      attributes,
      name: 'disableSharing'
    })

    ensure(
      root,
      { default: 'FooterActionButtons' },
      'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
    )
    ensure(
      root,
      { default: 'ForwardOrDownloadButton' },
      'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
    )

    if (!hasDisableSharingProp) {
      ensure(
        root,
        { default: 'SharingButton' },
        'cozy-ui/transpiled/react/Viewer/Footer/Sharing'
      )
    }

    let sharingButton = !hasDisableSharingProp
      ? makeJSXElement({ name: 'SharingButton' })
      : null

    const forwardOrDownloadButton = makeJSXElement({
      name: 'ForwardOrDownloadButton'
    })
    const footerActionButtons = makeJSXElement({
      name: 'FooterActionButtons',
      children: !hasDisableSharingProp
        ? [sharingButton, forwardOrDownloadButton]
        : [forwardOrDownloadButton]
    })
    const wrappedViewer = makeJSXElement({
      name: 'Viewer',
      attributes,
      children: [footerActionButtons]
    })
    j(element).replaceWith(wrappedViewer)
  }

  root
    .findJSXElements('Viewer')
    .forEach(updateViewer)
    .find(j.JSXAttribute)
    .filter(path => path.node.name.name === 'disableSharing')
    .remove()

  return root.toSource({ quote: 'single' })
}
