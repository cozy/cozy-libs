import { useState, useEffect } from 'react'

import { useWebviewIntent } from './useWebviewIntent'
import { getErrorMessage } from '../../utils'

interface UseIsAvailableResult {
  isAvailable: boolean | null
  error?: string
}

export const useIsAvailable = (methodName: string): UseIsAvailableResult => {
  const webviewIntent = useWebviewIntent()
  const [isAvailable, setIsAvailable] =
    useState<UseIsAvailableResult['isAvailable']>(null)
  const [error, setError] = useState<UseIsAvailableResult['error']>(undefined)

  useEffect(() => {
    if (!webviewIntent) return

    const checkIsAvailable = async (): Promise<void> => {
      try {
        const result = await webviewIntent.call('isAvailable', methodName)

        if (typeof result !== 'boolean') {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Invalid result from isAvailable method: ${result}`)
        }

        setError(undefined)
        setIsAvailable(result)
      } catch (e) {
        setError(getErrorMessage(e))
        setIsAvailable(false)
      }
    }

    void checkIsAvailable()
  }, [webviewIntent, methodName])

  return { isAvailable, error }
}
