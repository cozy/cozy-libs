import { CONTACTS_DOCTYPE } from '../doctypes'

/**
 * Fetch the current user
 * @param {import('cozy-client/types/CozyClient').default} client - CozyClient instance
 * @returns {Promise<import('cozy-client/types/types').IOCozyContact | null>}
 */
export const fetchCurrentUser = async client => {
  try {
    const contactCollection = client.collection(CONTACTS_DOCTYPE)
    const { data: currentUser } = await contactCollection.findMyself()

    return currentUser[0] || null
  } catch (error) {
    return null
  }
}
