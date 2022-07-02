"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cozyClient = require("cozy-client");

var _getFolderWithReference = _interopRequireDefault(require("./getFolderWithReference"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var _models$folder = _cozyClient.models.folder,
    ensureMagicFolder = _models$folder.ensureMagicFolder,
    getReferencedFolder = _models$folder.getReferencedFolder;
jest.mock('cozy-client', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client')), {}, {
    models: {
      folder: {
        ensureMagicFolder: jest.fn(),
        getReferencedFolder: jest.fn()
      }
    }
  });
});

var setup = function setup(referencedFilesRes) {
  ensureMagicFolder.mockReturnValue(referencedFilesRes);
  getReferencedFolder.mockReturnValue(referencedFilesRes);
};

describe('getFolderWithReference', function () {
  it('should get folder with reference', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var referencedFilesRes, res;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            referencedFilesRes = {
              id: 'fileId',
              dir_id: 'dirId',
              path: '/file_path'
            };
            setup(referencedFilesRes);
            _context.next = 4;
            return (0, _getFolderWithReference.default)();

          case 4:
            res = _context.sent;
            expect(res).toEqual({
              id: 'fileId',
              dir_id: 'dirId',
              path: '/file_path'
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});