"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fetchCurrentUser = require("./fetchCurrentUser");

describe('fetchCurrentUser', function () {
  it('should return current user', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var client, currentUser;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = {
              collection: jest.fn(function () {
                return {
                  findMyself: jest.fn(function () {
                    return {
                      data: [{
                        fullname: 'Bob',
                        me: true
                      }]
                    };
                  })
                };
              })
            };
            _context.next = 3;
            return (0, _fetchCurrentUser.fetchCurrentUser)(client);

          case 3:
            currentUser = _context.sent;
            expect(currentUser.fullname).toBeTruthy();
            expect(currentUser).toHaveProperty('me', true);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});