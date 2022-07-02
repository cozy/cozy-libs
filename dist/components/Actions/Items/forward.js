"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forward = void 0;

var _react = _interopRequireDefault(require("react"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _utils = require("../utils");

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var forward = function forward(_ref) {
  var client = _ref.client;
  return {
    name: 'forward',
    action: function action(files, t) {
      return (0, _utils.forwardFile)(client, files, t);
    },
    Component: function Forward(_ref2) {
      var onClick = _ref2.onClick,
          className = _ref2.className;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "reply",
        onClick: onClick
      }, t('action.forward'));
    }
  };
};

exports.forward = forward;