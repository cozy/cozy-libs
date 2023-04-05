import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const makeStyle = isDesktop => ({
  display: 'flex',
  alignItems: 'center',
  position: 'fixed',
  bottom: '1rem',
  right: isDesktop ? '6rem' : '1rem',
  zIndex: 10
})

const FabWrapper = ({ children }) => {
  const { isDesktop } = useBreakpoints()

  if (!children) return null

  return <Box {...makeStyle(isDesktop)}>{children}</Box>
}

export default FabWrapper
