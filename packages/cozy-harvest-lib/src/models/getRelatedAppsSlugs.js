import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import flag from 'cozy-flags'

/**
 * Exporting relatedAppsConfiguration is useful for overrides
 */
export const relatedAppsConfiguration = [
  {
    slug: 'coachco2',
    priority: 3,
    predicate: ({ konnectorManifest }) => {
      return (
        Array.isArray(konnectorManifest.data_types) &&
        konnectorManifest.data_types.includes('geojson')
      )
    }
  },
  {
    slug: 'banks',
    priority: 2,
    predicate: ({ konnectorManifest }) => {
      return (
        Array.isArray(konnectorManifest.data_types) &&
        konnectorManifest.data_types.includes('bankAccounts')
      )
    }
  },
  {
    slug: 'contacts',
    priority: 1,
    predicate: ({ konnectorManifest }) => {
      return (
        Array.isArray(konnectorManifest.data_types) &&
        konnectorManifest.data_types.includes('contact')
      )
    }
  },
  {
    slug: 'drive',
    priority: 0,
    predicate: ({ trigger }) => {
      if (flag('harvest.datacards.files')) {
        return false
      }
      return !!get(trigger, 'message.folder_to_save')
    }
  }
]

const getRelatedAppsSlugs = ({ konnectorManifest, trigger }) => {
  const matchingApps = relatedAppsConfiguration.filter(app =>
    app.predicate({ konnectorManifest, trigger })
  )

  return sortBy(matchingApps, ({ priority }) => -priority).map(
    ({ slug }) => slug
  )
}

export default getRelatedAppsSlugs
