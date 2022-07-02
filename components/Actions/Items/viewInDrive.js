"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewInDrive = void 0;

var _react = _interopRequireDefault(require("react"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Link = _interopRequireDefault(require("cozy-ui/transpiled/react/Link"));

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var viewInDrive = function viewInDrive(_ref) {
  var client = _ref.client;
  return {
    name: 'viewInDrive',
    Component: function ViewInDrive(_ref2) {
      var onClick = _ref2.onClick,
          className = _ref2.className,
          files = _ref2.files;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      var dirId = files[0].dir_id;
      var webLink = (0, _cozyClient.generateWebLink)({
        slug: 'drive',
        cozyUrl: client.getStackClient().uri,
        subDomainType: client.getInstanceOptions().subdomain,
        pathname: '/',
        hash: "folder/".concat(dirId)
      });
      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "folder",
        text: t('action.viewInDrive'),
        onClick: onClick
      }, /*#__PURE__*/_react.default.createElement(_Link.default, {
        href: webLink,
        target: "_blank",
        className: "u-p-0"
      }, t('action.viewInDrive')));
    }
  };
};

exports.viewInDrive = viewInDrive;