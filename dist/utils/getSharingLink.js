"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSharingLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cozyClient = require("cozy-client");

var _doctypes = require("../doctypes");

var getSharingLink = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(client, file, isFlatDomain) {
    var _sharedLink$attribute, _sharedLink$attribute2;

    var PERMS, _yield$client$save, sharedLink, webLink;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            PERMS = {
              _type: _doctypes.PERMISSIONS_DOCTYPE,
              permissions: {
                files: {
                  type: _doctypes.FILES_DOCTYPE,
                  values: [file._id],
                  verbs: ['GET']
                }
              }
            };
            _context.next = 3;
            return client.save(PERMS);

          case 3:
            _yield$client$save = _context.sent;
            sharedLink = _yield$client$save.data;
            webLink = (0, _cozyClient.generateWebLink)({
              cozyUrl: client.getStackClient().uri,
              searchParams: [['sharecode', sharedLink === null || sharedLink === void 0 ? void 0 : (_sharedLink$attribute = sharedLink.attributes) === null || _sharedLink$attribute === void 0 ? void 0 : (_sharedLink$attribute2 = _sharedLink$attribute.shortcodes) === null || _sharedLink$attribute2 === void 0 ? void 0 : _sharedLink$attribute2.code]],
              pathname: '/public',
              slug: 'drive',
              subDomainType: isFlatDomain ? 'flat' : 'nested'
            });
            return _context.abrupt("return", webLink);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getSharingLink(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getSharingLink = getSharingLink;