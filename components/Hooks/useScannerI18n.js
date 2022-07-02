"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScannerI18n = void 0;

var _react = require("react");

var _ScannerI18nProvider = _interopRequireDefault(require("../Contexts/ScannerI18nProvider"));

var useScannerI18n = function useScannerI18n() {
  var scannerT = (0, _react.useContext)(_ScannerI18nProvider.default);

  if (!scannerT) {
    throw new Error('ScannerI18nContext must be used within a ScannerI18nProvider');
  }

  return scannerT;
};

exports.useScannerI18n = useScannerI18n;