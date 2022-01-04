import React from 'react'

import SharingContext from './context'

export var RefreshableSharings = ({ children }) => (
  <SharingContext.Consumer>
    {({ refresh }) =>
      children({
        refresh
      })
    }
  </SharingContext.Consumer>
)
