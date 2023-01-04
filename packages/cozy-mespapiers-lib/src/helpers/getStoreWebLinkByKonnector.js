import { generateWebLink } from 'cozy-client'
import log from 'cozy-logger'

/**
 * @param {object} param
 * @param {CozyClient} param.client - Instance of CozyClient
 * @param {string} [param.konnectorName] - Name of Connector
 * @param {string} [param.konnectorCategory] - Category of Connector
 * @param {string} [param.redirectionPath] - Path to redirect from Store after connector installation
 * @returns {string} - Link of Store where the Connector is
 */
export const getStoreWebLinkByKonnector = ({
  client,
  konnectorName,
  konnectorCategory,
  redirectionPath
}) => {
  if (!konnectorName && !konnectorCategory) {
    log('error', 'konnectorName or konnectorCategory must be defined')
    return null
  }

  const encodedAppLink = redirectionPath
    ? encodeURIComponent(
        generateWebLink({
          slug: client.getInstanceOptions().app.slug,
          cozyUrl: client.getStackClient().uri,
          subDomainType: client.getInstanceOptions().subdomain,
          pathname: '/',
          hash: redirectionPath
        })
      )
    : null

  const hash = konnectorName
    ? encodedAppLink
      ? `discover/${konnectorName}?redirectAfterInstall=${encodedAppLink}`
      : `discover/${konnectorName}`
    : encodedAppLink
    ? `discover?type=konnector&category=${konnectorCategory}&redirectAfterInstall=${encodedAppLink}`
    : `discover?type=konnector&category=${konnectorCategory}`

  const webLink = generateWebLink({
    slug: 'store',
    cozyUrl: client.getStackClient().uri,
    subDomainType: client.getInstanceOptions().subdomain,
    pathname: '/',
    hash
  })

  return webLink
}
