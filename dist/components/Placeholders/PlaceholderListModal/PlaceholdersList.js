"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("cozy-ui/transpiled/react/ListItemText"));

var _FileIcon = _interopRequireDefault(require("../../Icons/FileIcon"));

var _useScannerI18n = require("../../Hooks/useScannerI18n");

var _usePapersDefinitions2 = require("../../Hooks/usePapersDefinitions");

var _findPlaceholders = require("../../../helpers/findPlaceholders");

var _ActionMenuImportDropdown = _interopRequireDefault(require("../ActionMenuImportDropdown"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)(function () {
  return {
    placeholderList: {
      minHeight: '15rem',
      margin: '0.5rem 0'
    },
    actionMenu: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      '& >div:first-child': {
        position: 'relative !important',
        transform: 'none !important'
      }
    }
  };
});

var PlaceholdersList = function PlaceholdersList(_ref) {
  var currentQualifItems = _ref.currentQualifItems;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isImportDropdownDisplayed = _useState2[0],
      setIsImportDropdownDisplayed = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      placeholderSelected = _useState4[0],
      setPlaceholderSelected = _useState4[1];

  var _usePapersDefinitions = (0, _usePapersDefinitions2.usePapersDefinitions)(),
      papersDefinitions = _usePapersDefinitions.papersDefinitions;

  var history = (0, _reactRouterDom.useHistory)();

  var _useLocation = (0, _reactRouterDom.useLocation)(),
      search = _useLocation.search;

  var styles = useStyles();
  var scannerT = (0, _useScannerI18n.useScannerI18n)(); // Get the backgroundPath to pass it to the next modal
  // Otherwise the next modal will have the url of this modal in backgroundPath

  var backgroundPath = new URLSearchParams(search).get('backgroundPath');
  var allPlaceholders = (0, _react.useMemo)(function () {
    return (0, _findPlaceholders.findPlaceholdersByQualification)(papersDefinitions, currentQualifItems);
  }, [currentQualifItems, papersDefinitions]);

  var hideImportDropdown = function hideImportDropdown() {
    setIsImportDropdownDisplayed(false);
    setPlaceholderSelected(undefined);
  };

  var shouldDisplayImportDropdown = function shouldDisplayImportDropdown() {
    return !!isImportDropdownDisplayed && !!placeholderSelected;
  };

  var redirectPaperCreation = function redirectPaperCreation(placeholder) {
    return history.push({
      pathname: "/paper/create/".concat(placeholder.label),
      search: "deepBack&backgroundPath=".concat(backgroundPath)
    });
  };

  var showImportDropdown = function showImportDropdown(placeholder) {
    if (placeholder.connectorCriteria) {
      setIsImportDropdownDisplayed(true);
      setPlaceholderSelected(placeholder);
    } else {
      redirectPaperCreation(placeholder);
    }
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_List.default, {
    className: styles.placeholderList
  }, allPlaceholders.map(function (placeholder, idx) {
    var validPlaceholder = placeholder.acquisitionSteps.length > 0 || placeholder.connectorCriteria;
    return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      key: idx,
      button: true,
      disabled: !validPlaceholder,
      onClick: function onClick() {
        return showImportDropdown(placeholder);
      },
      "data-testid": "PlaceholdersList-ListItem"
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_FileIcon.default, {
      icon: placeholder.icon
    })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: scannerT("items.".concat(placeholder.label))
    }));
  })), /*#__PURE__*/_react.default.createElement(_ActionMenuImportDropdown.default, {
    className: styles.actionMenu,
    isOpened: shouldDisplayImportDropdown(),
    placeholder: placeholderSelected,
    onClose: hideImportDropdown,
    onClick: function onClick() {
      return redirectPaperCreation(placeholderSelected);
    }
  }));
};

PlaceholdersList.propTypes = {
  currentQualifItems: _propTypes.default.arrayOf(_propTypes.default.exact({
    label: _propTypes.default.string,
    subjects: _propTypes.default.arrayOf(_propTypes.default.string),
    purpose: _propTypes.default.string,
    sourceCategory: _propTypes.default.string,
    sourceSubCategory: _propTypes.default.string
  })).isRequired
};
var _default = PlaceholdersList;
exports.default = _default;