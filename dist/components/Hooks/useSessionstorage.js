"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSessionstorage = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _cozyLogger = _interopRequireDefault(require("cozy-logger"));

// TODO Move to cozy-client
var useSessionstorage = function useSessionstorage(key, initialValue) {
  var _useState = (0, _react.useState)(function () {
    try {
      var item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      (0, _cozyLogger.default)('error', error);
      return initialValue;
    }
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      sessionValue = _useState2[0],
      setSessionValueState = _useState2[1];

  var setSessionValue = (0, _react.useCallback)(function (value) {
    try {
      var valueToStore = value instanceof Function ? value(sessionValue) : value;
      setSessionValueState(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      (0, _cozyLogger.default)('error', error);
    }
  }, [key, sessionValue]);
  return [sessionValue, setSessionValue];
};

exports.useSessionstorage = useSessionstorage;