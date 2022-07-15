import groupBy from 'lodash/groupBy'

import { models, getReferencedBy } from 'cozy-client'

import { CONTACTS_DOCTYPE } from '../../doctypes'
import { filterWithRemaining } from '../../helpers/filterWithRemaining'

const { getDisplayName } = models.contact

const hasContactsInFile = file => file.contacts.length > 0

/**
 * Get all contact ids referenced on files
 *
 * @param {IOCozyFile[]} files - Array of IOCozyFile
 * @returns {string[]} - Array of contact ids
 */
export const getContactsRefIdsByFiles = (files = []) => {
  return [
    ...new Set(
      files.flatMap(file => {
        return getReferencedBy(file, CONTACTS_DOCTYPE).map(
          contactRef => contactRef.id
        )
      })
    )
  ]
}

/**
 * Harmonize contact names based on number of contacts and their last name
 * - If there are more than 2 contacts, then "..." is added after the contact names.
 * - If the names of the contacts are identical (and there are only 2 of them), then they are merged (e.g. Alice and Bob Durand)
 *
 * @property {object[]} contacts - Array of io.cozy.contacts
 * @property {Function} t - i18n function
 * @returns {string} Names of the contacts
 */
export const harmonizeContactsNames = (contacts, t) => {
  const contactNameList = contacts.map(contact => getDisplayName(contact))

  if (contactNameList.length === 2) {
    const firstContactName = contacts[0].name
    const secondContactName = contacts[1].name

    if (firstContactName.familyName === secondContactName.familyName) {
      return t('PapersList.contactMerged', {
        firstGivenName: firstContactName.givenName,
        secondGivenName: secondContactName.givenName,
        familyName: firstContactName.familyName
      })
    }
  }

  let validatedContactName = contactNameList[0]
  if (contactNameList.length > 1) {
    validatedContactName += `, ${getDisplayName(contacts[1])}`
    if (contactNameList.length > 2) validatedContactName += ', ... '
  }

  return validatedContactName
}

/**
 * Group the IOCozyFiles with their IOCozyContact
 *
 * @property {IOCozyFile[]} filesArg - Array of IOCozyFile
 * @property {IOCozyContact[]} contactsArg - Array of IOCozyContact
 * @returns {{ contacts: IOCozyContact[], files: IOCozyFile[] }}
 */
export const groupFilesByContacts = (filesArg, contactsArg) => {
  return Object.entries(
    groupBy(filesArg, file => getContactsRefIdsByFiles([file]))
  ).map(([contactStringIds, files]) => {
    const contactListFiltered = contactsArg.filter(contact =>
      contactStringIds.includes(contact._id)
    )

    return {
      contacts: contactListFiltered,
      files
    }
  })
}

/**
 * @property {object[]} files - Array of IOCozyFile
 * @property {object[]} contacts - Array of IOCozyContact
 * @property {number} maxDisplay - Number of displayed files
 * @property {Function} t - i18n function
 * @returns {{ withHeader: boolean, contact: string, papers: { maxDisplay: number, list: IOCozyFile[] } }[]}
 */
export const buildFilesByContacts = ({ files, contacts, maxDisplay, t }) => {
  const filesByContacts = groupFilesByContacts(files, contacts)

  const {
    itemsFound: filesWithContacts,
    remainingItems: filesWithoutContacts
  } = filterWithRemaining(filesByContacts, hasContactsInFile)

  const withHeader = !(
    filesWithoutContacts[0]?.files.length === files.length && files.length > 0
  )

  const result = filesWithContacts.map(fileWithContact => ({
    withHeader,
    contact: harmonizeContactsNames(fileWithContact.contacts, t),
    papers: {
      maxDisplay,
      list: fileWithContact.files
    }
  }))

  const resultSorted = result.sort((a, b) => a.contact.localeCompare(b.contact))

  if (filesWithoutContacts.length > 0) {
    resultSorted.push({
      withHeader,
      contact: t('PapersList.defaultName'),
      papers: {
        maxDisplay,
        list: filesWithoutContacts.flatMap(
          fileWithoutContact => fileWithoutContact.files
        )
      }
    })
  }

  return resultSorted
}

/**
 * Group an IOCozyFiles with the names of the associated contacts
 *
 * @param {object} param
 * @param {object[]} param.files - Array of IOCozyFile
 * @param {object[]} param.contacts - Array of IOCozyContact
 * @param {Function} param.t - i18n function
 * @returns {{ file: object, contacts: string }}
 */
export const buildFilesWithContacts = ({ files, contacts, t }) => {
  const filesByContacts = groupFilesByContacts(files, contacts)

  return filesByContacts.flatMap(fileByContacts => {
    return fileByContacts.files.map(file => {
      return {
        file,
        contact: harmonizeContactsNames(fileByContacts.contacts, t)
      }
    })
  })
}
