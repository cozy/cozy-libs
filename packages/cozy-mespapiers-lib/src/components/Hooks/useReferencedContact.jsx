import { getReferencedBy, useQuery, isQueryLoading } from 'cozy-client'

import { CONTACTS_DOCTYPE } from '../../doctypes'
import { buildContactsQueryByIds } from '../../helpers/queries'

/**
 * Get all contacts document referenced in files
 *
 * @param {import('cozy-client/types/types').IOCozyFile[]} files
 * @returns {{ contacts: object[], isLoadingContacts: boolean }}
 */
const useReferencedContact = files => {
  const contactIdsReferenced = new Set()
  for (const file of files) {
    for (const ref of getReferencedBy(file, CONTACTS_DOCTYPE)) {
      contactIdsReferenced.add(ref.id)
    }
  }
  const isContactByIdsQueryEnabled = contactIdsReferenced.size > 0

  const contactsQueryByIds = buildContactsQueryByIds(
    Array.from(contactIdsReferenced),
    isContactByIdsQueryEnabled
  )
  const { data: contacts, ...contactsQueryResult } = useQuery(
    contactsQueryByIds.definition,
    contactsQueryByIds.options
  )

  const isLoadingContacts =
    isContactByIdsQueryEnabled &&
    (isQueryLoading(contactsQueryResult) || contactsQueryResult.hasMore)

  return { contacts, isLoadingContacts }
}
export default useReferencedContact
