"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PapersDefinitionsProvider = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _useFlag = _interopRequireDefault(require("cozy-flags/dist/useFlag"));

var _cozyLogger = _interopRequireDefault(require("cozy-logger"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Alerter = _interopRequireDefault(require("cozy-ui/transpiled/react/Alerter"));

var _papersDefinitions = _interopRequireDefault(require("../../constants/papersDefinitions.json"));

var _fetchCustomPaperDefinitions = require("../../utils/fetchCustomPaperDefinitions");

var _fetchContentFileToJson = require("../../utils/fetchContentFileToJson");

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _buildPapersDefinitions = require("../../helpers/buildPapersDefinitions");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PapersDefinitionsContext = /*#__PURE__*/(0, _react.createContext)();

var PapersDefinitionsProvider = function PapersDefinitionsProvider(_ref) {
  var children = _ref.children;
  var client = (0, _cozyClient.useClient)();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useState = (0, _react.useState)({
    isLoaded: false,
    name: '',
    path: ''
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      customPapersDefinitions = _useState2[0],
      setCustomPapersDefinitions = _useState2[1];

  var customPapersDefinitionsFlag = (0, _useFlag.default)('customPapersDefinitions');

  var _useState3 = (0, _react.useState)([]),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      papersDefinitions = _useState4[0],
      setPapersDefinitions = _useState4[1];

  (0, _react.useEffect)(function () {
    ;
    (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _yield$fetchCustomPap, paperConfigFilenameCustom, appFolderPath, file, data;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!customPapersDefinitionsFlag) {
                _context.next = 13;
                break;
              }

              _context.next = 3;
              return (0, _fetchCustomPaperDefinitions.fetchCustomPaperDefinitions)(client, t);

            case 3:
              _yield$fetchCustomPap = _context.sent;
              paperConfigFilenameCustom = _yield$fetchCustomPap.paperConfigFilenameCustom;
              appFolderPath = _yield$fetchCustomPap.appFolderPath;
              file = _yield$fetchCustomPap.file;
              _context.next = 9;
              return (0, _fetchContentFileToJson.fetchContentFileToJson)(client, file);

            case 9:
              data = _context.sent;

              if (data) {
                setCustomPapersDefinitions({
                  isLoaded: true,
                  name: paperConfigFilenameCustom,
                  path: appFolderPath
                });
                setPapersDefinitions((0, _buildPapersDefinitions.buildPapersDefinitions)(data.papersDefinitions, scannerT));
                (0, _cozyLogger.default)('info', 'Custom PapersDefinitions loaded');
              } else {
                // If custom papersDefinitions.json not found, fallback on local file
                _Alerter.default.error(t("PapersDefinitionsProvider.customPapersDefinitions.error", {
                  name: paperConfigFilenameCustom,
                  path: appFolderPath
                }), {
                  buttonText: 'Ok',
                  buttonAction: function buttonAction(dismiss) {
                    return dismiss();
                  },
                  duration: 20000
                });

                setPapersDefinitions((0, _buildPapersDefinitions.buildPapersDefinitions)(_papersDefinitions.default.papersDefinitions, scannerT));
                (0, _cozyLogger.default)('info', 'PapersDefinitions of the app loaded');
              }

              _context.next = 16;
              break;

            case 13:
              // If has no custom papersDefinitions Flag
              setCustomPapersDefinitions({
                isLoaded: false,
                name: '',
                path: ''
              });
              setPapersDefinitions((0, _buildPapersDefinitions.buildPapersDefinitions)(_papersDefinitions.default.papersDefinitions, scannerT));
              (0, _cozyLogger.default)('info', 'PapersDefinitions of the app loaded');

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [client, customPapersDefinitionsFlag, scannerT, t]);
  return /*#__PURE__*/_react.default.createElement(PapersDefinitionsContext.Provider, {
    value: {
      papersDefinitions: papersDefinitions,
      customPapersDefinitions: customPapersDefinitions
    }
  }, children);
};

exports.PapersDefinitionsProvider = PapersDefinitionsProvider;
var _default = PapersDefinitionsContext;
exports.default = _default;