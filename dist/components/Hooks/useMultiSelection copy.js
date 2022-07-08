"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMultiSelection = void 0;

var _react = require("react");

var _MultiSelectionProvider = _interopRequireDefault(require("../Contexts/MultiSelectionProvider"));

var useMultiSelection = function useMultiSelection() {
  var multiSelection = (0, _react.useContext)(_MultiSelectionProvider.default);

  if (!multiSelection) {
    throw new Error('MultiSelectionContext must be used within a MultiSelectionProvider');
  }

  return multiSelection;
};

exports.useMultiSelection = useMultiSelection;