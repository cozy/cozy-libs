"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _BarTitle = _interopRequireDefault(require("cozy-ui/transpiled/react/BarTitle"));

var _CozyTheme = _interopRequireDefault(require("cozy-ui/transpiled/react/CozyTheme"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

/* global cozy */
var PapersListToolbar = function PapersListToolbar(_ref) {
  var title = _ref.title,
      onBack = _ref.onBack,
      onClose = _ref.onClose;

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      isMultiSelectionActive = _useMultiSelection.isMultiSelectionActive;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isDesktop = _useBreakpoints.isDesktop;

  var _cozy$bar = cozy.bar,
      BarLeft = _cozy$bar.BarLeft,
      BarRight = _cozy$bar.BarRight,
      BarCenter = _cozy$bar.BarCenter;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(BarLeft, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    onClick: onBack
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "previous"
  }))), /*#__PURE__*/_react.default.createElement(BarCenter, null, /*#__PURE__*/_react.default.createElement(_CozyTheme.default, {
    variant: "normal"
  }, /*#__PURE__*/_react.default.createElement(_BarTitle.default, null, title))), isMultiSelectionActive && /*#__PURE__*/_react.default.createElement(BarRight, null, !isDesktop && /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    onClick: onClose
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "cross-medium"
  }))));
};

PapersListToolbar.propTypes = {
  title: _propTypes.default.string,
  onBack: _propTypes.default.func,
  onClose: _propTypes.default.func
};
var _default = PapersListToolbar;
exports.default = _default;