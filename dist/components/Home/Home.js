"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uniqBy = _interopRequireDefault(require("lodash/uniqBy"));

var _cozyClient = require("cozy-client");

var _Empty = _interopRequireDefault(require("cozy-ui/transpiled/react/Empty"));

var _Spinner = _interopRequireDefault(require("cozy-ui/transpiled/react/Spinner"));

var _Box = _interopRequireDefault(require("cozy-ui/transpiled/react/Box"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _Badge = _interopRequireDefault(require("cozy-ui/transpiled/react/Badge"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _ThemesFilter = _interopRequireDefault(require("../ThemesFilter"));

var _SearchInput = _interopRequireDefault(require("../SearchInput"));

var _PaperGroup = _interopRequireDefault(require("../Papers/PaperGroup"));

var _FeaturedPlaceholdersList = _interopRequireDefault(require("../Placeholders/FeaturedPlaceholdersList"));

var _usePapersDefinitions2 = require("../Hooks/usePapersDefinitions");

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var _queries = require("../../helpers/queries");

var _findPlaceholders = require("../../helpers/findPlaceholders");

var _HomeCloud = _interopRequireDefault(require("../../assets/icons/HomeCloud.svg"));

var _helpers = require("./helpers");

var _HomeToolbar = _interopRequireDefault(require("./HomeToolbar"));

var _SearchResult = _interopRequireDefault(require("../SearchResult/SearchResult"));

var _excluded = ["data"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
var themesList = _cozyClient.models.document.themes.themesList;

var Home = function Home(_ref) {
  var setSelectedThemeLabel = _ref.setSelectedThemeLabel;

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

  var styles = useStyles();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _usePapersDefinitions = (0, _usePapersDefinitions2.usePapersDefinitions)(),
      papersDefinitions = _usePapersDefinitions.papersDefinitions;

  var labels = papersDefinitions.map(function (paper) {
    return paper.label;
  });
  var filesQueryByLabels = (0, _queries.buildFilesQueryByLabels)(labels);

  var _useQueryAll = (0, _cozyClient.useQueryAll)(filesQueryByLabels.definition, filesQueryByLabels.options),
      filesByLabels = _useQueryAll.data,
      queryResult = (0, _objectWithoutProperties2.default)(_useQueryAll, _excluded);

  var isLoading = (0, _cozyClient.isQueryLoading)(queryResult) || queryResult.hasMore;
  var isSearching = searchValue.length > 0 || selectedTheme;
  var allPapersByCategories = (0, _react.useMemo)(function () {
    return (0, _uniqBy.default)(filesByLabels, 'metadata.qualification.label');
  }, [filesByLabels]);
  var filteredPapers = (0, _helpers.filterPapersByThemeAndSearchValue)({
    files: isSearching ? filesByLabels : allPapersByCategories,
    theme: selectedTheme,
    search: searchValue,
    scannerT: scannerT
  });
  var featuredPlaceholders = (0, _react.useMemo)(function () {
    return (0, _findPlaceholders.getFeaturedPlaceholders)({
      papersDefinitions: papersDefinitions,
      files: filesByLabels,
      selectedTheme: selectedTheme
    });
  }, [papersDefinitions, filesByLabels, selectedTheme]);

  var handleThemeSelection = function handleThemeSelection(nextValue) {
    setSelectedTheme(function (oldValue) {
      return nextValue === oldValue ? '' : nextValue;
    });
  };

  if (isLoading) {
    return /*#__PURE__*/_react.default.createElement(_Spinner.default, {
      size: "xxlarge",
      className: "u-flex u-flex-justify-center u-mt-2 u-h-5"
    });
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, isMultiSelectionActive && /*#__PURE__*/_react.default.createElement(_HomeToolbar.default, null), /*#__PURE__*/_react.default.createElement("div", {
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
  }))), allPapersByCategories.length > 0 ? !isSearching ? /*#__PURE__*/_react.default.createElement(_PaperGroup.default, {
    allPapersByCategories: filteredPapers,
    setSelectedThemeLabel: setSelectedThemeLabel
  }) : /*#__PURE__*/_react.default.createElement(_SearchResult.default, {
    filteredPapers: filteredPapers
  }) : /*#__PURE__*/_react.default.createElement(_Empty.default, {
    icon: _HomeCloud.default,
    iconSize: "large",
    title: t('Home.Empty.title'),
    text: t('Home.Empty.text'),
    className: "u-ph-1"
  }), !isMultiSelectionActive && /*#__PURE__*/_react.default.createElement(_FeaturedPlaceholdersList.default, {
    featuredPlaceholders: featuredPlaceholders
  }));
};

Home.propTypes = {
  setSelectedThemeLabel: _propTypes.default.func
};
var _default = Home;
exports.default = _default;