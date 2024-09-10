import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

const ViewerSpinner = ({ breakpoints: { isDesktop } }) => {
  return (
    <Spinner
      size="xxlarge"
      middle
      noMargin
      {...(isDesktop && { color: 'white' })}
    />
  )
}

export default withBreakpoints()(ViewerSpinner)
