"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _utils = require("../Actions/utils");

var ForwardModal = function ForwardModal(_ref) {
  var onClose = _ref.onClose,
      onForward = _ref.onForward,
      fileToForward = _ref.fileToForward;
  var client = (0, _cozyClient.useClient)();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var handleClick = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _utils.forwardFile)(client, [fileToForward], t);

            case 2:
              onForward && onForward();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function handleClick() {
      return _ref2.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/_react.default.createElement(_CozyDialogs.ConfirmDialog, {
    open: true,
    onClose: onClose,
    content: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "u-ta-center u-mb-1"
    }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "file-type-zip",
      size: 64
    })), /*#__PURE__*/_react.default.createElement(_Typography.default, null, t('ForwardModal.content'))),
    actions: /*#__PURE__*/_react.default.createElement(_Buttons.default, {
      label: t('ForwardModal.action'),
      onClick: handleClick
    })
  });
};

ForwardModal.propTypes = {
  onForward: _propTypes.default.func,
  onClose: _propTypes.default.func,
  fileToForward: _propTypes.default.object
};
var _default = ForwardModal;
exports.default = _default;