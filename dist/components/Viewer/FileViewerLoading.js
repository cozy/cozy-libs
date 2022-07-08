"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Overlay = _interopRequireDefault(require("cozy-ui/transpiled/react/Overlay"));

var _Spinner = _interopRequireDefault(require("cozy-ui/transpiled/react/Spinner"));

var FileViewerLoading = function FileViewerLoading() {
  return /*#__PURE__*/_react.default.createElement(_Overlay.default, null, /*#__PURE__*/_react.default.createElement(_Spinner.default, {
    size: "xxlarge",
    middle: true,
    noMargin: true,
    color: "var(--primaryContrastTextColor)"
  }));
};

var _default = FileViewerLoading;
exports.default = _default;