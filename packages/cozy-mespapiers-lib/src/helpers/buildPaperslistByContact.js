import { models, isReferencedById, isReferencedBy } from 'cozy-client'

import { CONTACTS_DOCTYPE } from '../doctypes'

const { getDisplayName } = models.contact

const getPaperWithoutContact = papersList => {
  return papersList.filter(paper => !isReferencedBy(paper, CONTACTS_DOCTYPE))
}

const DEFAULT_MAX_DISPLAY = 3

/**
 * @typedef {object} BuildPaperslistByContactParam
 * @property {object[]} papersList - Array of IOCozyFile
 * @property {object[]} contactsList - Array of cozy contact object
 * @property {object[]} defaultName - Name of header of papers without contact
 * @property {Paper[]} [papersDefinitions=[]] Array of Papers
 * @property {string} [currentFileTheme=''] - Category of qualification
 */

/**
 * @param {BuildPaperslistByContactParam} param
 * @returns {{ withHeader: boolean, contact: string, papers: {maxDisplay: number, list: IOCozyFile[]} }[]}
 */
export const buildPaperslistByContact = ({
  papersList,
  contactsList,
  defaultName,
  papersDefinitions = [],
  currentFileTheme = ''
}) => {
  let result = []
  const paperWithoutContact = getPaperWithoutContact(papersList)
  const currentDef = papersDefinitions.find(
    paperDef => paperDef.label === currentFileTheme
  )
  const maxDisplay = currentDef?.maxDisplay || DEFAULT_MAX_DISPLAY
  const withHeader = !(
    paperWithoutContact.length === papersList.length && papersList.length > 0
  )

  result = contactsList.map(contact => ({
    withHeader,
    contact: getDisplayName(contact),
    papers: {
      maxDisplay,
      list: papersList.filter(paper =>
        isReferencedById(paper, CONTACTS_DOCTYPE, contact._id)
      )
    }
  }))

  const resultSorted = result.sort((a, b) => a.contact.localeCompare(b.contact))

  if (paperWithoutContact.length > 0) {
    resultSorted.push({
      withHeader,
      contact: defaultName,
      papers: {
        maxDisplay,
        list: paperWithoutContact
      }
    })
  }

  return resultSorted
}
