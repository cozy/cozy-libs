import sortBy from 'lodash/sortBy'

/**
 * Exporting relatedAppsConfiguration is useful for overrides
 */
export const relatedAppsConfiguration = [
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
