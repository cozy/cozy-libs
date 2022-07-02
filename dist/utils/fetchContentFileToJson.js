"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchContentFileToJson = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _doctypes = require("../doctypes");

var fetchContentFileToJson = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(client, file) {
    var fileColl, fileBin, fileJSON;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            fileColl = client.collection(_doctypes.FILES_DOCTYPE);
            _context.next = 4;
            return fileColl.fetchFileContentById(file._id);

          case 4:
            fileBin = _context.sent;
            _context.next = 7;
            return fileBin.json();

          case 7:
            fileJSON = _context.sent;
            return _context.abrupt("return", fileJSON);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", null);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function fetchContentFileToJson(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchContentFileToJson = fetchContentFileToJson;