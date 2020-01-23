import { getBIModeFromCurrentLocation, updateBIConnection } from './biUtils'

describe('getBIModeFromCurrentLocation', () => {
  it('should correctly work', () => {
    const makeWindowWithLocation = host => ({
      location: {
        host
      }
    })
    expect(getBIModeFromCurrentLocation(makeWindowWithLocation())).toBe('dev')
    expect(
      getBIModeFromCurrentLocation(makeWindowWithLocation('cozy.tools:8080'))
    ).toBe('dev')
    expect(
      getBIModeFromCurrentLocation(makeWindowWithLocation('test.cozy.works'))
    ).toBe('dev')
    expect(
      getBIModeFromCurrentLocation(makeWindowWithLocation('test.cozy.rocks'))
    ).toBe('prod')
    expect(
      getBIModeFromCurrentLocation(makeWindowWithLocation('test.mycozy.cloud'))
    ).toBe('prod')
  })
})

describe('bi request', () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({}) })
  })

  afterEach(() => {
    global.fetch = null
  })

  it('should send the correct data', async () => {
    await updateBIConnection(
      { mode: 'dev', url: 'https://bi-sandox.test' },
      1337,
      { login: 'encrypted-login' },
      'bi-access-token'
    )
    expect(fetch).toHaveBeenCalledWith(
      'https://bi-sandox.test/users/me/connections/1337',
      {
        body: expect.any(Object),
        headers: {
          Authorization: 'Bearer bi-access-token',
          'User-Agent': 'cozy.bi-harvest'
        },
        method: 'PUT'
      }
    )
  })
})
