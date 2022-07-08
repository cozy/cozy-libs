"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var select = function select(_ref) {
  var hideActionsMenu = _ref.hideActionsMenu,
      addMultiSelectionFile = _ref.addMultiSelectionFile;
  return {
    name: 'select',
    Component: function Select(_ref2) {
      var className = _ref2.className,
          files = _ref2.files;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      var history = (0, _reactRouterDom.useHistory)();

      var _useLocation = (0, _reactRouterDom.useLocation)(),
          pathname = _useLocation.pathname;

      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "paperplane",
        onClick: function onClick() {
          history.push({
            pathname: "/paper/multiselect",
            search: "backgroundPath=".concat(pathname)
          });
          hideActionsMenu && hideActionsMenu();
          files.length > 0 && addMultiSelectionFile && addMultiSelectionFile(files[0]);
        }
      }, files.length === 0 ? t('action.forwardPapers') : t('action.select'));
    }
  };
};

exports.select = select;