/**
 * @typedef {Object} FormDataData
 * @property {File} file
 * @property {{ page: 'front'|'back', multipage: boolean }} fileMetadata
 * @property {number} stepIndex
 */

/**
 * @typedef {Object} FormData
 * @property {{ ['io.cozy.files'|string]: import('cozy-client/types/types').FileMetadata|object }} metadata
 * @property {FormDataData[]} data
 * @property {import('cozy-client/types/types').IOCozyContact[]} contacts
 */

/**
 * @typedef {Object} ExportedFormDataData
 * @property {ArrayBuffer} file
 * @property {{ page: 'front'|'back', multipage: boolean }} fileMetadata
 * @property {number} stepIndex
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef {Object} ExportedFormData
 * @property {import('cozy-client/types/types').FileMetadata} metadata
 * @property {ExportedFormDataData[]} data
 * @property {import('cozy-client/types/types').IOCozyContact[]} contacts
 */

/**
 * @typedef {import('react').Dispatch<import('react').SetStateAction<FormData>>} FormDataSetter
 */

/**
 * @typedef {{formData: FormData, setFormData: FormDataSetter}} FormDataContext
 */

/**
 * @typedef {Object} SearchResult
 * @property {boolean} loading
 * @property {boolean} hasResult
 * @property {import('cozy-client/types/types').IOCozyFile[]} filteredDocs
 * @property {boolean} showResultByGroup
 */

/**
 * @typedef {Object} PaperDefinitionStepAttributeOptionsTextFieldAttrs
 * @property {'text'|'number'} type - Type of the inuput.
 * @property {string} label - Label of the inuput.
 * @property {boolean} required - If the input is required.
 * @property {{ endAdornment: string, startAdornment: string }} adornment - Adornment of the input.
 */

/**
 * @typedef {Object} PaperDefinitionStepAttributeOptions
 * @property {string|number} value - Value of the option.
 * @property {string} label - Label of the option.
 * @property {boolean} [checked] - If the option is checked by default.
 * @property {PaperDefinitionStepAttributeOptionsTextFieldAttrs} [textFieldAttrs] - If the option displays a text field.
 */

/**
 * @typedef {'radio'|'date'|'text'|'number'|'contact'} PaperDefinitionStepAttributeType
 */

/**
 * @typedef {Object} PaperDefinitionStepAttribute
 * @property {string} name - Name of the input/metadata.
 * @property {PaperDefinitionStepAttributeType} type - Type of the input.
 * @property {string} inputLabel - Label of the inuput.
 * @property {boolean} [required] - If the input is required.
 * @property {number} [minLength] - Minimum length of the input.
 * @property {number} [maxLength] - Maximum length of the input.
 * @property {string} [mask] - Mask of the input. (eg: *: all characters, 9: number, a: letter)
 * @property {string} [maskPlaceholder] - Placeholder of the mask.
 * @property {PaperDefinitionStepAttributeOptions[][]} [options] - Array of array of options.
 * @property {{ endAdornment: string, startAdornment: string }} [adornment] - Adornment of the input.
 */

/**
 * @typedef {'scan'|'information'|'contact'} PaperDefinitionAcquisitionStepModel
 */

/**
 * @typedef {Object} PaperDefinitionAcquisitionStep
 * @property {PaperDefinitionAcquisitionStepModel} model - Model of the step.
 * @property {string} illustration - Name of the illustration.
 * @property {string} text - Content text of the step.
 * @property {PaperDefinitionStepAttribute[]} attributes - Array of step attributes.
 * @property {string} [tooltip] - Tooltip of the step.
 * @property {boolean} [multipage] - On Scan model, if the step is multipage.
 * @property {boolean} [multiple] - On Contact model, if the choice of contacts is multiple.
 * @property {'all'|'ocr'} [isDisplayed] - If the step is displayed only via ocr or always.
 */

/**
 * @typedef {object} PaperDefinitionKonnectorCriteria
 * @property {string} [name] - Name of the konnector
 * @property {string} [category] - Category of the konnector
 * @property {string} [qualificationLabel] - Qualification label of the konnector
 */

/**
 * @typedef {Object} PaperDefinition
 * @property {string} label - Label of Paper.
 * @property {string} icon - Icon of Paper.
 * @property {number} maxDisplay - Number of document beyond which a "see more" button is displayed.
 * @property {PaperDefinitionAcquisitionStep[]} acquisitionSteps - Array of acquisition steps.
 * @property {number} [placeholderIndex] - Position on the Placeholder list.
 * @property {object[]} [ocrAttributes] - Array of ocr attributes.
 * @property {string} [featureDate] - Reference the attribute "name" to be used as main date.
 * @property {PaperDefinitionKonnectorCriteria} [konnectorCriteria] - Criteria for linking paper to a konnector.
 */

export default {}
