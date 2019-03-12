import Request from './request'

describe('[Interapp] Request', () => {
  let request, cozyClient

  beforeEach(() => {
    cozyClient = {
      stackClient: {
        fetchJSON: jest.fn().mockReturnValue(Promise.resolve({ data: [] }))
      }
    }
    request = new Request(cozyClient)
  })

  it('should initialise with cozyFetchJSON function', () => {
    expect(request.stackClient).toEqual(cozyClient.stackClient)
  })

  it('should get an intent', () => {
    request.get()
    expect(cozyClient.stackClient.fetchJSON).toHaveBeenCalledTimes(1)
  })

  it('should post an intent', () => {
    request.post()
    expect(cozyClient.stackClient.fetchJSON).toHaveBeenCalledTimes(1)
  })
})
