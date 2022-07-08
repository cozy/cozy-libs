"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormData = void 0;

var _react = require("react");

var _FormDataProvider = _interopRequireDefault(require("../Contexts/FormDataProvider"));

var useFormData = function useFormData() {
  var formDataContext = (0, _react.useContext)(_FormDataProvider.default);

  if (!formDataContext) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }

  return formDataContext;
};

exports.useFormData = useFormData;