"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

if (process.env.NODE_ENV === 'development') {
  var whyDidYouRender = require('@welldone-software/why-did-you-render');

  whyDidYouRender(_react.default, {
    trackAllPureComponents: true
  });
}