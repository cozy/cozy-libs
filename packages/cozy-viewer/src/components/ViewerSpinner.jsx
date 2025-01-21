import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

const ViewerSpinner = () => {
  const { isDesktop } = useBreakpoints()

  return (
    <Spinner
      size="xxlarge"
      middle
      noMargin
      {...(isDesktop && { color: 'white' })}
    />
  )
}

export default ViewerSpinner
