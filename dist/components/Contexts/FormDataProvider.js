"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FormDataProvider = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _cozyLogger = _interopRequireDefault(require("cozy-logger"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Alerter = _interopRequireDefault(require("cozy-ui/transpiled/react/Alerter"));

var _useStepperDialog2 = require("../Hooks/useStepperDialog");

var _getFolderWithReference = _interopRequireDefault(require("../../helpers/getFolderWithReference"));

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _createPdfAndSave = require("../../helpers/createPdfAndSave");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Qualification = _cozyClient.models.document.Qualification;
var FormDataContext = /*#__PURE__*/(0, _react.createContext)();

var FormDataProvider = function FormDataProvider(_ref) {
  var children = _ref.children;
  var client = (0, _cozyClient.useClient)();

  var _useI18n = (0, _I18n.useI18n)(),
      f = _useI18n.f,
      t = _useI18n.t;

  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useStepperDialog = (0, _useStepperDialog2.useStepperDialog)(),
      currentDefinition = _useStepperDialog.currentDefinition,
      stepperDialogTitle = _useStepperDialog.stepperDialogTitle;

  var _useState = (0, _react.useState)({
    metadata: {},
    data: [],
    contacts: []
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      formData = _useState2[0],
      setFormData = _useState2[1];

  var formSubmit = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var qualification, _yield$getOrCreateApp, appFolderID;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              qualification = Qualification.getByLabel(stepperDialogTitle);
              _context.next = 4;
              return (0, _getFolderWithReference.default)(client, t);

            case 4:
              _yield$getOrCreateApp = _context.sent;
              appFolderID = _yield$getOrCreateApp._id;
              _context.next = 8;
              return (0, _createPdfAndSave.createPdfAndSave)({
                formData: formData,
                qualification: qualification,
                currentDefinition: currentDefinition,
                appFolderID: appFolderID,
                client: client,
                i18n: {
                  t: t,
                  f: f,
                  scannerT: scannerT
                }
              });

            case 8:
              _Alerter.default.success('common.saveFile.success');

              _context.next = 15;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              (0, _cozyLogger.default)('error', _context.t0);

              _Alerter.default.error('common.saveFile.error');

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 11]]);
    }));

    return function formSubmit() {
      return _ref2.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/_react.default.createElement(FormDataContext.Provider, {
    value: {
      formData: formData,
      setFormData: setFormData,
      formSubmit: formSubmit
    }
  }, children);
};

exports.FormDataProvider = FormDataProvider;
var _default = FormDataContext;
exports.default = _default;