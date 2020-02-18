import { updateBIConnection } from './bi-http'

describe('bi request', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1337 })
    })
  })

  afterEach(() => {
    global.fetch = null
  })

  it('should handle errors', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      text: () =>
        Promise.resolve(
          '{ "message": "Wrong credentials", "code": "wrongpass"}'
        )
    })
    await expect(
      updateBIConnection(
        { mode: 'dev', url: 'https://bi-sandox.test' },
        1337,
        { login: 'encrypted-login' },
        'bi-access-token'
      )
    ).rejects.toEqual(new Error('Wrong credentials'))
  })

  it('should send the correct data', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1337
        })
    })
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
        method: 'POST'
      }
    )
  })

  it('should return the correct data', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1337 })
    })
    const resp = await updateBIConnection(
      { mode: 'dev', url: 'https://bi-sandox.test' },
      1337,
      { login: 'encrypted-login' },
      'bi-access-token'
    )
    expect(resp.id).toBe(1337)
  })

  it('should return the correct data when connection is wrapped', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Connection cannot be updated at the moment',
          connection: {
            id: 1338
          }
        })
    })
    const resp = await updateBIConnection(
      { mode: 'dev', url: 'https://bi-sandox.test' },
      1338,
      { login: 'encrypted-login' },
      'bi-access-token'
    )
    expect(resp.id).toBe(1338)
  })
})
