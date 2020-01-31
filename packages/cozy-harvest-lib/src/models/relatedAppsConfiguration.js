import get from 'lodash/get'

const relatedAppsConfiguration = [
  {
    slug: 'banks',
    predicate: ({ konnectorManifest }) => {
      return (
        Array.isArray(konnectorManifest.data_types) &&
        konnectorManifest.data_types.includes('bankAccounts')
      )
    }
  },
  {
    slug: 'contacts',
    predicate: ({ konnectorManifest }) => {
      return (
        Array.isArray(konnectorManifest.data_types) &&
        konnectorManifest.data_types.includes('contact')
      )
    }
  },
  {
    slug: 'drive',
    predicate: ({ trigger }) => {
      return !!get(trigger, 'message.folder_to_save')
    }
  }
]

export default relatedAppsConfiguration
