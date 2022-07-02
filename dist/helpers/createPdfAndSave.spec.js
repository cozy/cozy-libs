"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var addFileToPdf = _interopRequireWildcard(require("../utils/addFileToPdf"));

var buildFilename = _interopRequireWildcard(require("./buildFilename"));

var _createPdfAndSave = require("./createPdfAndSave");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

jest.mock('cozy-client', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client')), {}, {
    models: {
      contact: {
        getFullname: jest.fn()
      },
      file: {
        uploadFileWithConflictStrategy: jest.fn(function () {
          return {
            data: {
              _id: '1234'
            }
          };
        })
      }
    }
  });
});

var mockParams = function mockParams(file) {
  return {
    formData: {
      data: [{
        file: file,
        fileMetadata: {}
      }],
      metadata: {},
      contacts: []
    },
    qualification: {},
    currentDefinition: {
      featureDate: '',
      label: "themeLabeTest-".concat(file.type)
    },
    appFolderID: '',
    client: {
      collection: jest.fn(function () {
        return {
          addReferencedBy: jest.fn()
        };
      })
    },
    i18n: {
      t: jest.fn(),
      f: jest.fn(),
      scannerT: jest.fn()
    }
  };
};

describe('createAndSavePdf', function () {
  jest.spyOn(addFileToPdf, 'addFileToPdf').mockReturnValue('');
  jest.spyOn(buildFilename, 'buildFilename').mockReturnValue('');
  it('should return array with fileId & theme label', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var expectedPDF, expectedJPG, filePDF, fileJPG, resultPDF, resultJPG;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            expectedPDF = [{
              fileId: '1234',
              themeLabel: 'themeLabeTest-application/pdf'
            }];
            expectedJPG = [{
              fileId: '1234',
              themeLabel: 'themeLabeTest-image/jpg'
            }];
            filePDF = new File(['bob'], 'bob.pdf', {
              type: 'application/pdf'
            });
            fileJPG = new File(['bob'], 'bob.jpg', {
              type: 'image/jpg'
            });
            _context.next = 6;
            return (0, _createPdfAndSave.createPdfAndSave)(mockParams(filePDF));

          case 6:
            resultPDF = _context.sent;
            _context.next = 9;
            return (0, _createPdfAndSave.createPdfAndSave)(mockParams(fileJPG));

          case 9:
            resultJPG = _context.sent;
            expect(resultPDF).toEqual(expectedPDF);
            expect(resultJPG).toEqual(expectedJPG);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});