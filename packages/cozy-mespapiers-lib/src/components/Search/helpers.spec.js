import { makeRealtimeConnection } from './helpers'

const mockT = x => x

describe('makeRealtimeConnection', () => {
  it('should return a well structured object', () => {
    const res = makeRealtimeConnection(
      ['io.cozy.files', 'io.cozy.contacts'],
      mockT
    )

    expect(res).toStrictEqual({
      'io.cozy.contacts': {
        created: expect.any(Function),
        updated: expect.any(Function)
      },
      'io.cozy.files': {
        created: expect.any(Function),
        updated: expect.any(Function)
      }
    })
  })
})
