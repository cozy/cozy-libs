"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStoreWebLinkByKonnector = void 0;

var _cozyClient = require("cozy-client");

var _cozyLogger = _interopRequireDefault(require("cozy-logger"));

/**
 * @param {object} param
 * @param {CozyClient} param.client - Instance of CozyClient
 * @param {string} [param.konnectorName] - Name of Connector
 * @param {string} [param.konnectorCategory] - Category of Connector
 * @returns {string} - Link of Store where the Connector is
 */
var getStoreWebLinkByKonnector = function getStoreWebLinkByKonnector(_ref) {
  var client = _ref.client,
      konnectorName = _ref.konnectorName,
      konnectorCategory = _ref.konnectorCategory;

  if (!konnectorName && !konnectorCategory) {
    (0, _cozyLogger.default)('error', 'konnectorName or konnectorCategory must be defined');
    return null;
  }

  var hash = konnectorName ? "discover/".concat(konnectorName) : "discover?type=konnector&category=".concat(konnectorCategory);
  var webLink = (0, _cozyClient.generateWebLink)({
    slug: 'store',
    cozyUrl: client.getStackClient().uri,
    subDomainType: client.getInstanceOptions().subdomain,
    pathname: '/',
    hash: hash
  });
  return webLink;
};

exports.getStoreWebLinkByKonnector = getStoreWebLinkByKonnector;