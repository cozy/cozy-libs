"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fetchContentFileToJson = require("./fetchContentFileToJson");

describe('fetchContentFileToJson', function () {
  var mockClient = function mockClient(expected) {
    var client = {
      collection: jest.fn(function () {
        return {
          fetchFileContentById: jest.fn(function () {
            return {
              json: jest.fn().mockReturnValue(expected)
            };
          })
        };
      })
    };
    return client;
  };

  var mockData = {
    _id: '001',
    name: 'file01'
  };
  var expected = "{ \"key01\": \"value01\" }";
  it('should return JSON data', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var client, res;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = mockClient(expected);
            _context.next = 3;
            return (0, _fetchContentFileToJson.fetchContentFileToJson)(client, mockData);

          case 3:
            res = _context.sent;
            expect(res).toEqual(expected);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should return null', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var client, res;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            client = mockClient(expected);
            _context2.next = 3;
            return (0, _fetchContentFileToJson.fetchContentFileToJson)(client, null);

          case 3:
            res = _context2.sent;
            expect(res).toEqual(null);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});