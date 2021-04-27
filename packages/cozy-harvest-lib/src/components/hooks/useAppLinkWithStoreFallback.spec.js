import useAppLinkWithStoreFallback from 'components/hooks/useAppLinkWithStoreFallback'
import { useQuery } from 'cozy-client'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

describe('useAppLinkWithStoreFallback', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return fetchStatus according to the query fetchStatus', async () => {
    useQuery.mockReturnValue({ data: [], fetchStatus: 'loading' })
    const result = useAppLinkWithStoreFallback('test')
    expect(result.fetchStatus).toEqual('loading')

    useQuery.mockClear()

    useQuery.mockReturnValue({ data: [], fetchStatus: 'loaded' })
    const result2 = useAppLinkWithStoreFallback('test')
    expect(result2.fetchStatus).toEqual('loaded')
  })

  it('should inform when an error occurs', () => {
    useQuery.mockReturnValue({ data: [], fetchStatus: 'error' })
    const result = useAppLinkWithStoreFallback('test')

    expect(result.fetchStatus).toEqual('error')
  })

  it('should return data for an installed app', () => {
    const testAppSlug = 'testapp'
    const path = '#/path'
    useQuery.mockReturnValue({
      data: [
        {
          attributes: {
            slug: testAppSlug
          },
          links: { related: 'http://testapp.cozy.io' }
        }
      ],
      fetchStatus: 'loaded'
    })

    const result = useAppLinkWithStoreFallback(testAppSlug, path)
    expect(result.isInstalled).toBe(true)
    expect(result.url).toBe('http://testapp.cozy.io#/path')
  })

  it('should return a store URL when the app is not installed', async () => {
    const testAppSlug = 'testapp'
    const path = '#/path'
    useQuery.mockReturnValue({
      data: [
        {
          attributes: {
            slug: 'store'
          },
          links: { related: 'http://store.cozy.io' }
        }
      ],
      fetchStatus: 'loaded'
    })

    const result = useAppLinkWithStoreFallback(testAppSlug, path)
    expect(result.isInstalled).toBe(false)
    expect(result.url).toBe('http://store.cozy.io#/discover/testapp')
  })
})
