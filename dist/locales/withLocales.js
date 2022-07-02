"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18nContextTypes = exports.default = void 0;

var _withLocales = _interopRequireDefault(require("cozy-ui/transpiled/react/I18n/withLocales"));

var _I18n = _interopRequireDefault(require("cozy-ui/transpiled/react/I18n"));

var dictRequire = function dictRequire(lang) {
  return require("./".concat(lang, ".json"));
};

var i18nContextTypes = _I18n.default.childContextTypes;
exports.i18nContextTypes = i18nContextTypes;

var _default = (0, _withLocales.default)(dictRequire);

exports.default = _default;