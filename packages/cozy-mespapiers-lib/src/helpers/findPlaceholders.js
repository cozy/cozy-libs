import { hasItemByLabel } from '../components/Home/helpers'

/**
 * Checks if a file in a list has a qualification label equal to the label in the paper definition
 * @param {IOCozyFile[]} files - Array of IOCozyFile
 * @param {import('../types').PaperDefinition} paperDefinition
 * @returns {boolean}
 */
export const hasNoFileWithSameQualificationLabel = (files, paperDefinition) => {
  return (
    files &&
    !files.some(
      paper => paper?.metadata?.qualification?.label === paperDefinition.label
    )
  )
}

/**
 * Whether a paper is supported and creatable
 * @param {import('../types').PaperDefinition} paperDefinition
 * @returns {boolean}
 */
export const isPaperEnabled = paperDefinition =>
  paperDefinition.acquisitionSteps.length > 0 ||
  paperDefinition.konnectorCriteria

/**
 * Filters and sorts the list of featured Placeholders.
 * @param {import('../types').PaperDefinition[]} papersDefinitions Array of PapersDefinition
 * @param {IOCozyFile[]} files Array of IOCozyFile
 * @param {import('cozy-client/types/types').Theme[]} selectedThemes Array of Themes selected
 * @returns {import('../types').PaperDefinition[]} Array of PapersDefinition filtered with the prop "placeholderIndex"
 */
export const getFeaturedPlaceholders = ({
  papersDefinitions,
  files = [],
  selectedThemes = []
}) => {
  return papersDefinitions
    .filter(
      paperDefinition =>
        hasNoFileWithSameQualificationLabel(files, paperDefinition) &&
        isPaperEnabled(paperDefinition) &&
        (selectedThemes.length
          ? hasItemByLabel(selectedThemes, paperDefinition.label)
          : paperDefinition.placeholderIndex)
    )
    .sort((a, b) => a.placeholderIndex - b.placeholderIndex)
}

/**
 * Find placeholders by Qualification
 * @param {Object[]} qualificationItems - Object of qualification
 * @returns {import('../types').PaperDefinition[]} - Array of PaperDefinition
 */
export const findPlaceholdersByQualification = (
  papersDefinitions,
  qualificationItems = []
) => {
  return papersDefinitions.filter(paperDefinition =>
    qualificationItems.some(item => item.label === paperDefinition.label)
  )
}

const filterPlaceholderByLabelAndCountry = ({
  paperDefinition,
  label,
  country
}) => {
  const countryCondition = paperDefinition.country
    ? country == null
      ? paperDefinition.country === 'fr'
      : paperDefinition.country === country ||
        paperDefinition.country === 'foreign'
    : true

  return label === paperDefinition.label && countryCondition
}

/**
 * Find placeholders by Qualification
 * @param {import('../types').PaperDefinition[]} papersDefinitions - Array of PapersDefinition
 * @param {string} label - Label of qualification
 * @param {string} country - country of document
 * @returns {import('../types').PaperDefinition[]} - Array of PapersDefinition
 */
export const findPlaceholderByLabelAndCountry = (
  papersDefinitions,
  label,
  country
) => {
  return papersDefinitions.filter(paperDefinition =>
    filterPlaceholderByLabelAndCountry({ paperDefinition, label, country })
  )
}
