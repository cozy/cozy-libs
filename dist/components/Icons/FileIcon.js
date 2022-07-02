"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _IconStack = _interopRequireDefault(require("cozy-ui/transpiled/react/IconStack"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var FileIcon = function FileIcon(_ref) {
  var icon = _ref.icon,
      faded = _ref.faded;
  return /*#__PURE__*/_react.default.createElement(_IconStack.default, {
    backgroundClassName: faded ? 'u-o-50' : '',
    backgroundIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "file-duotone",
      color: "#E049BF",
      size: 32
    }),
    foregroundIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: icon,
      color: "#E049BF",
      size: 16
    })
  });
};

FileIcon.propTypes = {
  icon: _propTypes.default.string,
  faded: _propTypes.default.bool
};
var _default = FileIcon;
exports.default = _default;