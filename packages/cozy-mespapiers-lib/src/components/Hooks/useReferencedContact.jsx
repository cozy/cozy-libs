import { getReferencedBy, useQuery, isQueryLoading } from 'cozy-client'
import { CONTACTS_DOCTYPE } from '../../doctypes'
import { buildContactsQueryByIds } from '../../helpers/queries'

/**
 * Get all contacts document from file
 */
const useReferencedContact = file => {
  const contactsReferenced = getReferencedBy(file, CONTACTS_DOCTYPE)
  const contactIds = contactsReferenced.map(ref => ref.id)
  const isContactByIdsQueryEnabled = contactIds.length > 0

  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const { data: contacts, ...contactsQueryResult } = useQuery(
    contactsQueryByIds.definition,
    {
      ...contactsQueryByIds.options,
      enabled: isContactByIdsQueryEnabled
    }
  )

  const isLoadingContacts =
    isContactByIdsQueryEnabled &&
    (isQueryLoading(contactsQueryResult) || contactsQueryResult.hasMore)

  return { contacts, isLoadingContacts }
}
export default useReferencedContact
