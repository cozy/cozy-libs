import Intents from './intents'

describe('Interapp', () => {
  it('should initialise with cozy client', () => {
    const client = { client: { fetchJSON: jest.fn() } }
    const intents = new Intents({ client })
    expect(intents.request.cozyFetchJSON).toEqual(client.client.fetchJSON)
  })
})
