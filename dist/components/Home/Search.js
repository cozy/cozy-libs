"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _cozyClient = require("cozy-client");

var _Badge = _interopRequireDefault(require("cozy-ui/transpiled/react/Badge"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _Box = _interopRequireDefault(require("cozy-ui/transpiled/react/Box"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var _SearchInput = _interopRequireDefault(require("../SearchInput"));

var _ThemesFilter = _interopRequireDefault(require("../ThemesFilter"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var themesList = _cozyClient.models.document.themes.themesList;
var useStyles = (0, _makeStyles.default)(function (theme) {
  return {
    iconButton: {
      color: theme.palette.text.icon,
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.background.paper,
      marginLeft: '1rem'
    }
  };
});

var SearchBox = function SearchBox(_ref) {
  var onInputchange = _ref.onInputchange,
      onThemeChange = _ref.onThemeChange,
      onFocus = _ref.onFocus;
  var styles = useStyles();

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      isMultiSelectionActive = _useMultiSelection.isMultiSelectionActive;

  var _useState = (0, _react.useState)(''),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      searchValue = _useState2[0],
      setSearchValue = _useState2[1];

  var _useState3 = (0, _react.useState)(isMultiSelectionActive),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isSearchValueFocus = _useState4[0],
      setIsSearchValueFocus = _useState4[1];

  var _useState5 = (0, _react.useState)(''),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      selectedTheme = _useState6[0],
      setSelectedTheme = _useState6[1];

  var handleThemeSelection = function handleThemeSelection(nextValue) {
    setSelectedTheme(function (oldValue) {
      return nextValue === oldValue ? '' : nextValue;
    });
  };

  _react.default.useEffect(function () {
    onInputchange(searchValue);
  }, [onInputchange, searchValue]);

  _react.default.useEffect(function () {
    onThemeChange(selectedTheme);
  }, [onThemeChange, selectedTheme]);

  _react.default.useEffect(function () {
    onFocus(isSearchValueFocus);
  }, [onFocus, isSearchValueFocus]);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "u-flex u-flex-column-s u-mv-1 u-ph-1"
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: "u-flex u-flex-items-center u-mb-half-s",
    flex: "1 1 auto"
  }, /*#__PURE__*/_react.default.createElement(_SearchInput.default, {
    setSearchValue: setSearchValue,
    setIsSearchValueFocus: setIsSearchValueFocus
  }), isSearchValueFocus && /*#__PURE__*/_react.default.createElement(_Badge.default, {
    badgeContent: selectedTheme ? 1 : 0,
    showZero: false,
    color: "primary",
    variant: "standard",
    size: "medium"
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    "data-testid": "SwitchButton",
    className: styles.iconButton,
    size: "medium",
    onClick: function onClick() {
      return setIsSearchValueFocus(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "setting"
  })))), /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: "u-flex u-flex-justify-center",
    flexWrap: "wrap"
  }, !isSearchValueFocus && /*#__PURE__*/_react.default.createElement(_ThemesFilter.default, {
    items: themesList,
    selectedTheme: selectedTheme,
    handleThemeSelection: handleThemeSelection
  })));
};

var _default = SearchBox;
exports.default = _default;