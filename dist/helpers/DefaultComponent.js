"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComponents = void 0;

var _PapersFab = _interopRequireDefault(require("../components/PapersFab/PapersFab"));

var defaultComponents = {
  PapersFab: _PapersFab.default
};

var getComponents = function getComponents(components) {
  return {
    PapersFab: components !== null && components !== void 0 && components.PapersFab || (components === null || components === void 0 ? void 0 : components.PapersFab) === null ? components.PapersFab : defaultComponents.PapersFab
  };
};

exports.getComponents = getComponents;