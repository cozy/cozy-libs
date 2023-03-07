import { Document } from 'flexsearch'

import { themesList } from 'cozy-client/dist/models/document/documentTypeData'
import { isFile, hasQualifications } from 'cozy-client/dist/models/file'

import { CONTACTS_DOCTYPE } from '../../doctypes'

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
      'flexsearchProps:email', // io.cozy.contacts
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
    flexsearchProps: {
      tag: makeContactTags(doc),
      email: doc.email?.[0]?.address
    }
  })
}

export const addDoc = ({ index, doc, t }) => {
  if (isFile(doc)) {
    addFileDoc(index, doc, t)
  } else if (doc._type === CONTACTS_DOCTYPE) {
    addContactDoc(index, doc)
  }
}

export const addDocs = ({ index, docs, t }) => {
  for (const doc of docs) {
    addDoc({ index, doc, t })
  }
}
