import Interapp from '.'

describe('Interapp', () => {
  it('should initialise with cozy fetchJSON function', () => {
    const fetchJSON = jest.fn()
    const interapp = new Interapp({ fetchJSON })
    expect(interapp.request.cozyFetchJSON).toEqual(fetchJSON)
  })

  it('should initialise with cozy client function', () => {
    const client = { client: { fetchJSON: jest.fn() } }
    const interapp = new Interapp({ client })
    expect(interapp.request.cozyFetchJSON).toEqual(client.client.fetchJSON)
  })
})
