"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPapersDefinitions = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/**
 * Sort paperDefinitions list alphabetical order then:
 * - Papers with acquisitionSteps or with connectorCriteria (papersUsedList)
 * - Papers without acquisitionSteps and without connectorCriteria (papersUnUsedList)
 * - Papers of type "other_identity_document" etc (otherPaperList)
 *
 * @param {Object[]} papersDefList - Array of Papers
 * @param {Function} scannerT - I18n function
 * @returns {Object[]} - Array of Papers sorted
 */
var buildPapersDefinitions = function buildPapersDefinitions(papersDefList, scannerT) {
  var papersDefListSorted = (0, _toConsumableArray2.default)(papersDefList).sort(function (w, x) {
    return scannerT("items.".concat(w.label)) > scannerT("items.".concat(x.label)) ? 1 : scannerT("items.".concat(x.label)) > scannerT("items.".concat(w.label)) ? -1 : 0;
  });

  var _papersDefListSorted$ = papersDefListSorted.reduce(function (_ref, currentPaperDef) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 3),
        used = _ref2[0],
        unUsed = _ref2[1],
        other = _ref2[2];

    if (/other_/i.test(currentPaperDef.label)) {
      return [used, unUsed, [].concat((0, _toConsumableArray2.default)(other), [currentPaperDef])];
    }

    return currentPaperDef.acquisitionSteps.length > 0 || currentPaperDef.connectorCriteria ? [[].concat((0, _toConsumableArray2.default)(used), [currentPaperDef]), unUsed, other] : [used, [].concat((0, _toConsumableArray2.default)(unUsed), [currentPaperDef]), other];
  }, [[], [], []]),
      _papersDefListSorted$2 = (0, _slicedToArray2.default)(_papersDefListSorted$, 3),
      papersUsedList = _papersDefListSorted$2[0],
      papersUnUsedList = _papersDefListSorted$2[1],
      otherPaperList = _papersDefListSorted$2[2];

  return [].concat((0, _toConsumableArray2.default)(papersUsedList), (0, _toConsumableArray2.default)(otherPaperList), (0, _toConsumableArray2.default)(papersUnUsedList));
};

exports.buildPapersDefinitions = buildPapersDefinitions;