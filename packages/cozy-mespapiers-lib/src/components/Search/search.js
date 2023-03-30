import { Document } from 'flexsearch'

import { isFile, hasQualifications } from 'cozy-client/dist/models/file'
import flag from 'cozy-flags'

import { makeFileFlexsearchProps, makeContactFlexsearchProps } from './helpers'
import { CONTACTS_DOCTYPE } from '../../doctypes'

const isContact = doc => doc._type === CONTACTS_DOCTYPE

const flexsearchIndex = [
  'flexsearchProps:translatedQualificationLabel', // io.cozy.files
  'metadata:number', // io.cozy.files
  'fullname', // io.cozy.contacts
  'name', // io.cozy.files, io.cozy.contacts
  'birthday', // io.cozy.contacts
  'birthcity', // io.cozy.contacts
  // We do not use an array here but flat indexes, see https://github.com/nextapps-de/flexsearch/issues/383
  // We use the number 7 arbitrarily, we assume that it is a correct value for emails and phones
  ...Array.from(Array(7), (_, idx) => `flexsearchProps:email[${idx}].address`), // io.cozy.contacts
  ...Array.from(Array(7), (_, idx) => `flexsearchProps:phone[${idx}].number`), // io.cozy.contacts
  'company', // io.cozy.contacts
  'jobTitle' // io.cozy.contacts
]
if (!flag('mespapiers.migrated.metadata')) {
  flexsearchIndex.splice(1, 0, 'metadata:ibanNumber') // io.cozy.files
  flexsearchIndex.splice(3, 0, 'metadata:passportNumber') // io.cozy.files
  flexsearchIndex.splice(4, 0, 'metadata:vinNumber') // io.cozy.files
  flexsearchIndex.splice(5, 0, 'metadata:refTaxIncome') // io.cozy.files
  flexsearchIndex.splice(6, 0, 'metadata:cardNumber') // io.cozy.files
  flexsearchIndex.splice(7, 0, 'metadata:cafFileNumber') // io.cozy.files
}

/** The index document will store _id for each document having the declared indexed fields,
 * coming from both `io.cozy.files` and `io.cozy.contacts`.
 * Note some special fields are prefixed with `flexsearchProps` as they are not actual doc attributes,
 * but they are dynamically built when a doc is added to the index.
 * `tag` is a special concept allowing to search by category, i.e. "identity", "family", etc.
 * We use _id of doc as index ids, the risk of having the same id between two inter doctype documents is considered to be sufficiently low
 * The order of indexes declaration impact the order of the resulting documents.
 */
export const index = new Document({
  tokenize: 'full',
  document: {
    id: '_id',
    tag: 'flexsearchProps:tag',
    index: flexsearchIndex
  }
})

export const addFileDoc = ({ index, doc, scannerT, t }) => {
  if (hasQualifications(doc)) {
    return index.add({
      ...doc,
      flexsearchProps: makeFileFlexsearchProps({ doc, scannerT, t })
    })
  }
}

export const addContactDoc = (index, doc) => {
  return index.add({
    ...doc,
    flexsearchProps: makeContactFlexsearchProps(doc)
  })
}

export const addDoc = ({ index, doc, scannerT, t }) => {
  if (isFile(doc)) {
    addFileDoc({ index, doc, scannerT, t })
  } else if (isContact(doc)) {
    addContactDoc(index, doc)
  }
}

// We do not store the documents in the flexsearch store, only the _id and _type.
// To retrieve the documents, we make a link with the _id.
// So there is no update of the index to do, only additions and deletions.
// The update of the document is managed by the realtime.
export const updateDoc = ({ index, doc, t }) => {
  if (isFile(doc) && doc.trashed) {
    index.remove(doc._id)
  } else {
    addDoc({ index, doc, t }) // will perform update if id already indexed, see https://github.com/nextapps-de/flexsearch#append-contents
  }
}
