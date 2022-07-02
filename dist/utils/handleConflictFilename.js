"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleConflictFilename = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cozyClient = require("cozy-client");

var _doctypes = require("../doctypes");

var _models$file = _cozyClient.models.file,
    getFullpath = _models$file.getFullpath,
    splitFilename = _models$file.splitFilename,
    generateNewFileNameOnConflict = _models$file.generateNewFileNameOnConflict;

var handleConflictFilename = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(client, appFolderID, name) {
    var path, _splitFilename, filename, extension, newFilename;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return getFullpath(client, appFolderID, name);

          case 3:
            path = _context.sent;
            _context.next = 6;
            return client.collection(_doctypes.FILES_DOCTYPE).statByPath(path);

          case 6:
            _splitFilename = splitFilename({
              name: name,
              type: 'file'
            }), filename = _splitFilename.filename, extension = _splitFilename.extension;
            newFilename = generateNewFileNameOnConflict(filename) + extension;
            return _context.abrupt("return", handleConflictFilename(client, appFolderID, newFilename));

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);

            if (!/Not Found/.test(_context.t0.message)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", name);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function handleConflictFilename(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.handleConflictFilename = handleConflictFilename;