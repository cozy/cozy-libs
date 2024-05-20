import { Document } from 'flexsearch'
import { encode } from 'flexsearch/dist/module/lang/latin/balance'

import { isFile, hasQualifications } from 'cozy-client/dist/models/file'

import { makeFileFlexsearchProps, makeContactFlexsearchProps } from './helpers'
import { CONTACTS_DOCTYPE } from '../../doctypes'

const isContact = doc => doc._type === CONTACTS_DOCTYPE

const flexsearchIndex = [
  'flexsearchProps:translated:qualificationLabel', // io.cozy.files
  'flexsearchProps:translated:metadata.bicNumber', // io.cozy.files
  'flexsearchProps:translated:metadata.refTaxIncome', // io.cozy.files
  'flexsearchProps:translated:metadata.netSocialAmount', // io.cozy.files
  'flexsearchProps:translated:metadata.contractType', // io.cozy.files
  'flexsearchProps:translated:metadata.expirationDate', // io.cozy.files
  'flexsearchProps:translated:metadata.vehicle.licenseNumber', // io.cozy.files
  'flexsearchProps:translated:metadata.vehicle.confidentialNumber', // io.cozy.files
  'flexsearchProps:translated:driverLicense', // io.cozy.files
  'flexsearchProps:translated:paymentProofFamilyAllowance', // io.cozy.files
  'flexsearchProps:translated:vehicleRegistration', // io.cozy.files
  'flexsearchProps:translated:nationalIdCard', // io.cozy.files
  'flexsearchProps:translated:bankDetails', // io.cozy.files
  'flexsearchProps:translated:paySheet', // io.cozy.files
  'flexsearchProps:translated:passport', // io.cozy.files
  'flexsearchProps:translated:residencePermit', // io.cozy.files
  'flexsearchProps:translated:phone', // io.cozy.contacts
  'flexsearchProps:translated:email', // io.cozy.contacts
  'flexsearchProps:translated:birthday', // io.cozy.contacts
  'flexsearchProps:translated:address', // io.cozy.contacts
  // for the following attributes, ensure that they are retrieved by the query if it performs a `select`
  'metadata:number', // io.cozy.files
  'metadata:vehicle:licenseNumber', // io.cozy.files
  'metadata:vehicle:confidentialNumber', // io.cozy.files
  'metadata:bicNumber', // io.cozy.files
  'metadata:refTaxIncome', // io.cozy.files
  'metadata:netSocialAmount', // io.cozy.files
  'metadata:expirationDate', // io.cozy.files
  'fullname', // io.cozy.contacts
  'name', // io.cozy.files, io.cozy.contacts
  'birthday', // io.cozy.contacts
  // We do not use an array here but flat indexes, see https://github.com/nextapps-de/flexsearch/issues/383
  // We use the number 7 arbitrarily, we assume that it is a correct value for emails and phones
  ...Array.from(Array(7), (_, idx) => `flexsearchProps:email[${idx}].address`), // io.cozy.contacts
  ...Array.from(Array(7), (_, idx) => `flexsearchProps:phone[${idx}].number`), // io.cozy.contacts
  ...Array.from(
    Array(5),
    (_, idx) => `flexsearchProps:address[${idx}].formattedAddress`
  ), // io.cozy.contacts
  'company', // io.cozy.contacts
  'jobTitle' // io.cozy.contacts
]

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
  encode,
  document: {
    id: '_id',
    tag: 'flexsearchProps:tag',
    index: flexsearchIndex
  }
})

export const addFileDoc = ({ index, doc, scannerT }) => {
  if (!scannerT) return null

  if (hasQualifications(doc)) {
    return index.add({
      ...doc,
      flexsearchProps: makeFileFlexsearchProps({ doc, scannerT })
    })
  }
}

export const addContactDoc = ({ index, doc, t }) => {
  return index.add({
    ...doc,
    flexsearchProps: makeContactFlexsearchProps(doc, t)
  })
}

export const addDoc = ({ index, doc, scannerT, t }) => {
  if (isFile(doc)) {
    addFileDoc({ index, doc, scannerT })
  } else if (isContact(doc)) {
    addContactDoc({ index, doc, t })
  }
}

// We do not store the documents in the flexsearch store, only the _id and _type.
// To retrieve the documents, we make a link with the _id.
// So there is no update of the index to do, only additions and deletions.
// The update of the document is managed by the realtime.
export const updateDoc = ({ index, doc, scannerT, t }) => {
  if (isFile(doc) && doc.trashed) {
    index.remove(doc._id)
  } else {
    addDoc({ index, doc, scannerT, t }) // will perform update if id already indexed, see https://github.com/nextapps-de/flexsearch#append-contents
  }
}
