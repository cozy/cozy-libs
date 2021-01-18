import { useState, useRef, useEffect } from 'react'

/**
 * useState variant that does not cause warnings when the component
 * is unmounted. Useful for components that can be unmounted
 * during one of their async action.
 *
 * Originally from https://gist.github.com/AlpacaGoesCrazy/25e3a15fcd4e57fb8ccd408d488554d7#gistcomment-3553326
 */
const useSafeState = initialValue => {
  const _isMounted = useRef()
  const [state, setState] = useState(initialValue)
  const _setState = useRef((...args) => {
    if (_isMounted.current) {
      setState(...args)
    }
  })

  useEffect(() => {
    _isMounted.current = true
    return () => {
      _isMounted.current = false
    }
  })
  return [state, _setState.current]
}

export default useSafeState
