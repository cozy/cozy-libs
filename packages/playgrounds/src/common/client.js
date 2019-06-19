import CozyClient from 'cozy-client'
import merge from 'lodash/merge'

/** Use this to quickly get a custom client */
const getClient = customOptions => {
  return new CozyClient(
    merge(
      {
        scope: ['io.cozy.apps', 'io.cozy.contacts', 'io.cozy.konnectors'],
        schema: {
          apps: {
            doctype: 'io.cozy.apps'
          },
          contacts: {
            doctype: 'io.cozy.contacts'
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
      },
      customOptions
    )
  )
}

/** A generic CozyClient meant to be used by all examples  */
export default getClient()
