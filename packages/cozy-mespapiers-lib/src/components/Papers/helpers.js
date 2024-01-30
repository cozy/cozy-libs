import groupBy from 'lodash/groupBy'

import { models, getReferencedBy } from 'cozy-client'
import { getAccountName } from 'cozy-client/dist/models/account'
import { getThemeByItem } from 'cozy-client/dist/models/document/documentTypeDataHelpers'
import { fetchURL } from 'cozy-client/dist/models/note'

import { DEFAULT_MAX_FILES_DISPLAYED } from '../../constants/const'
import { CONTACTS_DOCTYPE } from '../../doctypes'
import { filterWithRemaining } from '../../helpers/filterWithRemaining'

export const RETURN_URL_KEY = 'returnUrl'

const { getDisplayName } = models.contact

const hasContactsInFile = file => file.contacts.length > 0
const isFromKonnector = file => {
  return Boolean(file.cozyMetadata?.sourceAccountIdentifier)
}

/**
 * Get all contact ids referenced on files
 *
 * @param {import('cozy-client/types/types').IOCozyFile[]} files - Array of IOCozyFile
 * @returns {string[]} - Array of io.cozy.contacts ids
 */
export function getContactsRefIdsByFiles(files) {
  if (!files) return []

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
 * @param {object[]} contacts - Array of io.cozy.contacts
 * @param {Function} t - i18n function
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
 * @param {import('cozy-client/types/types').IOCozyFile[]} filesArg - Array of IOCozyFile
 * @param {object[]} contactsArg - Array of io.cozy.contact
 * @returns {{ contacts: object[], files: import('cozy-client/types/types').IOCozyFile[] }}
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
      withMyself: contactListFiltered.some(contact => contact.me),
      files
    }
  })
}

/**
 * Group files together if they come from the same contact
 * or the same list of contacts,
 * or the same sourceAccountIdentifier of the same Konnector.
 * The rest is grouped together at the end in the same list.
 *
 * @param {object} option
 * @param {import('cozy-client/types/types').IOCozyFile[]} option.files - Array of IOCozyFile
 * @param {object[]} option.contacts - Array of io.cozy.contact
 * @param {boolean} option.hasMultipleAccounts - Has multiple accounts
 * @param {import('cozy-client/types/types').IOCozyKonnector[]} option.konnectors - Array of IOCozyKonnector
 * @param {number} option.maxDisplay - Number of displayed files
 * @param {Function} option.t - i18n function
 * @returns {{ withHeader: boolean, contact: string, papers: { maxDisplay: number, list: IOCozyFile[] } }[]}
 */
export const buildFilesByContacts = ({
  files,
  contacts,
  hasMultipleAccounts,
  konnectors = [],
  maxDisplay = DEFAULT_MAX_FILES_DISPLAYED,
  t
}) => {
  const result = []
  const isAloneContactOrKonnector =
    [...contacts, ...konnectors].length <= 1 && !hasMultipleAccounts

  const {
    itemsFound: filesCreatedByKonnectors,
    remainingItems: filesNotCreatedByKonnectors
  } = filterWithRemaining(files, isFromKonnector)

  if (filesCreatedByKonnectors.length > 0) {
    const filesByKonnectors = groupBy(
      filesCreatedByKonnectors,
      file =>
        `${file.cozyMetadata.createdByApp}-${file.cozyMetadata.sourceAccountIdentifier}`
    )

    const unsortedlistByKonnector = Object.values(filesByKonnectors).map(
      value => ({
        withHeader: true,
        konnector: konnectors?.find(
          konnector => konnector.slug === value[0].cozyMetadata.createdByApp
        ),
        contact: t('PapersList.accountName', {
          name: value[0].cozyMetadata.createdByApp,
          identifier: value[0].cozyMetadata.sourceAccountIdentifier
        }),
        withMyself: false,
        papers: {
          maxDisplay: isAloneContactOrKonnector
            ? DEFAULT_MAX_FILES_DISPLAYED
            : maxDisplay,
          list: value
        }
      })
    )

    const listByKonnector = unsortedlistByKonnector.sort((a, b) =>
      a.contact.localeCompare(b.contact)
    )

    result.push(...listByKonnector)
  }

  const filesByContacts = groupFilesByContacts(
    filesNotCreatedByKonnectors,
    contacts
  )

  const {
    itemsFound: filesByContactsWithContacts,
    remainingItems: filesByContactsWithoutContacts
  } = filterWithRemaining(filesByContacts, hasContactsInFile)

  if (filesByContactsWithContacts.length > 0) {
    const unsortedListByContacts = filesByContactsWithContacts.map(value => ({
      withHeader: true,
      contact: harmonizeContactsNames(value.contacts, t),
      withMyself: value.withMyself,
      papers: {
        maxDisplay: isAloneContactOrKonnector
          ? DEFAULT_MAX_FILES_DISPLAYED
          : maxDisplay,
        list: value.files
      }
    }))

    const { itemsFound: filesWithMyself, remainingItems: filesWithoutMyself } =
      filterWithRemaining(
        unsortedListByContacts,
        ({ withMyself }) => withMyself
      )
    const sortedFilesWithMyself = [...filesWithMyself].sort((a, b) =>
      a.contact.localeCompare(b.contact)
    )
    const sortedFilesWithoutMyself = [...filesWithoutMyself].sort((a, b) =>
      a.contact.localeCompare(b.contact)
    )

    result.push(...sortedFilesWithMyself, ...sortedFilesWithoutMyself)
  }

  const unspecifiedFiles = filesByContactsWithoutContacts[0]?.files || []

  if (unspecifiedFiles.length > 0) {
    const unspecified = {
      withHeader: result.length > 0,
      contact: t('PapersList.defaultName'),
      withMyself: false,
      papers: {
        maxDisplay: isAloneContactOrKonnector
          ? DEFAULT_MAX_FILES_DISPLAYED
          : maxDisplay,
        list: unspecifiedFiles
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
 * @param {import('cozy-client/types/types').IOCozyFile[]} param.files - Array of IOCozyFile
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

export const getCurrentQualificationLabel = (
  params,
  selectedQualificationLabel
) => params?.qualificationLabel ?? selectedQualificationLabel

export const makeAccountFromPapers = (papers, accounts) => {
  const accountLogin = papers?.list?.[0]?.cozyMetadata?.sourceAccountIdentifier
  const account = accountLogin
    ? accounts?.find(account => getAccountName(account) === accountLogin)
    : undefined

  return account
}

export const makeQualificationLabelsWithoutFiles = (
  konnectorsWithAccounts,
  selectedTheme
) => {
  return konnectorsWithAccounts
    .flatMap(({ konnectorQualifLabelsWithoutFile }) => {
      return konnectorQualifLabelsWithoutFile?.map(qualificationLabel => {
        const themeLabel = getThemeByItem({ label: qualificationLabel }).label
        const showCategoryItemByKonnector =
          !selectedTheme || selectedTheme.label === themeLabel

        return showCategoryItemByKonnector ? qualificationLabel : undefined
      })
    })
    .filter(x => x)
}

/**
 * Create the URL to be used to edit a note
 *
 * @param {import('cozy-client/types/CozyClient').default} client CozyClient instance
 * @param {import('cozy-client/types/types').IOCozyFile} file io.cozy.file object
 * @param {string} returnUrl URL to use as returnUrl if you don't want the current location
 * @returns {Promise<string>} URL where one can edit the note
 */
export const generateReturnUrlToNotesIndex = async (
  client,
  file,
  returnUrl
) => {
  const rawUrl = fetchURL(client, file)
  const back = window.location.toString()
  const dest = new URL(await rawUrl)
  dest.searchParams.set(RETURN_URL_KEY, returnUrl || back)
  return dest.toString()
}
