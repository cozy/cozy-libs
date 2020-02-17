import React from 'react'

const deprecated = deprecationMessage => Wrapped => {
  const Wrapper = props => {
    // eslint-disable-next-line no-console
    console.warn(deprecationMessage)
    return <Wrapped {...props} />
  }
  Wrapper.displayName = `deprecated(${Wrapped.displayName || Wrapped.name})`
  return Wrapper
}

export default deprecated
