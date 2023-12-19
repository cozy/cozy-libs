// TODO Move to cozy-client
import { useState, useCallback } from 'react'

import minilog from 'cozy-minilog'

const log = minilog('useSessionstorage')

export const useSessionstorage = (key, initialValue) => {
  const [sessionValue, setSessionValueState] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      log.error('Get item in sessionStorage failed', error)
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
        log.error('Set item in sessionStorage failed', error)
      }
    },
    [key, sessionValue]
  )
  return [sessionValue, setSessionValue]
}
