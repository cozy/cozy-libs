"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ActionMenu = _interopRequireDefault(require("cozy-ui/transpiled/react/ActionMenu"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ActionMenuWrapper = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var onClose = _ref.onClose,
      children = _ref.children;
  return /*#__PURE__*/_react.default.createElement(_ActionMenu.default, {
    onClose: onClose,
    anchorElRef: ref
  }, _react.Children.map(children, function (child) {
    if ( /*#__PURE__*/(0, _react.isValidElement)(child)) {
      return /*#__PURE__*/(0, _react.cloneElement)(child, {
        onClose: onClose
      });
    }

    return null;
  }));
});
ActionMenuWrapper.displayName = 'ActionMenuWrapper';
var _default = ActionMenuWrapper;
exports.default = _default;