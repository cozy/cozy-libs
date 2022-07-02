"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var useStyles = (0, _makeStyles.default)({
  buttonStartIcon: {
    marginRight: '1.5rem'
  },
  buttonRoot: {
    borderRadius: '0.5rem',
    padding: '2rem 1rem 2rem 1.5rem',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 'normal'
  },
  label: {
    justifyContent: 'flex-start'
  }
});

var GhostButton = function GhostButton(_ref) {
  var label = _ref.label,
      fullWidth = _ref.fullWidth,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? undefined : _ref$onClick;
  var styles = useStyles();
  return /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    label: label,
    classes: {
      label: styles.label,
      root: styles.buttonRoot,
      startIcon: styles.buttonStartIcon
    },
    fullWidth: fullWidth,
    onClick: onClick,
    variant: "ghost",
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "plus"
    })
  });
};

GhostButton.propTypes = {
  label: _propTypes.default.string,
  fullWidth: _propTypes.default.bool,
  onClick: _propTypes.default.func
};
var _default = GhostButton;
exports.default = _default;