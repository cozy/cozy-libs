import { isValidElement, Children, cloneElement } from 'react'

export const shouldBeForwardButton = client => {
  const isDrive = client?.appMetadata?.slug === 'drive'
  if (navigator.share && !isDrive) return true
  return false
}

export const mapToAllChildren = (children, cb) => {
  return Children.map(children, child => {
    if (!isValidElement(child)) return child

    const grandchildren = child.props.children
    if (grandchildren) {
      return cloneElement(child, {
        children: mapToAllChildren(grandchildren, cb)
      })
    }

    return cb(child)
  })
}

export const extractChildrenCompByName = ({ children, file, name }) => {
  const ChildrenComp =
    Children.toArray(children).find(child => {
      return child.type.name === name || child.type.displayName === name
    }) || null

  const ChildrenCompWithFile = isValidElement(ChildrenComp)
    ? cloneElement(ChildrenComp, {
        file
      })
    : null

  return ChildrenCompWithFile
}
