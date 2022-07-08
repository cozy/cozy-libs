"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trash = void 0;

var _react = _interopRequireDefault(require("react"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _doctypes = require("../../../doctypes");

var _DeleteConfirm = _interopRequireDefault(require("../DeleteConfirm"));

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var trash = function trash(_ref) {
  var pushModal = _ref.pushModal,
      popModal = _ref.popModal;
  return {
    name: 'trash',
    action: function action(files) {
      return pushModal( /*#__PURE__*/_react.default.createElement(_DeleteConfirm.default, {
        files: files,
        referenced: (0, _cozyClient.isReferencedBy)(files, _doctypes.CONTACTS_DOCTYPE),
        onClose: popModal
      }));
    },
    Component: function Trash(_ref2) {
      var onClick = _ref2.onClick,
          className = _ref2.className;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "trash",
        iconProps: {
          color: 'var(--errorColor)'
        },
        typographyProps: {
          color: 'error'
        },
        onClick: onClick
      }, t('action.trash'));
    }
  };
};

exports.trash = trash;