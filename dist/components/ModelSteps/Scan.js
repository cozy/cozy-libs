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

var _DialogActions = _interopRequireDefault(require("cozy-ui/transpiled/react/DialogActions"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _FilePicker = _interopRequireDefault(require("cozy-ui/transpiled/react/FilePicker"));

var _Alerter = _interopRequireDefault(require("cozy-ui/transpiled/react/Alerter"));

var _cozyDeviceHelper = require("cozy-device-helper");

var _CompositeHeader = _interopRequireDefault(require("../CompositeHeader/CompositeHeader"));

var _AcquisitionResult = _interopRequireDefault(require("../ModelSteps/AcquisitionResult"));

var _ScanMobileActions = _interopRequireDefault(require("../ModelSteps/ScanMobileActions"));

var _ScanDesktopActions = _interopRequireDefault(require("../ModelSteps/ScanDesktopActions"));

var _IlluGenericNewPage = _interopRequireDefault(require("../../assets/icons/IlluGenericNewPage.svg"));

var _makeBlobWithCustomAttrs = require("../../helpers/makeBlobWithCustomAttrs");

var _useFormData2 = require("../Hooks/useFormData");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var fetchBlobFileById = _cozyClient.models.file.fetchBlobFileById; // TODO Waiting for this type of filter to be implemented on the FilePicker side
// https://github.com/cozy/cozy-ui/issues/2026

var validFileType = function validFileType(file) {
  var regexValidation = /(image\/*)|(application\/pdf)/;
  return regexValidation.test(file.type);
};

var Scan = function Scan(_ref) {
  var currentStep = _ref.currentStep;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var client = (0, _cozyClient.useClient)();

  var _useFormData = (0, _useFormData2.useFormData)(),
      formData = _useFormData.formData;

  var illustration = currentStep.illustration,
      text = currentStep.text,
      stepIndex = currentStep.stepIndex;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      currentFile = _useState2[0],
      setCurrentFile = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isFilePickerModalOpen = _useState4[0],
      setIsFilePickerModalOpen = _useState4[1];

  var _useState5 = (0, _react.useState)(''),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      cozyFileId = _useState6[0],
      setCozyFileId = _useState6[1];

  var onChangeFile = (0, _react.useCallback)(function (file) {
    if (file) {
      setCurrentFile(file);
    }
  }, []);

  var openFilePickerModal = function openFilePickerModal() {
    return setIsFilePickerModalOpen(true);
  };

  var closeFilePickerModal = function closeFilePickerModal() {
    return setIsFilePickerModalOpen(false);
  };

  var onChangeFilePicker = function onChangeFilePicker(fileId) {
    return setCozyFileId(fileId);
  };

  (0, _react.useEffect)(function () {
    var data = formData.data.filter(function (data) {
      return data.stepIndex === stepIndex;
    });

    var _ref2 = data[data.length - 1] || {},
        file = _ref2.file;

    if (file) {
      setCurrentFile(file);
    }
  }, [formData.data, stepIndex]);
  (0, _react.useEffect)(function () {
    ;
    (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var blobFile, blobFileCustom;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!cozyFileId) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return fetchBlobFileById(client, cozyFileId);

            case 3:
              blobFile = _context.sent;

              if (validFileType(blobFile)) {
                blobFileCustom = (0, _makeBlobWithCustomAttrs.makeBlobWithCustomAttrs)(blobFile, {
                  id: cozyFileId
                });
                onChangeFile(blobFileCustom);
              } else {
                _Alerter.default.error('Scan.modal.validFileType', {
                  duration: 3000
                });
              }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [client, cozyFileId, onChangeFile]);
  return currentFile ? /*#__PURE__*/_react.default.createElement(_AcquisitionResult.default, {
    currentFile: currentFile,
    setCurrentFile: setCurrentFile,
    currentStep: currentStep
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CompositeHeader.default, {
    icon: illustration,
    iconSize: "large",
    fallbackIcon: _IlluGenericNewPage.default,
    title: t(text)
  }), /*#__PURE__*/_react.default.createElement(_DialogActions.default, {
    disableSpacing: true,
    className: "columnLayout u-mh-0 u-mb-1 cozyDialogActions"
  }, (0, _cozyDeviceHelper.isMobile)() ? /*#__PURE__*/_react.default.createElement(_ScanMobileActions.default, {
    onChangeFile: onChangeFile,
    openFilePickerModal: openFilePickerModal
  }) : /*#__PURE__*/_react.default.createElement(_ScanDesktopActions.default, {
    onChangeFile: onChangeFile,
    openFilePickerModal: openFilePickerModal
  })), isFilePickerModalOpen && /*#__PURE__*/_react.default.createElement(_FilePicker.default, {
    onChange: onChangeFilePicker,
    onClose: closeFilePickerModal
  }));
};

var _default = /*#__PURE__*/(0, _react.memo)(Scan);

exports.default = _default;