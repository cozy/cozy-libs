"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireWildcard(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("cozy-ui/transpiled/react/ListItemText"));

var _FileIcon = _interopRequireDefault(require("../../Icons/FileIcon"));

var _useScannerI18n = require("../../Hooks/useScannerI18n");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var themesList = _cozyClient.models.document.themes.themesList;

var PlaceholderThemesList = function PlaceholderThemesList(_ref) {
  var setQualifByTheme = _ref.setQualifByTheme;
  var scannerT = (0, _useScannerI18n.useScannerI18n)();
  return /*#__PURE__*/_react.default.createElement(_List.default, {
    className: "u-mv-half"
  }, themesList.map(function (theme) {
    return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      button: true,
      key: theme.id,
      onClick: function onClick() {
        return setQualifByTheme(theme);
      }
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_FileIcon.default, {
      icon: theme.icon
    })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: scannerT("themes.".concat(theme.label))
    }), /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "right",
      size: _ListItemIcon.smallSize,
      color: "var(--secondaryTextColor)"
    }));
  }));
};

PlaceholderThemesList.propTypes = {
  setQualifByTheme: _propTypes.default.func.isRequired
};
var _default = PlaceholderThemesList;
exports.default = _default;