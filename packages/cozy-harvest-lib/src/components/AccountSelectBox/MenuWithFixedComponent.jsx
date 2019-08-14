import React from 'react'
import { components } from 'cozy-ui/transpiled/react/SelectBox'

import CreateAccountButton from './CreateAccountButton'

const MenuWithFixedComponent = props => {
  const { children } = props
  const { createAction, ...selectProps } = props.selectProps
  return (
    <components.Menu {...props} selectProps={selectProps}>
      {children}
      <CreateAccountButton createAction={createAction} />
    </components.Menu>
  )
}

export default MenuWithFixedComponent
