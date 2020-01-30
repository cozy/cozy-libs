import { updateBIConnection } from './bi-http'

describe('bi request', () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
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
