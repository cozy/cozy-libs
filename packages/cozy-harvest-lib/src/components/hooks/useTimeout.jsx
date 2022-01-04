import { useState, useEffect } from 'react'

const useTimeout = (duration, start = false, end = true) => {
  const [ok, setOK] = useState(start)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOK(end)
    }, duration)
    return () => {
      clearTimeout(timeout)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return ok
}

export default useTimeout
