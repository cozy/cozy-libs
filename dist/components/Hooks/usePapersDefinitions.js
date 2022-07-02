"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePapersDefinitions = void 0;

var _react = require("react");

var _PapersDefinitionsProvider = _interopRequireDefault(require("../Contexts/PapersDefinitionsProvider"));

var usePapersDefinitions = function usePapersDefinitions() {
  var papersDefinitionsContext = (0, _react.useContext)(_PapersDefinitionsProvider.default);

  if (!papersDefinitionsContext) {
    throw new Error('usePapersDefinitions must be used within a PapersDefinitionsProvider');
  }

  return papersDefinitionsContext;
};

exports.usePapersDefinitions = usePapersDefinitions;