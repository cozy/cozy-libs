"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileToArrayBuffer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
var fileToArrayBuffer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(file) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!('arrayBuffer' in file)) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return file.arrayBuffer();

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;

              reader.onload = function (e) {
                return resolve(new Uint8Array(e.target.result));
              };

              reader.readAsArrayBuffer(file);
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fileToArrayBuffer(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.fileToArrayBuffer = fileToArrayBuffer;