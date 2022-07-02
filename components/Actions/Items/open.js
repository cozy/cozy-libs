"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var open = function open() {
  return {
    name: 'open',
    Component: function Open(_ref) {
      var className = _ref.className,
          files = _ref.files;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      var history = (0, _reactRouterDom.useHistory)();
      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "openwith",
        onClick: function onClick() {
          return history.push({
            pathname: "/paper/file/".concat(files[0]._id)
          });
        }
      }, t('action.open'));
    }
  };
};

exports.open = open;