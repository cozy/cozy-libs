import Request from './request'

describe('[Interapp] Request', () => {
  let request, cozyFetchJSON

  beforeEach(() => {
    cozyFetchJSON = jest.fn()
    request = new Request(cozyFetchJSON)
  })

  it('should initialise with cozyFetchJSON function', () => {
    expect(request.cozyFetchJSON).toEqual(cozyFetchJSON)
  })

  it('should get an intent', () => {
    request.get()
    expect(cozyFetchJSON).toHaveBeenCalledTimes(1)
  })

  it('should post an intent', () => {
    request.post()
    expect(cozyFetchJSON).toHaveBeenCalledTimes(1)
  })
})
