"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _FileInput = _interopRequireDefault(require("cozy-ui/transpiled/react/FileInput"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _useEventListener = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useEventListener"));

var _const = require("../../constants/const");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var styleBtn = {
  color: 'var(--primaryTextColor)'
};

var ScanDesktopActions = function ScanDesktopActions(_ref) {
  var openFilePickerModal = _ref.openFilePickerModal,
      onChangeFile = _ref.onChangeFile;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var buttonRef = /*#__PURE__*/(0, _react.createRef)();

  var handleKeyDown = function handleKeyDown(_ref2) {
    var key = _ref2.key;

    if (key === _const.KEYS.ENTER && buttonRef.current) {
      buttonRef.current.click();
    }
  };

  (0, _useEventListener.default)(window, 'keydown', handleKeyDown);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    variant: "secondary",
    style: styleBtn,
    onClick: openFilePickerModal,
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "folder-moveto"
    }),
    label: t('Scan.selectPicFromCozy'),
    "data-testid": "selectPicFromCozy-btn"
  }), /*#__PURE__*/_react.default.createElement(_FileInput.default, {
    onChange: onChangeFile,
    className: "u-w-100 u-ml-0",
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    accept: 'image/*,.pdf',
    "data-testid": "importPicFromDesktop-btn"
  }, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "phone-upload"
    }),
    component: "a",
    ref: buttonRef,
    className: "u-w-100 u-m-0 u-mb-1",
    label: t('Scan.importPicFromDesktop')
  })));
};

var _default = ScanDesktopActions;
exports.default = _default;