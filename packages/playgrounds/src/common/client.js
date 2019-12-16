import CozyClient from 'cozy-client'
import merge from 'lodash/merge'

/** Use this to quickly get a custom client */
const getClient = customOptions => {
  return new CozyClient(
    merge(
      {
        scope: [
          'io.cozy.apps',
          'io.cozy.contacts',
          'io.cozy.files',
          'io.cozy.konnectors',
          'io.cozy.procedures.administratives',
          'io.cozy.jobs:GET',
          'io.cozy.jobs:POST:zip:worker',
          'io.cozy.bank.accounts.stats',
          'io.cozy.bank.accounts',
          'io.cozy.bank.operations',
          'io.cozy.bank.settings'
        ],
        schema: {
          apps: {
            doctype: 'io.cozy.apps'
          },
          contacts: {
            doctype: 'io.cozy.contacts'
          },
          files: {
            doctype: 'io.cozy.files',
            relationships: {
              contents: {
                type: 'io.cozy.files:has-many',
                doctype: 'io.cozy.files'
              }
            }
          },
          konnectors: {
            doctype: 'io.cozy.konnectors'
          },
          administrativeProcedures: {
            doctype: 'io.cozy.procedures.administratives'
          },
          // TODO: test without the schema?
          jobs: {
            doctype: 'io.cozy.jobs'
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
