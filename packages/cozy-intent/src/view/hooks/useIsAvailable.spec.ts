import { renderHook } from '@testing-library/react-hooks'

import { useIsAvailable } from './useIsAvailable'
import { useWebviewIntent } from './useWebviewIntent'

jest.mock('./useWebviewIntent', () => ({
  useWebviewIntent: jest.fn()
}))

const mockUseWebviewIntent = useWebviewIntent as jest.Mock

describe('useIsAvailable', () => {
  it('should return true if webviewIntent.call return true', async () => {
    // Given
    mockUseWebviewIntent.mockReturnValueOnce({
      call: async (_method: string, param: string) => {
        if (param === 'print') {
          return await Promise.resolve(true)
        }
        return await Promise.resolve(false)
      }
    })

    // When
    const { result, waitForNextUpdate } = renderHook(
      methodName => useIsAvailable(methodName),
      {
        initialProps: 'print'
      }
    )

    // Then
    expect(result.current).toEqual({ isAvailable: null, error: undefined })

    await waitForNextUpdate()

    expect(result.current).toEqual({ isAvailable: true, error: undefined })
  })

  it('should return false if webviewIntent.call return false', async () => {
    // Given
    mockUseWebviewIntent.mockReturnValueOnce({
      call: async (_method: string, param: string) => {
        if (param === 'print') {
          return await Promise.resolve(true)
        }
        return await Promise.resolve(false)
      }
    })

    // When
    const { result, waitForNextUpdate } = renderHook(
      methodName => useIsAvailable(methodName),
      {
        initialProps: 'download'
      }
    )

    // Then
    expect(result.current).toEqual({ isAvailable: null, error: undefined })

    await waitForNextUpdate()

    expect(result.current).toEqual({ isAvailable: false, error: undefined })
  })

  it('should return null if no webviewIntent', () => {
    // Given
    mockUseWebviewIntent.mockReturnValueOnce(undefined)

    // When
    const { result } = renderHook(methodName => useIsAvailable(methodName), {
      initialProps: 'print'
    })

    // Then
    expect(result.current).toEqual({ isAvailable: null, error: undefined })

    // no more render here
  })

  it('should return false and error if webviewIntent throw', async () => {
    // Given
    mockUseWebviewIntent.mockReturnValueOnce({
      call: async () => {
        return await Promise.reject(new Error('Test error'))
      }
    })

    // When
    const { result, waitForNextUpdate } = renderHook(
      methodName => useIsAvailable(methodName),
      {
        initialProps: 'print'
      }
    )

    // Then
    expect(result.current).toEqual({ isAvailable: null, error: undefined })

    await waitForNextUpdate()

    expect(result.current).toEqual({ isAvailable: false, error: 'Test error' })
  })
})
