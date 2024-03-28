import { useState, useEffect } from 'react'

import { useWebviewIntent } from './useWebviewIntent'

interface UseIsAvailableResult {
  isAvailable: boolean | null
  error: string | undefined
}

export const useIsAvailable = (methodName: string): UseIsAvailableResult => {
  const webviewIntent = useWebviewIntent()
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const checkIsAvailable = async (): Promise<void> => {
      if (webviewIntent) {
        try {
          const result = await webviewIntent.call('isAvailable', methodName)

          setIsAvailable(result)
          setError(undefined)
        } catch (e) {
          const error = e as Error

          setIsAvailable(false)
          setError(error.message)
        }
      }
    }

    void checkIsAvailable()
  }, [webviewIntent, methodName])

  return { isAvailable, error }
}
