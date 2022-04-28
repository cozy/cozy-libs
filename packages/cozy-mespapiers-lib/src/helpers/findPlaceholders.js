import get from 'lodash/get'

/**
 * @typedef {Object} StepAttributes
 * @property {string} name - Name of the attribute.
 * @property {string} type - Type of the attribute.
 */
/**
 * @typedef {Object} AcquisitionSteps
 * @property {number} stepIndex - Position of the step.
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

export const getPaperDefinitionByLabel = (files, paperDefinition) => {
  return (
    files &&
    !files.some(
      paper =>
        get(paper, 'metadata.qualification.label') === paperDefinition.label
    )
  )
}

/**
 * Filters and sorts the list of featured Placeholders.
 * @param {PaperDefinition[]} papersDefinitions Array of PapersDefinition
 * @param {IOCozyFile[]} files Array of IOCozyFile
 * @returns {PaperDefinition[]} Array of PapersDefinition filtered with the prop "placeholderIndex"
 */
export const getFeaturedPlaceholders = ({ papersDefinitions, files = [] }) => {
  return papersDefinitions
    .filter(
      paperDefinition =>
        getPaperDefinitionByLabel(files, paperDefinition) &&
        paperDefinition.placeholderIndex &&
        (paperDefinition.acquisitionSteps.length > 0 ||
          paperDefinition.connectorCriteria)
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
