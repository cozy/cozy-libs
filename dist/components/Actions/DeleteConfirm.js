"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _cozyClient = require("cozy-client");

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Button = _interopRequireDefault(require("cozy-ui/transpiled/react/Button"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Stack = _interopRequireDefault(require("cozy-ui/transpiled/react/Stack"));

var _Checkbox = _interopRequireDefault(require("cozy-ui/transpiled/react/Checkbox"));

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DeleteConfirm = function DeleteConfirm(_ref) {
  var files = _ref.files,
      onClose = _ref.onClose,
      children = _ref.children;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var client = (0, _cozyClient.useClient)();

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isDeleting = _useState2[0],
      setDeleting = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      clearQualification = _useState4[0],
      setClearQualification = _useState4[1];

  var onDelete = (0, _react.useCallback)( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setDeleting(true);

            if (!clearQualification) {
              _context.next = 6;
              break;
            }

            _context.next = 4;
            return (0, _utils.removeQualification)(client, files);

          case 4:
            _context.next = 8;
            break;

          case 6:
            _context.next = 8;
            return (0, _utils.trashFiles)(client, files);

          case 8:
            onClose();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), [clearQualification, client, files, onClose]);

  var handleOnChange = function handleOnChange() {
    setClearQualification(function (prev) {
      return !prev;
    });
  };

  return /*#__PURE__*/_react.default.createElement(_CozyDialogs.ConfirmDialog, {
    open: true,
    onClose: onClose,
    title: t('DeleteConfirm.title'),
    content: /*#__PURE__*/_react.default.createElement(_Stack.default, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      dangerouslySetInnerHTML: {
        __html: t('DeleteConfirm.text', {
          name: files[0].name
        })
      }
    }), /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
      value: clearQualification,
      onChange: handleOnChange,
      label: t('DeleteConfirm.choice')
    }), children),
    actions: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      theme: "secondary",
      onClick: onClose,
      label: t('DeleteConfirm.cancel')
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      busy: isDeleting,
      theme: "danger",
      label: t('DeleteConfirm.delete'),
      onClick: onDelete
    }))
  });
};

var _default = DeleteConfirm;
exports.default = _default;