import React, { useCallback, useRef } from 'react'

export const isServer = typeof window === 'undefined'

/**
 * based on : https://github.com/tannerlinsley/react-query/blob/79ad5a9ccbce1486c10e7e364d8fc28bef3fa19f/src/devtools/utils.ts#L61
 */
function useIsMounted() {
  const mountedRef = useRef(false)
  const isMounted = useCallback(() => mountedRef.current, [])

  React[isServer ? 'useEffect' : 'useLayoutEffect'](() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return isMounted
}

/**
 * This hook is a safe useState version which schedules state updates in microtasks
 * to prevent updating a component state while React is rendering different components
 * or when the component is not mounted anymore.
 *
 * based on : https://github.com/tannerlinsley/react-query/blob/79ad5a9ccbce1486c10e7e364d8fc28bef3fa19f/src/devtools/utils.ts#L80
 */
export function useSafeState(initialState) {
  const isMounted = useIsMounted()
  const [state, setState] = React.useState(initialState)

  const safeSetState = React.useCallback(
    value => {
      scheduleMicrotask(() => {
        if (isMounted()) {
          setState(value)
        }
      })
    },
    [isMounted]
  )

  return [state, safeSetState]
}

/**
 * Schedules a microtask.
 * This can be useful to schedule state updates after rendering.
 *
 * based on : https://github.com/tannerlinsley/react-query/blob/79ad5a9ccbce1486c10e7e364d8fc28bef3fa19f/src/devtools/utils.ts#L102
 */
function scheduleMicrotask(callback) {
  Promise.resolve()
    .then(callback)
    .catch(error =>
      setTimeout(() => {
        throw error
      })
    )
}
