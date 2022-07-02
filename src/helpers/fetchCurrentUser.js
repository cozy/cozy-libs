import { CONTACTS_DOCTYPE } from '../doctypes'

export const fetchCurrentUser = async client => {
  const contactCollection = client.collection(CONTACTS_DOCTYPE)
  const { data: currentUser } = await contactCollection.findMyself()

  return currentUser[0]
}
