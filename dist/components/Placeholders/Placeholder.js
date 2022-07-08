"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _Divider = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/Divider"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _InfosBadge = _interopRequireDefault(require("cozy-ui/transpiled/react/InfosBadge"));

var _FileIcon = _interopRequireDefault(require("../Icons/FileIcon"));

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _PaperDefinitionsPropTypes = require("../../constants/PaperDefinitionsPropTypes");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Placeholder = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var placeholder = _ref.placeholder,
      divider = _ref.divider,
      _onClick = _ref.onClick;
  var scannerT = (0, _useScannerI18n.useScannerI18n)();
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    button: true,
    onClick: function onClick() {
      return _onClick(placeholder);
    },
    ref: ref,
    "data-testid": "Placeholder-ListItem"
  }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_InfosBadge.default, {
    badgeContent: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "plus",
      size: 10,
      color: "var(--primaryTextColor)"
    })
  }, /*#__PURE__*/_react.default.createElement(_FileIcon.default, {
    icon: placeholder.icon,
    faded: true
  }))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    color: "textSecondary"
  }, scannerT("items.".concat(placeholder.label)))), divider && /*#__PURE__*/_react.default.createElement(_Divider.default, {
    variant: "inset",
    component: "li"
  }));
});
Placeholder.displayName = 'Placeholder';
Placeholder.propTypes = {
  placeholder: _PaperDefinitionsPropTypes.PaperDefinitionsPropTypes.isRequired,
  divider: _propTypes.default.bool
};

var _default = /*#__PURE__*/_react.default.memo(Placeholder);

exports.default = _default;