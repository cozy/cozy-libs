import Request from './request'

describe('[Interapp] Request', () => {
  let request, cozyClient

  beforeEach(() => {
    cozyClient = {
      client: {
        fetchJSON: jest.fn().mockReturnValue(Promise.resolve({ data: [] }))
      }
    }
    request = new Request(cozyClient)
  })

  it('should initialise with cozyFetchJSON function', () => {
    expect(request.client).toEqual(cozyClient.client)
  })

  it('should get an intent', () => {
    request.get()
    expect(cozyClient.client.fetchJSON).toHaveBeenCalledTimes(1)
  })

  it('should post an intent', () => {
    request.post()
    expect(cozyClient.client.fetchJSON).toHaveBeenCalledTimes(1)
  })
})
