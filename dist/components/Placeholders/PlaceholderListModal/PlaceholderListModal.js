"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _useScannerI18n = require("../../Hooks/useScannerI18n");

var _PlaceholdersList = _interopRequireDefault(require("./PlaceholdersList"));

var _PlaceholderThemesList = _interopRequireDefault(require("./PlaceholderThemesList"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var defaultState = {
  onBack: false,
  currentQualifItems: [],
  qualificationLabel: ''
};

var PlaceholderListModal = function PlaceholderListModal() {
  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var history = (0, _reactRouterDom.useHistory)();
  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useState = (0, _react.useState)(defaultState),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var resetCurrentQualif = function resetCurrentQualif() {
    setState(_objectSpread(_objectSpread({}, defaultState), {}, {
      onBack: true
    }));
  };

  var setQualifByTheme = function setQualifByTheme(theme) {
    setState(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        currentQualifItems: theme.items,
        qualificationLabel: theme.label
      });
    });
  };

  return state.currentQualifItems.length === 0 ? /*#__PURE__*/_react.default.createElement(_CozyDialogs.FixedDialog, {
    open: true,
    disableGutters: true,
    onClose: history.goBack,
    transitionDuration: state.onBack ? 0 : undefined,
    title: t('PlaceholdersList.title', {
      name: ''
    }),
    content: /*#__PURE__*/_react.default.createElement(_PlaceholderThemesList.default, {
      setQualifByTheme: setQualifByTheme
    })
  }) : /*#__PURE__*/_react.default.createElement(_CozyDialogs.FixedDialog, {
    open: true,
    disableGutters: true,
    onClose: history.goBack,
    onBack: resetCurrentQualif,
    transitionDuration: 0,
    title: t('PlaceholdersList.title', {
      name: " - ".concat(scannerT("themes.".concat(state.qualificationLabel)))
    }),
    content: /*#__PURE__*/_react.default.createElement(_PlaceholdersList.default, {
      currentQualifItems: state.currentQualifItems
    })
  });
};

var _default = PlaceholderListModal;
exports.default = _default;