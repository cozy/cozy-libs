import { renderHook } from '@testing-library/react-hooks'
import useAppLinkWithStoreFallback from 'components/hooks/useAppLinkWithStoreFallback'

describe('useAppLinkWithStoreFallback', () => {
  const mockClient = { query: jest.fn() }

  it('should change loading status', async () => {
    mockClient.query.mockResolvedValue({ data: [] })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppLinkWithStoreFallback('test', mockClient)
    )
    expect(result.current.fetchStatus).toEqual('loading')
    await waitForNextUpdate()
    expect(result.current.fetchStatus).toEqual('loaded')
  })

  it('should inform when an error occurs', async () => {
    mockClient.query.mockRejectedValue('error')
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppLinkWithStoreFallback('test', mockClient)
    )
    expect(result.current.fetchStatus).toEqual('loading')
    await waitForNextUpdate()
    expect(result.current.fetchStatus).toEqual('errored')
  })

  it('should return data for an installed app', async () => {
    const testAppSlug = 'testapp'
    const path = '#/path'
    mockClient.query.mockResolvedValue({
      data: [
        {
          slug: testAppSlug,
          links: { related: 'http://testapp.cozy.io' }
        }
      ]
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppLinkWithStoreFallback(testAppSlug, mockClient, path)
    )

    await waitForNextUpdate()
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.url).toBe('http://testapp.cozy.io#/path')
  })

  it('should return a store URL when the app is not installed', async () => {
    const testAppSlug = 'testapp'
    const path = '#/path'
    mockClient.query.mockResolvedValue({
      data: [
        {
          slug: 'store',
          links: { related: 'http://store.cozy.io' }
        }
      ]
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppLinkWithStoreFallback(testAppSlug, mockClient, path)
    )

    await waitForNextUpdate()
    expect(result.current.isInstalled).toBe(false)
    expect(result.current.url).toBe('http://store.cozy.io#/discover/testapp')
  })
})
