export const APPS_DOCTYPE = 'io.cozy.apps'
export const CONTACTS_DOCTYPE = 'io.cozy.contacts'
export const FILES_DOCTYPE = 'io.cozy.files'
export const PERMISSIONS_DOCTYPE = 'io.cozy.permissions'
export const SETTINGS_DOCTYPE = 'io.cozy.mespapiers.settings'

// the documents schema, necessary for CozyClient
export default {
  contacts: {
    doctype: CONTACTS_DOCTYPE,
    attributes: {},
    relationships: {}
  },
  files: {
    doctype: FILES_DOCTYPE,
    attributes: {},
    relationships: {}
  }
}
