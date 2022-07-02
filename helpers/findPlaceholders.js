"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPaperEnabled = exports.hasNoFileWithSameQualificationLabel = exports.getFeaturedPlaceholders = exports.findPlaceholdersByQualification = void 0;

var _get = _interopRequireDefault(require("lodash/get"));

var _helpers = require("../components/Home/helpers");

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

/**
 * Checks if a file in a list has a qualification label equal to the label in the paper definition
 * @param {IOCozyFile[]} files - Array of IOCozyFile
 * @param {PaperDefinition} paperDefinition - PapersDefinition
 * @returns {boolean}
 */
var hasNoFileWithSameQualificationLabel = function hasNoFileWithSameQualificationLabel(files, paperDefinition) {
  return files && !files.some(function (paper) {
    return (0, _get.default)(paper, 'metadata.qualification.label') === paperDefinition.label;
  });
};
/**
 * Whether a paper is supported and creatable
 * @param {PaperDefinition} paperDefinition - PapersDefinition
 * @returns {boolean}
 */


exports.hasNoFileWithSameQualificationLabel = hasNoFileWithSameQualificationLabel;

var isPaperEnabled = function isPaperEnabled(paperDefinition) {
  return paperDefinition.acquisitionSteps.length > 0 || paperDefinition.connectorCriteria;
};
/**
 * Filters and sorts the list of featured Placeholders.
 * @param {PaperDefinition[]} papersDefinitions Array of PapersDefinition
 * @param {IOCozyFile[]} files Array of IOCozyFile
 * @param {object} selectedTheme Theme selected
 * @returns {PaperDefinition[]} Array of PapersDefinition filtered with the prop "placeholderIndex"
 */


exports.isPaperEnabled = isPaperEnabled;

var getFeaturedPlaceholders = function getFeaturedPlaceholders(_ref) {
  var papersDefinitions = _ref.papersDefinitions,
      _ref$files = _ref.files,
      files = _ref$files === void 0 ? [] : _ref$files,
      _ref$selectedTheme = _ref.selectedTheme,
      selectedTheme = _ref$selectedTheme === void 0 ? '' : _ref$selectedTheme;
  return papersDefinitions.filter(function (paperDefinition) {
    return hasNoFileWithSameQualificationLabel(files, paperDefinition) && isPaperEnabled(paperDefinition) && (selectedTheme ? (0, _helpers.hasItemByLabel)(selectedTheme, paperDefinition.label) : paperDefinition.placeholderIndex);
  }).sort(function (a, b) {
    return a.placeholderIndex - b.placeholderIndex;
  });
};
/**
 * Find placeholders by Qualification
 * @param {Object[]} qualificationItems - Object of qualification
 * @returns {PaperDefinition[]} - Array of PapersDefinition
 */


exports.getFeaturedPlaceholders = getFeaturedPlaceholders;

var findPlaceholdersByQualification = function findPlaceholdersByQualification(papersDefinitions) {
  var qualificationItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return papersDefinitions.filter(function (paperDefinition) {
    return qualificationItems.some(function (item) {
      return item.label === paperDefinition.label;
    });
  });
};

exports.findPlaceholdersByQualification = findPlaceholdersByQualification;