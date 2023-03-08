import { Document } from 'flexsearch'

import { themesList } from 'cozy-client/dist/models/document/documentTypeData'
import { isFile, hasQualifications } from 'cozy-client/dist/models/file'

import { FILES_DOCTYPE, CONTACTS_DOCTYPE } from '../../doctypes'

/** The index document will store (_id, _type) couples for each document having the declared indexed fields,
 * coming from both `io.cozy.files` and `io.cozy.contacts`.
 * Note some special fields are prefixed with `flexsearchProps` as they are not actual doc attributes,
 * but they are dynamically built when a doc is added to the index.
 * `tag` is a special concept allowing to search by category, i.e. "identity", "family", etc.
 * We use _id of doc as index ids, the risk of having the same id between two inter doctype documents is considered to be sufficiently low
 */
export const index = new Document({
  document: {
    id: '_id',
    tag: 'flexsearchProps:tag',
    index: [
      'name', // io.cozy.files, io.cozy.contacts
      'flexsearchProps:translatedQualificationLabel', // io.cozy.files
      'fullname', // io.cozy.contacts
      'birthday', // io.cozy.contacts
      'birthcity', // io.cozy.contacts
      'email[]:address', // io.cozy.contacts
      'civility', // io.cozy.contacts
      'company', // io.cozy.contacts
      'jobTitle' // io.cozy.contacts
    ],
    store: ['_id', '_type']
  }
})

export const makeFileTags = file => {
  const item = file.metadata?.qualification
  const tags = themesList
    .filter(theme => {
      return theme.items.some(it => it.label === item?.label)
    })
    .map(x => x.label)
  return tags
}

export const makeContactTags = contact => {
  const contactTags = []

  const themesByAttributes = {
    givenName: ['identity'],
    familyName: ['identity'],
    phone: ['home', 'work_study', 'identity'],
    email: ['work_study', 'identity'],
    cozy: ['identity'],
    address: ['home', 'work_study', 'identity'],
    birthday: ['identity'],
    company: ['work_study'],
    jobTitle: ['work_study']
  }

  Object.keys(themesByAttributes).map(attribute => {
    const preAttribute = ['givenName', 'familyName'].includes(attribute)
      ? 'name'
      : undefined

    const value = preAttribute
      ? contact?.[preAttribute]?.[attribute]
      : contact?.[attribute]

    const themes = themesByAttributes[attribute]

    if (value && value.length > 0) {
      themes.forEach(theme => {
        if (!contactTags.includes(theme)) {
          contactTags.push(theme)
        }
      })
    }
  })

  return contactTags
}

export const addFileDoc = (index, doc, t) => {
  if (hasQualifications(doc)) {
    return index.add({
      ...doc,
      _type: doc._type || doc.type || FILES_DOCTYPE, // should be useless after solving https://github.com/cozy/cozy-libs/issues/2023
      flexsearchProps: {
        tag: makeFileTags(doc),
        translatedQualificationLabel: t(
          `items.${doc.metadata.qualification.label}`
        )
      }
    })
  }
}

export const addContactDoc = (index, doc) => {
  return index.add({
    ...doc,
    _type: doc._type || doc.type || CONTACTS_DOCTYPE, // should be useless after solving https://github.com/cozy/cozy-libs/issues/2023
    flexsearchProps: {
      tag: makeContactTags(doc)
    }
  })
}

export const addDoc = ({ index, doc, t }) => {
  if (isFile(doc)) {
    addFileDoc(index, doc, t)
  } else {
    // ⚠️ io.cozy.contacts is implicit here, we should solve https://github.com/cozy/cozy-libs/issues/2023
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
