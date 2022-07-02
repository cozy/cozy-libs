"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = void 0;

var _react = _interopRequireDefault(require("react"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _utils = require("../utils");

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var download = function download(_ref) {
  var client = _ref.client;
  return {
    name: 'download',
    action: function action(files) {
      return (0, _utils.downloadFiles)(client, files);
    },
    Component: function Download(_ref2) {
      var onClick = _ref2.onClick,
          className = _ref2.className;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "download",
        onClick: onClick
      }, t('action.download'));
    }
  };
};

exports.download = download;