import CozyClient from 'cozy-client'
import PouchLink from 'cozy-pouch-link'
import { LinkPlatform } from 'cozy-pouch-link/types/types'

import { getPouchLink } from './client'

test('should retrieve PouchLink from client', () => {
  const pouchLinkOptions = {
    doctypes: ['io.cozy.files'],
    initialSync: true,
    periodicSync: false,
    platform: {} as LinkPlatform,
    doctypesReplicationOptions: {
      'io.cozy.files': {
        strategy: 'fromRemote'
      }
    }
  }
  const pouchLink = new PouchLink(pouchLinkOptions)
  const client = new CozyClient({
    links: [pouchLink]
  })

  const result = getPouchLink(client)

  expect(result).toBe(pouchLink)
})

test('should return null if no client', () => {
  const result = getPouchLink(undefined)

  expect(result).toBe(null)
})

test('should return null if no PouchLink found', () => {
  const client = new CozyClient()

  const result = getPouchLink(client)

  expect(result).toBe(null)
})
