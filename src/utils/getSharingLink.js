import { generateWebLink } from 'cozy-client'

import { FILES_DOCTYPE, PERMISSIONS_DOCTYPE } from '../doctypes'

export const getSharingLink = async (client, file, isFlatDomain) => {
  const PERMS = {
    _type: PERMISSIONS_DOCTYPE,
    permissions: {
      files: { type: FILES_DOCTYPE, values: [file._id], verbs: ['GET'] }
    }
  }
  const { data: sharedLink } = await client.save(PERMS)

  const webLink = generateWebLink({
    cozyUrl: client.getStackClient().uri,
    searchParams: [['sharecode', sharedLink?.attributes?.shortcodes?.code]],
    pathname: '/public',
    slug: 'drive',
    subDomainType: isFlatDomain ? 'flat' : 'nested'
  })

  return webLink
}
