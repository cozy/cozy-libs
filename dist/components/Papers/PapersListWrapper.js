"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Spinner = require("cozy-ui/transpiled/react/Spinner");

var _queries = require("../../helpers/queries");

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _helpers = require("./helpers");

var _usePapersDefinitions2 = require("../Hooks/usePapersDefinitions");

var _PapersListByContact = _interopRequireDefault(require("../Papers/PapersListByContact"));

var _const = require("../../constants/const");

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var _PapersListToolbar = _interopRequireDefault(require("./PapersListToolbar"));

var _excluded = ["data"],
    _excluded2 = ["data"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var PapersListWrapper = function PapersListWrapper(_ref) {
  var _match$params$fileThe, _match$params;

  var history = _ref.history,
      match = _ref.match,
      _ref$selectedThemeLab = _ref.selectedThemeLabel,
      selectedThemeLabel = _ref$selectedThemeLab === void 0 ? null : _ref$selectedThemeLab;
  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _usePapersDefinitions = (0, _usePapersDefinitions2.usePapersDefinitions)(),
      papersDefinitions = _usePapersDefinitions.papersDefinitions;

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      setIsMultiSelectionActive = _useMultiSelection.setIsMultiSelectionActive,
      isMultiSelectionActive = _useMultiSelection.isMultiSelectionActive;

  var currentFileTheme = (_match$params$fileThe = match === null || match === void 0 ? void 0 : (_match$params = match.params) === null || _match$params === void 0 ? void 0 : _match$params.fileTheme) !== null && _match$params$fileThe !== void 0 ? _match$params$fileThe : selectedThemeLabel;
  var themeLabel = scannerT("items.".concat(currentFileTheme));
  var filesQueryByLabel = (0, _queries.buildFilesQueryByLabel)(currentFileTheme);

  var _useQueryAll = (0, _cozyClient.useQueryAll)(filesQueryByLabel.definition, filesQueryByLabel.options),
      files = _useQueryAll.data,
      fileQueryResult = (0, _objectWithoutProperties2.default)(_useQueryAll, _excluded);

  var isLoadingFiles = (0, _cozyClient.isQueryLoading)(fileQueryResult) || fileQueryResult.hasMore;
  var contactIds = !isLoadingFiles ? (0, _helpers.getContactsRefIdsByFiles)(files) : [];
  var contactsQueryByIds = (0, _queries.buildContactsQueryByIds)(contactIds);

  var _useQueryAll2 = (0, _cozyClient.useQueryAll)(contactsQueryByIds.definition, _objectSpread(_objectSpread({}, contactsQueryByIds.options), {}, {
    enabled: !isLoadingFiles
  })),
      contacts = _useQueryAll2.data,
      contactQueryResult = (0, _objectWithoutProperties2.default)(_useQueryAll2, _excluded2);

  var isLoadingContacts = (0, _cozyClient.isQueryLoading)(contactQueryResult) || contactQueryResult.hasMore;
  var currentDefinition = (0, _react.useMemo)(function () {
    return papersDefinitions.find(function (paperDef) {
      return paperDef.label === currentFileTheme;
    });
  }, [papersDefinitions, currentFileTheme]);
  var paperslistByContact = (0, _react.useMemo)(function () {
    if (!isLoadingFiles && !isLoadingContacts) {
      return (0, _helpers.buildFilesByContacts)({
        files: files,
        contacts: contacts,
        maxDisplay: (currentDefinition === null || currentDefinition === void 0 ? void 0 : currentDefinition.maxDisplay) || _const.DEFAULT_MAX_FILES_DISPLAYED,
        t: t
      });
    }

    return [];
  }, [isLoadingFiles, isLoadingContacts, files, contacts, currentDefinition, t]);
  var hasNoFiles = !isLoadingFiles && files.length === 0;

  if (hasNoFiles) {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
      to: "/paper"
    });
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !isMultiSelectionActive && /*#__PURE__*/_react.default.createElement(_PapersListToolbar.default, {
    title: themeLabel,
    onBack: function onBack() {
      return history.push('/paper');
    },
    onClose: function onClose() {
      return setIsMultiSelectionActive(false);
    }
  }), paperslistByContact.length > 0 ? /*#__PURE__*/_react.default.createElement(_PapersListByContact.default, {
    paperslistByContact: paperslistByContact
  }) : /*#__PURE__*/_react.default.createElement(_Spinner.Spinner, {
    size: "xxlarge",
    className: "u-flex u-flex-justify-center u-mt-2 u-h-5"
  }));
};

PapersListWrapper.propTypes = {
  history: _propTypes.default.object,
  match: _propTypes.default.shape({
    params: _propTypes.default.shape({
      fileTheme: _propTypes.default.string.isRequired
    })
  }),
  selectedThemeLabel: _propTypes.default.string
};
var _default = PapersListWrapper;
exports.default = _default;