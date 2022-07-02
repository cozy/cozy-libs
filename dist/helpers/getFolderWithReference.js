"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cozyClient = require("cozy-client");

var _doctypes = require("../doctypes");

var _models$folder = _cozyClient.models.folder,
    MAGIC_FOLDERS = _models$folder.MAGIC_FOLDERS,
    ensureMagicFolder = _models$folder.ensureMagicFolder,
    getReferencedFolder = _models$folder.getReferencedFolder;
var APP_DIR_REF = "".concat(_doctypes.APPS_DOCTYPE, "/mypapers");

var getOrCreateAppFolderWithReference = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(client, t) {
    var existingFolders, _yield$ensureMagicFol, administrativeFolderPath, appFolder;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getReferencedFolder(client, {
              _id: APP_DIR_REF,
              _type: _doctypes.APPS_DOCTYPE
            });

          case 2:
            existingFolders = _context.sent;

            if (!existingFolders) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", existingFolders);

          case 7:
            _context.next = 9;
            return ensureMagicFolder(client, MAGIC_FOLDERS.ADMINISTRATIVE, "/".concat(t('folder.administrative')));

          case 9:
            _yield$ensureMagicFol = _context.sent;
            administrativeFolderPath = _yield$ensureMagicFol.path;
            _context.next = 13;
            return ensureMagicFolder(client, MAGIC_FOLDERS.PAPERS, "".concat(administrativeFolderPath, "/").concat(t('folder.papers')));

          case 13:
            appFolder = _context.sent;
            return _context.abrupt("return", appFolder);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getOrCreateAppFolderWithReference(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = getOrCreateAppFolderWithReference;
exports.default = _default;