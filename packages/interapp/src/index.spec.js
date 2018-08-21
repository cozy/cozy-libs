import Interapp from '.'

describe('Interapp', () => {
  it('should initialise with cozyFetchJSON function', () => {
    const cozyFetchJSON = jest.fn()
    const interapp = new Interapp(cozyFetchJSON) // cozyFetchJSON = cozyClient.client.fetchJSON
    expect(interapp.request.cozyFetchJSON).toEqual(cozyFetchJSON)
  })
})
