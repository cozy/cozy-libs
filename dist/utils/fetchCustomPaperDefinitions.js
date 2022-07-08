"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCustomPaperDefinitions = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cozyClient = require("cozy-client");

var _doctypes = require("../doctypes");

var _getFolderWithReference = _interopRequireDefault(require("../helpers/getFolderWithReference"));

var paperConfigFilenameCustom = 'papersDefinitions.json';
/**
 * Fetch custom PaperDefinitions file in "My papers" folder (Drive)
 * @param {CozyClient} client - Instance of CozyClient
 * @param {Function} t - i18n function
 * @returns {Promise<{ paperConfigFilenameCustom: string, appFolderPath: string, data: object|null }>}
 */

var fetchCustomPaperDefinitions = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(client, t) {
    var _yield$getOrCreateApp, appFolderId, path, queryDef, _yield$client$query, data;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _getFolderWithReference.default)(client, t);

          case 3:
            _yield$getOrCreateApp = _context.sent;
            appFolderId = _yield$getOrCreateApp._id;
            path = _yield$getOrCreateApp.path;
            queryDef = (0, _cozyClient.Q)(_doctypes.FILES_DOCTYPE).where({
              dir_id: appFolderId,
              name: paperConfigFilenameCustom
            }).partialIndex({
              trashed: false
            }).indexFields(['name', 'dir_id']);
            _context.next = 9;
            return client.query(queryDef, {
              as: "fetchJsonFileByName",
              fetchPolicy: _cozyClient.fetchPolicies.noFetch()
            });

          case 9:
            _yield$client$query = _context.sent;
            data = _yield$client$query.data;
            return _context.abrupt("return", {
              paperConfigFilenameCustom: paperConfigFilenameCustom,
              appFolderPath: path,
              file: data[0] ? data[0] : null
            });

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", {
              paperConfigFilenameCustom: paperConfigFilenameCustom,
              appFolderPath: '',
              file: null
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));

  return function fetchCustomPaperDefinitions(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchCustomPaperDefinitions = fetchCustomPaperDefinitions;