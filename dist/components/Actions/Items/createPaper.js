"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPaper = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _ActionMenuItemWrapper = _interopRequireDefault(require("../ActionMenuItemWrapper"));

var createPaper = function createPaper(_ref) {
  var hideActionsMenu = _ref.hideActionsMenu;
  return {
    name: 'createPaper',
    Component: function CreatePaper(_ref2) {
      var className = _ref2.className;

      var _useI18n = (0, _I18n.useI18n)(),
          t = _useI18n.t;

      var history = (0, _reactRouterDom.useHistory)();

      var _useLocation = (0, _reactRouterDom.useLocation)(),
          pathname = _useLocation.pathname;

      return /*#__PURE__*/_react.default.createElement(_ActionMenuItemWrapper.default, {
        className: className,
        icon: "paper",
        onClick: function onClick() {
          history.push({
            pathname: "/paper/create",
            search: "backgroundPath=".concat(pathname)
          });
          hideActionsMenu && hideActionsMenu();
        }
      }, t('action.createPaper'));
    }
  };
};

exports.createPaper = createPaper;