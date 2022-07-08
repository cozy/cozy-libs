"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SearchProvider = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var SearchContext = /*#__PURE__*/(0, _react.createContext)();

var SearchProvider = function SearchProvider(_ref) {
  var children = _ref.children;

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

  var _useState5 = (0, _react.useState)(null),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      selectedTheme = _useState6[0],
      setSelectedTheme = _useState6[1];

  var handleThemeSelection = function handleThemeSelection(nextValue) {
    setSelectedTheme(function (oldValue) {
      return nextValue === oldValue ? '' : nextValue;
    });
  };

  var value = {
    searchValue: searchValue,
    setSearchValue: setSearchValue,
    isSearchValueFocus: isSearchValueFocus,
    setIsSearchValueFocus: setIsSearchValueFocus,
    selectedTheme: selectedTheme,
    handleThemeSelection: handleThemeSelection
  };
  return /*#__PURE__*/_react.default.createElement(SearchContext.Provider, {
    value: value
  }, children);
};

exports.SearchProvider = SearchProvider;
var _default = SearchContext;
exports.default = _default;