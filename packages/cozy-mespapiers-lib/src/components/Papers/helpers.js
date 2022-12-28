import groupBy from 'lodash/groupBy'

import { models, getReferencedBy } from 'cozy-client'

import { CONTACTS_DOCTYPE } from '../../doctypes'
import { filterWithRemaining } from '../../helpers/filterWithRemaining'

const { getDisplayName } = models.contact

const hasContactsInFile = file => file.contacts.length > 0
const isFromConnector = file => Boolean(file.cozyMetadata?.sourceAccount)

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
  if (contacts.length === 0) {
    return
  }
  if (contacts.length === 2) {
    const firstContactName = contacts[0].name
    const secondContactName = contacts[1].name

    if (
      firstContactName != null &&
      secondContactName != null &&
      firstContactName.givenName !== '' &&
      secondContactName.givenName !== '' &&
      firstContactName.familyName !== '' &&
      firstContactName.familyName === secondContactName.familyName
    ) {
      return t('PapersList.contactMerged', {
        firstGivenName: firstContactName.givenName,
        secondGivenName: secondContactName.givenName,
        familyName: firstContactName.familyName
      })
    }
  }

  let validatedContactName = getDisplayName(contacts[0])
  if (contacts.length > 1) {
    validatedContactName += `, ${getDisplayName(contacts[1])}`
    if (contacts.length > 2) validatedContactName += ', ... '
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
 * Group files together if they come from the same contact
 * or the same list of contacts,
 * or the same sourceAccountIdentifier of the same Connector.
 * The rest is grouped together at the end in the same list.
 * @property {object[]} files - Array of IOCozyFile
 * @property {object[]} contacts - Array of IOCozyContact
 * @property {number} maxDisplay - Number of displayed files
 * @property {Function} t - i18n function
 * @returns {{ withHeader: boolean, contact: string, papers: { maxDisplay: number, list: IOCozyFile[] } }[]}
 */
export const buildFilesByContacts = ({ files, contacts, maxDisplay, t }) => {
  const result = []

  const filesByContacts = groupFilesByContacts(files, contacts)

  const { itemsFound: filesWithContacts, remainingItems } = filterWithRemaining(
    filesByContacts,
    hasContactsInFile
  )

  const filesWithoutContacts = remainingItems[0]?.files || []

  const unsortedListByContacts = filesWithContacts.map(fileWithContact => ({
    withHeader: true,
    contact: harmonizeContactsNames(fileWithContact.contacts, t),
    papers: {
      maxDisplay,
      list: fileWithContact.files
    }
  }))

  const listByContacts = unsortedListByContacts.sort((a, b) =>
    a.contact.localeCompare(b.contact)
  )

  result.push(...listByContacts)

  const {
    itemsFound: filesCreatedByConnectors,
    remainingItems: filesNotCreatedByConnectors
  } = filterWithRemaining(filesWithoutContacts, isFromConnector)

  if (filesCreatedByConnectors.length > 0) {
    const filesByConnectors = groupBy(
      filesCreatedByConnectors,
      file =>
        `${file.cozyMetadata.uploadedBy.slug}-${file.cozyMetadata.sourceAccountIdentifier}`
    )

    const unsortedlistByConnector = Object.values(filesByConnectors).map(
      value => ({
        withHeader: true,
        contact: t('PapersList.accountName', {
          name: value[0].cozyMetadata.createdByApp,
          identifier: value[0].cozyMetadata.sourceAccountIdentifier
        }),
        papers: {
          maxDisplay,
          list: value
        }
      })
    )

    const listByConnector = unsortedlistByConnector.sort((a, b) =>
      a.contact.localeCompare(b.contact)
    )

    result.unshift(...listByConnector)
  }

  if (filesNotCreatedByConnectors.length > 0) {
    const unspecified = {
      withHeader: result.length > 0,
      contact: t('PapersList.defaultName'),
      papers: {
        maxDisplay,
        list: filesNotCreatedByConnectors
      }
    }

    result.push(unspecified)
  }

  return result
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

export const getCurrentFileTheme = (params, selectedThemeLabel) =>
  params?.fileTheme ?? selectedThemeLabel
