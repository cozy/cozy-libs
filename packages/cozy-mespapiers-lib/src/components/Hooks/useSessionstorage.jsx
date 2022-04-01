// TODO Move to cozy-client
import { useState, useCallback } from 'react'

import log from 'cozy-logger'

export const useSessionstorage = (key, initialValue) => {
  const [sessionValue, setSessionValueState] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      log('error', error)
      return initialValue
    }
  })

  const setSessionValue = useCallback(
    value => {
      try {
        const valueToStore =
          value instanceof Function ? value(sessionValue) : value
        setSessionValueState(valueToStore)
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        log('error', error)
      }
    },
    [key, sessionValue]
  )
  return [sessionValue, setSessionValue]
}
