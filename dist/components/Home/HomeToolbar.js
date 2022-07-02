"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _BarTitle = _interopRequireDefault(require("cozy-ui/transpiled/react/BarTitle"));

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _CozyTheme = _interopRequireDefault(require("cozy-ui/transpiled/react/CozyTheme"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

/* global cozy */
var HomeToolbar = function HomeToolbar() {
  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isDesktop = _useBreakpoints.isDesktop;

  var history = (0, _reactRouterDom.useHistory)();

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      setIsMultiSelectionActive = _useMultiSelection.setIsMultiSelectionActive;

  var _cozy$bar = cozy.bar,
      BarRight = _cozy$bar.BarRight,
      BarLeft = _cozy$bar.BarLeft,
      BarCenter = _cozy$bar.BarCenter;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(BarLeft, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    onClick: function onClick() {
      return history.goBack();
    }
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "previous"
  }))), /*#__PURE__*/_react.default.createElement(BarRight, null, !isDesktop ? /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    onClick: function onClick() {
      return setIsMultiSelectionActive(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "cross-medium"
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)), /*#__PURE__*/_react.default.createElement(BarCenter, null, /*#__PURE__*/_react.default.createElement(_CozyTheme.default, {
    variant: "normal"
  }, /*#__PURE__*/_react.default.createElement(_BarTitle.default, null, t('Multiselect.select')))));
};

var _default = HomeToolbar;
exports.default = _default;