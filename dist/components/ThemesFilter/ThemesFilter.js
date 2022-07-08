"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _CircleButton = _interopRequireDefault(require("cozy-ui/transpiled/react/CircleButton"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _en = _interopRequireDefault(require("../../locales/en.json"));

var makeLabel = function makeLabel(_ref) {
  var _enLocale$Scan, _enLocale$Scan$themes;

  var scannerT = _ref.scannerT,
      t = _ref.t,
      label = _ref.label;
  var hasLocale = _en.default === null || _en.default === void 0 ? void 0 : (_enLocale$Scan = _en.default.Scan) === null || _enLocale$Scan === void 0 ? void 0 : (_enLocale$Scan$themes = _enLocale$Scan.themes) === null || _enLocale$Scan$themes === void 0 ? void 0 : _enLocale$Scan$themes[label];
  return hasLocale ? t("Scan.themes.".concat(label)) : scannerT("themes.".concat(label));
};

var ThemesFilter = function ThemesFilter(_ref2) {
  var items = _ref2.items,
      selectedTheme = _ref2.selectedTheme,
      handleThemeSelection = _ref2.handleThemeSelection;
  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, items.map(function (item) {
    return /*#__PURE__*/_react.default.createElement(_CircleButton.default, {
      key: item.id,
      label: makeLabel({
        scannerT: scannerT,
        t: t,
        label: "".concat(item.label)
      }),
      variant: selectedTheme.id === item.id ? 'active' : 'default',
      onClick: function onClick() {
        return handleThemeSelection(item);
      },
      "data-testid": "ThemesFilter"
    }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: item.icon
    }));
  }));
};

var _default = ThemesFilter;
exports.default = _default;