import debounce from 'lodash/debounce'
import { useState } from 'react'

import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

/**
 * Scroll direction
 * @typedef {Object} scrollDirection
 * @property {string} DOWN - Scroll down
 * @property {string} UP - Scroll up
 */
const scrollDirection = { DOWN: 'down', UP: 'up' }

/**
 * Get scrollTop & direction from scroll event
 *
 * @param {Object} options
 * @param {HTMLElement} options.element - Element to listen scroll event
 * @param {number} options.delay - Delay in ms before calling the callback
 * @returns {{ scrollTop: number, direction: scrollDirection }} - Scroll state
 */
export const useScroll = ({ element, delay = 250 } = {}) => {
  const { isMobile } = useBreakpoints()
  const [scroll, setScroll] = useState({
    scrollTop: 0,
    direction: scrollDirection.DOWN
  })
  // On Desktop, we need to listen scroll event on div with role=main,
  // listen scroll event on document works only on mobile
  const mainElement = element || document.querySelector('[role=main]')

  const handleScroll = debounce(() => {
    // For mobile, we need to use window.pageYOffset, because mainElement.scrollTop is always 0
    const scrollTop = isMobile ? window.pageYOffset : mainElement.scrollTop

    setScroll(prev => {
      if (scrollTop > prev.scrollTop) {
        return {
          scrollTop,
          direction: scrollDirection.DOWN
        }
      } else {
        return {
          scrollTop,
          direction: scrollDirection.UP
        }
      }
    })
  }, delay)

  // For Desktp
  useEventListener(mainElement, 'scroll', handleScroll)
  // For Mobile
  useEventListener(mainElement, 'touchmove', handleScroll)

  return scroll
}
