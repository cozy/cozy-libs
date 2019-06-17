const CozyClient = require('cozy-client').default
const CozyStackClient = require('cozy-stack-client').default

jest.mock('cozy-stack-client')

module.exports = {
  cozyClientJS: {
    _uri: 'http://test.cozy.tools:8080',
    _token: 'test-token',
    data: {
      defineIndex: jest.fn().mockResolvedValue({ name: 'index' }),
      query: jest.fn().mockResolvedValue([]),
      updateAttributes: jest.fn(),
      create: jest.fn()
    },
    fetchJSON: jest.fn().mockReturnValue({ rows: [] })
  },
  cozyClient: new CozyClient({
    stackClient: new CozyStackClient()
  })
}
