"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClient = void 0;

var _cozyClient = _interopRequireDefault(require("cozy-client"));

var _manifest = _interopRequireDefault(require("../../manifest.webapp"));

var _doctypes = _interopRequireDefault(require("../doctypes"));

/**
 * Returns cozy client instance
 * @returns {object} cozy client instance
 */
var getClient = function getClient() {
  var root = document.querySelector('[role=application]');
  var data = JSON.parse(root.dataset.cozy);
  var protocol = window.location.protocol;
  var cozyUrl = "".concat(protocol, "//").concat(data.domain);
  return new _cozyClient.default({
    uri: cozyUrl,
    token: data.token,
    appMetadata: {
      slug: _manifest.default.name,
      version: _manifest.default.version
    },
    schema: _doctypes.default,
    store: false
  });
};

exports.getClient = getClient;