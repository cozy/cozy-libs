"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaperDefinitionsStepPropTypes = exports.PaperDefinitionsPropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var PaperDefinitionsStepAttrPropTypes = _propTypes.default.shape({
  name: _propTypes.default.string.isRequired,
  type: _propTypes.default.string.isRequired
});

var PaperDefinitionsStepPropTypes = _propTypes.default.shape({
  stepIndex: _propTypes.default.number.isRequired,
  model: _propTypes.default.string.isRequired,
  multipage: _propTypes.default.bool,
  page: _propTypes.default.string,
  illustration: _propTypes.default.string.isRequired,
  text: _propTypes.default.string.isRequired,
  attributes: _propTypes.default.arrayOf(PaperDefinitionsStepAttrPropTypes)
});

exports.PaperDefinitionsStepPropTypes = PaperDefinitionsStepPropTypes;

var PaperDefinitionsPropTypes = _propTypes.default.shape({
  label: _propTypes.default.string.isRequired,
  icon: _propTypes.default.string,
  placeholderIndex: _propTypes.default.number,
  acquisitionSteps: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.arrayOf(PaperDefinitionsStepPropTypes).isRequired]),
  featureDate: _propTypes.default.string,
  maxDisplay: _propTypes.default.number.isRequired
});

exports.PaperDefinitionsPropTypes = PaperDefinitionsPropTypes;