"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cozyClient = require("cozy-client");

var _handleConflictFilename = require("./handleConflictFilename");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var getFullpath = _cozyClient.models.file.getFullpath;
jest.mock('cozy-client', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client')), {}, {
    models: {
      file: _objectSpread(_objectSpread({}, jest.requireActual('cozy-client/dist/models/file')), {}, {
        getFullpath: jest.fn()
      })
    }
  });
});

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      fullpath = _ref.fullpath,
      filename = _ref.filename;

  var currentFilename = fullpath.split('/').pop();
  var statByPathReturn = currentFilename !== filename ? jest.fn().mockRejectedValue({
    message: 'Not Found'
  }) : jest.fn().mockResolvedValueOnce({
    data: [{
      name: filename
    }]
  }).mockRejectedValue({
    message: 'Not Found'
  });
  var client = {
    collection: jest.fn(function () {
      return {
        statByPath: statByPathReturn
      };
    })
  };
  getFullpath.mockReturnValue(fullpath);
  return client;
};

describe('handleConflictFilename', function () {
  it('should return the name passed as argument', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var filename, client, res;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filename = 'fileA.zip';
            client = setup({
              fullpath: '/path/to/fileB.zip',
              filename: filename
            });
            _context.next = 4;
            return (0, _handleConflictFilename.handleConflictFilename)(client, 'folderId', filename);

          case 4:
            res = _context.sent;
            expect(res).toBe('fileA.zip');

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should return the suffixed name passed as argument', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var filename, client, res;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filename = 'fileB.zip';
            client = setup({
              fullpath: '/path/to/fileB.zip',
              filename: filename
            });
            _context2.next = 4;
            return (0, _handleConflictFilename.handleConflictFilename)(client, 'folderId', filename);

          case 4:
            res = _context2.sent;
            expect(res).toBe('fileB_1.zip');

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});