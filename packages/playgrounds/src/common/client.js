import CozyClient from 'cozy-client'

export default new CozyClient({
  scope: ['io.cozy.apps', 'io.cozy.konnectors'],
  schema: {
    apps: {
      doctype: 'io.cozy.apps'
    },
    konnectors: {
      doctype: 'io.cozy.konnectors'
    }
  },
  oauth: {
    clientName: 'Example App',
    softwareID: 'io.cozy.example',
    redirectURI: 'http://localhost:1234/auth'
  }
})
