import { Document } from 'flexsearch'

import { models } from 'cozy-client'

import { CONTACTS_DOCTYPE } from '../../doctypes'

const {
  document: {
    themes: { themesList }
  },
  file: { isFile }
} = models

export const index = new Document({
  document: {
    id: '_id',
    tag: 'flexsearchProps:tag',
    index: [
      'flexsearchProps:name',
      'flexsearchProps:translatedQualificationLabel',
      'flexsearchProps:fullname',
      'flexsearchProps:birthday',
      'flexsearchProps:birthcity',
      'flexsearchProps:email',
      'flexsearchProps:civility',
      'flexsearchProps:company',
      'flexsearchProps:jobTitle'
    ],
    store: ['_id', '_type']
  }
})

export const makeFileTags = file => {
  const item = file.metadata.qualification
  const tags = themesList
    .filter(theme => {
      return theme.items.some(it => it.label === item.label)
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
  return index.add({
    ...doc,
    flexsearchProps: {
      tag: makeFileTags(doc),
      name: doc.name,
      translatedQualificationLabel: t(
        `items.${doc.metadata.qualification.label}`
      )
    }
  })
}

export const addContactDoc = (index, doc) => {
  return index.add({
    ...doc,
    flexsearchProps: {
      tag: makeContactTags(doc),
      fullname: doc.fullname,
      birthday: doc.birthday,
      birthcity: doc.birthcity,
      email: doc.email?.[0]?.address,
      civility: doc.civility,
      company: doc.company,
      jobTitle: doc.jobTitle
    }
  })
}

export const addDocs = ({ index, docs, t }) => {
  for (const doc of docs) {
    if (isFile(doc)) {
      addFileDoc(index, doc, t)
    } else if (doc._type === CONTACTS_DOCTYPE) {
      addContactDoc(index, doc)
    }
  }
}
