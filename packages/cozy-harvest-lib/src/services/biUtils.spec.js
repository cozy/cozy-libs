import { getBIModeFromCozyURL, updateBIConnection } from './biUtils'

describe('getBIModeFromCurrentLocation', () => {
  it('should correctly work', () => {
    expect(getBIModeFromCozyURL()).toBe('dev')
    expect(getBIModeFromCozyURL('http://cozy.tools:8080')).toBe('dev')
    expect(getBIModeFromCozyURL('https://test.cozy.works')).toBe('dev')
    expect(getBIModeFromCozyURL('https://test.cozy.rocks')).toBe('prod')
    expect(getBIModeFromCozyURL('https://test.mycozy.cloud')).toBe('prod')
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
          Authorization: 'Bearer bi-access-token'
        },
        method: 'PUT'
      }
    )
  })
})
