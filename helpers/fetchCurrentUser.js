"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCurrentUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _doctypes = require("../doctypes");

var fetchCurrentUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(client) {
    var contactCollection, _yield$contactCollect, currentUser;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contactCollection = client.collection(_doctypes.CONTACTS_DOCTYPE);
            _context.next = 3;
            return contactCollection.findMyself();

          case 3:
            _yield$contactCollect = _context.sent;
            currentUser = _yield$contactCollect.data;
            return _context.abrupt("return", currentUser[0]);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchCurrentUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchCurrentUser = fetchCurrentUser;