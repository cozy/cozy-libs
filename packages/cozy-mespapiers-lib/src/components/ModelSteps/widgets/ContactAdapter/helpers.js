import { getDisplayName } from 'cozy-client/dist/models/contact'

/**
 * Make the display name and adds me mention if its the current user
 * @param {object} contact
 * @param {Function} t function to translate a key
 * @returns {string} display name
 */
export const makeDisplayName = (contact, t) => {
  if (contact) {
    return `${getDisplayName(contact)} ${
      contact.me ? `(${t('ContactStep.me')})` : ''
    }`
  }
  return ''
}
