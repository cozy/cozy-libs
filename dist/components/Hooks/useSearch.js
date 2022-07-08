"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSearch = void 0;

var _react = require("react");

var _SearchProvider = _interopRequireDefault(require("../Contexts/SearchProvider"));

var useSearch = function useSearch() {
  var searchContext = (0, _react.useContext)(_SearchProvider.default);

  if (!searchContext) {
    throw new Error('SearchContext must be used within a SearchProvider');
  }

  return searchContext;
};

exports.useSearch = useSearch;