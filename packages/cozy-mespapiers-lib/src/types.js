/**
 * @typedef {Object} SearchResult
 * @property {boolean} loading
 * @property {boolean} hasResult
 * @property {import('cozy-client/types/types').IOCozyFile[]} filteredDocs
 * @property {Object} firstSearchResultMatchingAttributes
 * @property {boolean} showResultByGroup
 */

/**
 * @typedef {Object} PapersDefinitionsStepAttributes
 * @property {string} name - Name of the attribute.
 * @property {string} type - Type of the attribute.
 */

/**
 * @typedef {Object} PapersDefinitionsAcquisitionSteps
 * @property {number} occurrence - Number of occurrence for this step.
 * @property {string} illustration - Name of the illustration.
 * @property {string} text - Text of the step.
 * @property {PapersDefinitionsStepAttributes[]} attributes - Array of the attributes.
 */

/**
 * @typedef {object} PapersDefinitionsKonnectorCriteria
 * @property {string} [name] - Name of the konnector
 * @property {string} [category] - Category of the konnector
 * @property {string} [qualificationLabel] - Qualification label of the konnector
 */

/**
 * @typedef {Object} PaperDefinition
 * @property {string} label - Label of Paper.
 * @property {string} icon - Icon of Paper.
 * @property {number} placeholderIndex - Position on the Placeholder list.
 * @property {PapersDefinitionsAcquisitionSteps[]} acquisitionSteps - Array of acquisition steps.
 * @property {string} featureDate - Reference the attribute "name" to be used as main date.
 * @property {number} maxDisplay - Number of document beyond which a "see more" button is displayed.
 */

export default {}
