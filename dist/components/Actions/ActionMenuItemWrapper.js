"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _ActionMenu = require("cozy-ui/transpiled/react/ActionMenu");

var useStyles = (0, _makeStyles.default)(function (theme) {
  return {
    disabledItem: {
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'initial'
      }
    },
    disabledIcon: {
      fill: theme.palette.text.disabled
    },
    disabledTypography: {
      color: theme.palette.text.disabled
    }
  };
});

var ActionMenuItemWrapper = function ActionMenuItemWrapper(_ref) {
  var icon = _ref.icon,
      children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? undefined : _ref$onClick,
      _ref$isEnabled = _ref.isEnabled,
      isEnabled = _ref$isEnabled === void 0 ? true : _ref$isEnabled,
      _ref$iconProps = _ref.iconProps,
      iconProps = _ref$iconProps === void 0 ? {} : _ref$iconProps,
      _ref$typographyProps = _ref.typographyProps,
      typographyProps = _ref$typographyProps === void 0 ? {} : _ref$typographyProps;
  var styles = useStyles();
  return /*#__PURE__*/_react.default.createElement(_ActionMenu.ActionMenuItem, {
    onClick: onClick,
    className: (0, _classnames.default)("u-flex-items-center ".concat(className), (0, _defineProperty2.default)({}, styles.disabledItem, !isEnabled)),
    left: /*#__PURE__*/_react.default.createElement(_Icon.default, (0, _extends2.default)({
      icon: icon,
      className: (0, _classnames.default)((0, _defineProperty2.default)({}, styles.disabledIcon, !isEnabled))
    }, iconProps))
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, (0, _extends2.default)({
    className: (0, _classnames.default)((0, _defineProperty2.default)({}, styles.disabledTypography, !isEnabled))
  }, typographyProps), children));
};

var _default = ActionMenuItemWrapper;
exports.default = _default;