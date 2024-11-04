import CozyClient from 'cozy-client'
import PouchLink from 'cozy-pouch-link'

export const getPouchLink = (client?: CozyClient): PouchLink | null => {
  if (!client) {
    return null
  }
  return client.links.find(link => link instanceof PouchLink) || null
}
