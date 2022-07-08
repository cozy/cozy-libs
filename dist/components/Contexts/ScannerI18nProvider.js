"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ScannerI18nProvider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getBoundT = _cozyClient.models.document.locales.getBoundT;
var ScannerI18nContext = /*#__PURE__*/(0, _react.createContext)();
var prefix = "Scan";

var ScannerI18nProvider = function ScannerI18nProvider(_ref) {
  var children = _ref.children;

  var _useI18n = (0, _I18n.useI18n)(),
      lang = _useI18n.lang;

  var scannerI18n = getBoundT(lang || 'fr');

  var scannerT = _react.default.useCallback(function (key) {
    return scannerI18n("".concat(prefix, ".").concat(key));
  }, [scannerI18n]);

  return /*#__PURE__*/_react.default.createElement(ScannerI18nContext.Provider, {
    value: scannerT
  }, children);
};

exports.ScannerI18nProvider = ScannerI18nProvider;
var _default = ScannerI18nContext;
exports.default = _default;