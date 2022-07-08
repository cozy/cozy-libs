"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _cozyClient = require("cozy-client");

var _cozyFlags = _interopRequireDefault(require("cozy-flags"));

var _FlagSwitcher = _interopRequireDefault(require("cozy-flags/dist/FlagSwitcher"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Spinner = _interopRequireDefault(require("cozy-ui/transpiled/react/Spinner"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Alerter = _interopRequireDefault(require("cozy-ui/transpiled/react/Alerter"));

var _ScannerI18nProvider = require("./Contexts/ScannerI18nProvider");

var _ModalProvider = require("./Contexts/ModalProvider");

var _PapersDefinitionsProvider = require("./Contexts/PapersDefinitionsProvider");

var _MultiSelectionProvider = require("./Contexts/MultiSelectionProvider");

var _AppRouter = require("./AppRouter");

var _usePapersDefinitions2 = require("./Hooks/usePapersDefinitions");

var _MoreOptions = _interopRequireDefault(require("./MoreOptions/MoreOptions"));

var App = function App() {
  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _usePapersDefinitions = (0, _usePapersDefinitions2.usePapersDefinitions)(),
      customPapersDefinitions = _usePapersDefinitions.customPapersDefinitions,
      papersDefinitions = _usePapersDefinitions.papersDefinitions;

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, (0, _cozyFlags.default)('switcher') && /*#__PURE__*/_react.default.createElement(_FlagSwitcher.default, null), customPapersDefinitions.isLoaded && /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    align: "center",
    color: "secondary"
  }, t("PapersDefinitionsProvider.customPapersDefinitions.warning", {
    name: customPapersDefinitions.name
  })), papersDefinitions.length === 0 ? /*#__PURE__*/_react.default.createElement(_Spinner.default, {
    size: "xxlarge",
    className: "u-flex u-flex-justify-center u-mt-2 u-h-5"
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_MoreOptions.default, null), /*#__PURE__*/_react.default.createElement(_AppRouter.AppRouter, null)), /*#__PURE__*/_react.default.createElement(_cozyClient.RealTimeQueries, {
    doctype: "io.cozy.files"
  }), /*#__PURE__*/_react.default.createElement(_cozyClient.RealTimeQueries, {
    doctype: "io.cozy.mespapiers.settings"
  }), /*#__PURE__*/_react.default.createElement(_Alerter.default, {
    t: t
  }), /*#__PURE__*/_react.default.createElement(_ModalProvider.ModalStack, null));
};

var MesPapiersLib = function MesPapiersLib(_ref) {
  var lang = _ref.lang;
  var polyglot = (0, _I18n.initTranslation)(lang, function (lang) {
    return require("../locales/".concat(lang));
  });
  return /*#__PURE__*/_react.default.createElement(_I18n.I18n, {
    lang: lang,
    polyglot: polyglot
  }, /*#__PURE__*/_react.default.createElement(_MultiSelectionProvider.MultiSelectionProvider, null, /*#__PURE__*/_react.default.createElement(_ScannerI18nProvider.ScannerI18nProvider, null, /*#__PURE__*/_react.default.createElement(_PapersDefinitionsProvider.PapersDefinitionsProvider, null, /*#__PURE__*/_react.default.createElement(_ModalProvider.ModalProvider, null, /*#__PURE__*/_react.default.createElement(App, null))))));
};

var _default = MesPapiersLib;
exports.default = _default;