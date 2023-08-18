import { hasItemByLabel } from '../components/Home/helpers'

/**
 * @typedef {Object} StepAttributes
 * @property {string} name - Name of the attribute.
 * @property {string} type - Type of the attribute.
 */
/**
 * @typedef {Object} AcquisitionSteps
 * @property {number} occurrence - Number of occurrence for this step.
 * @property {string} illustration - Name of the illustration.
 * @property {string} text - Text of the step.
 * @property {StepAttributes[]} attributes - Array of the attributes.
 */
/**
 * @typedef {Object} PaperDefinition
 * @property {string} label - Label of Paper.
 * @property {string} icon - Icon of Paper.
 * @property {number} placeholderIndex - Position on the Placeholder list.
 * @property {AcquisitionSteps[]} acquisitionSteps - Array of acquisition steps.
 * @property {string} featureDate - Reference the attribute "name" to be used as main date.
 * @property {number} maxDisplay - Number of document beyond which a "see more" button is displayed.
 */

/**
 * Checks if a file in a list has a qualification label equal to the label in the paper definition
 * @param {IOCozyFile[]} files - Array of IOCozyFile
 * @param {PaperDefinition} paperDefinition - PapersDefinition
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
 * @param {PaperDefinition} paperDefinition - PapersDefinition
 * @returns {boolean}
 */
export const isPaperEnabled = paperDefinition =>
  paperDefinition.acquisitionSteps.length > 0 ||
  paperDefinition.konnectorCriteria

/**
 * Filters and sorts the list of featured Placeholders.
 * @param {PaperDefinition[]} papersDefinitions Array of PapersDefinition
 * @param {IOCozyFile[]} files Array of IOCozyFile
 * @param {object} selectedTheme Theme selected
 * @returns {PaperDefinition[]} Array of PapersDefinition filtered with the prop "placeholderIndex"
 */
export const getFeaturedPlaceholders = ({
  papersDefinitions,
  files = [],
  selectedTheme = ''
}) => {
  return papersDefinitions
    .filter(
      paperDefinition =>
        hasNoFileWithSameQualificationLabel(files, paperDefinition) &&
        isPaperEnabled(paperDefinition) &&
        (selectedTheme
          ? hasItemByLabel(selectedTheme, paperDefinition.label)
          : paperDefinition.placeholderIndex)
    )
    .sort((a, b) => a.placeholderIndex - b.placeholderIndex)
}

/**
 * Find placeholders by Qualification
 * @param {Object[]} qualificationItems - Object of qualification
 * @returns {PaperDefinition[]} - Array of PapersDefinition
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
        paperDefinition.country === 'stranger'
    : true

  return label === paperDefinition.label && countryCondition
}

/**
 * Find placeholders by Qualification
 * @param {Object[]} papersDefinitions - Object of qualification
 * @param {string} label - Label of qualification
 * @param {string} country - country of document
 * @returns {PaperDefinition[]} - Array of PapersDefinition
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
