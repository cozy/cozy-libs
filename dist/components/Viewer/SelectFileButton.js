"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var SelectFileButton = function SelectFileButton(_ref) {
  var file = _ref.file;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var history = (0, _reactRouterDom.useHistory)();

  var _useLocation = (0, _reactRouterDom.useLocation)(),
      pathname = _useLocation.pathname;

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      addMultiSelectionFile = _useMultiSelection.addMultiSelectionFile;

  return /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    label: t('action.select'),
    className: "u-ml-half",
    fullWidth: true,
    onClick: function onClick() {
      history.push({
        pathname: "/paper/multiselect",
        search: "backgroundPath=".concat(pathname)
      });
      addMultiSelectionFile(file);
    },
    variant: "secondary",
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "select-all"
    })
  });
};

var _default = SelectFileButton;
exports.default = _default;