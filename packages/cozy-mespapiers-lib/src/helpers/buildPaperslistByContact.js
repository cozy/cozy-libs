import { filterWithRemaining } from './filterWithRemaining'
import {
  harmonizeContactsNames,
  groupFilesByContacts
} from '../components/Papers/helpers'

const hasContactsInFile = file => file.contacts.length > 0

/**
 * @property {object[]} files - Array of IOCozyFile
 * @property {object[]} contacts - Array of IOCozyContact
 * @property {number} maxDisplay - Number of displayed files
 * @property {Function} t - i18n function
 * @returns {{ withHeader: boolean, contact: string, papers: { maxDisplay: number, list: IOCozyFile[] } }[]}
 */
export const buildPaperslistByContact = ({
  files,
  contacts,
  maxDisplay,
  t
}) => {
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
