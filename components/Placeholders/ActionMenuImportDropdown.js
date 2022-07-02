"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ActionMenu = _interopRequireDefault(require("cozy-ui/transpiled/react/ActionMenu"));

var _Icon = require("cozy-ui/transpiled/react/Icon");

var _ImportDropdown = _interopRequireDefault(require("../ImportDropdown/ImportDropdown"));

var ActionMenuImportDropdown = function ActionMenuImportDropdown(_ref) {
  var className = _ref.className,
      anchorElRef = _ref.anchorElRef,
      isOpened = _ref.isOpened,
      placeholder = _ref.placeholder,
      onClose = _ref.onClose,
      onClick = _ref.onClick;

  if (!isOpened) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_ActionMenu.default, {
    className: className,
    anchorElRef: anchorElRef,
    onClose: onClose
  }, /*#__PURE__*/_react.default.createElement(_ImportDropdown.default, {
    placeholder: placeholder,
    onClose: onClose,
    onClick: onClick
  }));
};

ActionMenuImportDropdown.propTypes = {
  className: _propTypes.default.string,
  anchorElRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.instanceOf(Element)
  })]),
  isOpened: _propTypes.default.bool.isRequired,
  placeholder: _propTypes.default.shape({
    label: _propTypes.default.string.isRequired,
    icon: _Icon.iconPropType.isRequired,
    acquisitionSteps: _propTypes.default.array,
    connectorCriteria: _propTypes.default.shape({
      name: _propTypes.default.string,
      category: _propTypes.default.string
    })
  }),
  onClose: _propTypes.default.func,
  onClick: _propTypes.default.func
};
var _default = ActionMenuImportDropdown;
exports.default = _default;