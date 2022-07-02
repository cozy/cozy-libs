"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _FileInput = _interopRequireDefault(require("cozy-ui/transpiled/react/FileInput"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _Divider = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/Divider"));

var styleBtn = {
  color: 'var(--primaryTextColor)'
};

var ScanMobileActions = function ScanMobileActions(_ref) {
  var openFilePickerModal = _ref.openFilePickerModal,
      onChangeFile = _ref.onChangeFile;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Divider.default, {
    textAlign: "center",
    className: "u-mv-1"
  }, t('Scan.divider')), /*#__PURE__*/_react.default.createElement(_Buttons.default, {
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
    "data-testid": "importPicFromMobile-btn"
  }, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    variant: "secondary",
    component: "a",
    style: styleBtn,
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "phone-upload"
    }),
    fullWidth: true,
    className: "u-m-0",
    label: t('Scan.importPicFromMobile')
  }))), /*#__PURE__*/_react.default.createElement(_FileInput.default, {
    onChange: onChangeFile,
    className: "u-w-100 u-ta-center u-ml-0",
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    capture: "environment",
    accept: 'image/*',
    "data-testid": "takePic-btn"
  }, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "camera"
    }),
    component: "a",
    fullWidth: true,
    className: "u-m-0",
    label: t('Scan.takePic')
  })));
};

var _default = ScanMobileActions;
exports.default = _default;