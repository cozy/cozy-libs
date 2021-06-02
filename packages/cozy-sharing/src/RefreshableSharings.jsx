import React from 'react'

import SharingContext from './context'

export const RefreshableSharings = ({ children }) => (
  <SharingContext.Consumer>
    {({ refresh }) =>
      children({
        refresh
      })
    }
  </SharingContext.Consumer>
)
