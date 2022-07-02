"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fetchCustomPaperDefinitions = require("./fetchCustomPaperDefinitions");

var _getFolderWithReference = _interopRequireDefault(require("../helpers/getFolderWithReference"));

jest.mock('../helpers/getFolderWithReference', function () {
  return jest.fn();
});
describe('fetchCustomPaperDefinitions', function () {
  var t = jest.fn();

  var mockClient = function mockClient(mockData) {
    var client = {
      query: jest.fn(function () {
        return {
          data: mockData ? [mockData] : []
        };
      }) // collection: jest.fn(() => ({
      //   fetchFileContentById: jest.fn(() => ({
      //     json: jest.fn().mockReturnValue(`{ "key01": "value01" }`)
      //   }))
      // }))

    };
    return client;
  };

  it('should return object with data if file found', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var mockData, client, res;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _getFolderWithReference.default.mockReturnValue({
              _id: '',
              path: '/Path/To/File'
            });

            mockData = {
              _id: '001',
              name: 'file01'
            };
            client = mockClient(mockData);
            _context.next = 5;
            return (0, _fetchCustomPaperDefinitions.fetchCustomPaperDefinitions)(client, t);

          case 5:
            res = _context.sent;
            expect(res).toEqual({
              paperConfigFilenameCustom: 'papersDefinitions.json',
              appFolderPath: '/Path/To/File',
              file: mockData
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should return empty array if file not found', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var client, res;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _getFolderWithReference.default.mockReturnValue({
              _id: '',
              path: ''
            });

            client = mockClient();
            _context2.next = 4;
            return (0, _fetchCustomPaperDefinitions.fetchCustomPaperDefinitions)(client, t);

          case 4:
            res = _context2.sent;
            expect(res).toEqual({
              paperConfigFilenameCustom: 'papersDefinitions.json',
              appFolderPath: '',
              file: null
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});