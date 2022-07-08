"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useModal = void 0;

var _react = require("react");

var _ModalProvider = _interopRequireDefault(require("../Contexts/ModalProvider"));

var useModal = function useModal() {
  var modalContext = (0, _react.useContext)(_ModalProvider.default);

  if (!modalContext) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return modalContext;
};

exports.useModal = useModal;