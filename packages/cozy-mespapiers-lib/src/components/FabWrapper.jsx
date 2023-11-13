import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const makeStyle = (isDesktop, offsetRight) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'fixed',
  bottom: '1rem',
  right: isDesktop ? `calc(6rem + ${offsetRight}px)` : '1rem',
  zIndex: 10
})

const FabWrapper = ({ children }) => {
  const { isDesktop } = useBreakpoints()
  const mainElement = document.querySelector('[role=main]')
  const offsetRight =
    window.innerWidth - (mainElement?.getBoundingClientRect()?.right ?? 0)

  if (!children) return null

  return <Box {...makeStyle(isDesktop, offsetRight)}>{children}</Box>
}

export default FabWrapper
