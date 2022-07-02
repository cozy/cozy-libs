"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ModalStack = exports.ModalProvider = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _useModal2 = require("../Hooks/useModal");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ModalContext = /*#__PURE__*/(0, _react.createContext)();

var ModalProvider = function ModalProvider(_ref) {
  var children = _ref.children;

  var _useState = (0, _react.useState)([]),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      modalStack = _useState2[0],
      setModalStack = _useState2[1];

  var pushModal = (0, _react.useCallback)(function (modal) {
    setModalStack(function (prev) {
      return [].concat((0, _toConsumableArray2.default)(prev), [modal]);
    });
  }, []);
  var popModal = (0, _react.useCallback)(function () {
    modalStack.pop();
    setModalStack((0, _toConsumableArray2.default)(modalStack));
  }, [modalStack]);
  return /*#__PURE__*/_react.default.createElement(ModalContext.Provider, {
    value: {
      modalStack: modalStack,
      pushModal: pushModal,
      popModal: popModal
    }
  }, children);
};

exports.ModalProvider = ModalProvider;
var _default = ModalContext;
exports.default = _default;

var ModalStack = function ModalStack() {
  var _useModal = (0, _useModal2.useModal)(),
      modalStack = _useModal.modalStack;

  if (modalStack.length === 0) return null;else return modalStack[modalStack.length - 1];
};

exports.ModalStack = ModalStack;