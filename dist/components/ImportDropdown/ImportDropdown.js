"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Icon = _interopRequireWildcard(require("cozy-ui/transpiled/react/Icon"));

var _ActionMenu = require("cozy-ui/transpiled/react/ActionMenu");

var _Media = require("cozy-ui/transpiled/react/Media");

var _FileIcon = _interopRequireDefault(require("../Icons/FileIcon"));

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _ImportDropdownItems = _interopRequireDefault(require("./ImportDropdownItems"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ImportDropdown = function ImportDropdown(_ref) {
  var placeholder = _ref.placeholder,
      onClick = _ref.onClick,
      onClose = _ref.onClose;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var scannerT = (0, _useScannerI18n.useScannerI18n)();
  var label = placeholder.label,
      icon = placeholder.icon;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ActionMenu.ActionMenuHeader, null, /*#__PURE__*/_react.default.createElement(_Media.Media, null, /*#__PURE__*/_react.default.createElement(_Media.Img, null, /*#__PURE__*/_react.default.createElement(_FileIcon.default, {
    icon: icon
  })), /*#__PURE__*/_react.default.createElement(_Media.Bd, {
    className: "u-ml-1 u-flex u-flex-items-center u-flex-justify-between"
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6"
  }, t('ImportDropdown.title', {
    name: scannerT("items.".concat(label))
  })), onClose && /*#__PURE__*/_react.default.createElement("div", {
    className: "u-flex"
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "cross-medium",
    className: "u-c-pointer u-pl-half",
    onClick: onClose
  }))))), /*#__PURE__*/_react.default.createElement(_ImportDropdownItems.default, {
    onClick: onClick,
    placeholder: placeholder
  }));
};

ImportDropdown.propTypes = {
  placeholder: _propTypes.default.shape({
    label: _propTypes.default.string.isRequired,
    icon: _Icon.iconPropType.isRequired,
    acquisitionSteps: _propTypes.default.array.isRequired,
    connectorCriteria: _propTypes.default.shape({
      name: _propTypes.default.string,
      category: _propTypes.default.string
    })
  }).isRequired,
  onClose: _propTypes.default.func,
  onClick: _propTypes.default.func
};
var _default = ImportDropdown;
exports.default = _default;