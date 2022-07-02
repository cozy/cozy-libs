"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilteredStoreUrl = void 0;

var _AppLinker = require("cozy-ui/transpiled/react/AppLinker");

var _doctypes = require("../doctypes");

var getFilteredStoreUrl = function getFilteredStoreUrl(client) {
  return (0, _AppLinker.generateUniversalLink)({
    cozyUrl: client.getStackClient().uri,
    slug: 'store',
    subDomainType: client.getInstanceOptions().subdomain,
    nativePath: "discover/?type=konnector&doctype=".concat(_doctypes.FILES_DOCTYPE)
  });
};

exports.getFilteredStoreUrl = getFilteredStoreUrl;