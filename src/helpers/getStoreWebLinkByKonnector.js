import { generateWebLink } from 'cozy-client'
import log from 'cozy-logger'

/**
 * @param {object} param
 * @param {CozyClient} param.client - Instance of CozyClient
 * @param {string} [param.konnectorName] - Name of Connector
 * @param {string} [param.konnectorCategory] - Category of Connector
 * @returns {string} - Link of Store where the Connector is
 */
export const getStoreWebLinkByKonnector = ({
  client,
  konnectorName,
  konnectorCategory
}) => {
  if (!konnectorName && !konnectorCategory) {
    log('error', 'konnectorName or konnectorCategory must be defined')
    return null
  }

  const hash = konnectorName
    ? `discover/${konnectorName}`
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
