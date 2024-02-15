import { generateWebLink } from 'cozy-client'
import { isContact } from 'cozy-client/dist/models/contact'
import { isFile } from 'cozy-client/dist/models/file'

export const makeFlexsearchResultLineOnClick = ({
  client,
  doc,
  navigate,
  navigateState,
  isMultiSelectionActive,
  changeCurrentMultiSelectionFile
}) => {
  if (isContact(doc)) {
    return () => {
      const contactId = doc._id
      const webLink = generateWebLink({
        slug: 'contacts',
        cozyUrl: client.getStackClient().uri,
        subDomainType: client.getInstanceOptions().subdomain,
        pathname: '/',
        hash: `/${contactId}`
      })

      window.open(webLink, '_blank')
    }
  }

  if (isFile(doc)) {
    return () => {
      const qualificationLabel = doc?.metadata?.qualification?.label

      if (isMultiSelectionActive) {
        changeCurrentMultiSelectionFile(doc)
      } else {
        navigate(`/paper/files/${qualificationLabel}/${doc._id}`, {
          state: navigateState
        })
      }
    }
  }
}
