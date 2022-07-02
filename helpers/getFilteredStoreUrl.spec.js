"use strict";

var _cozyClient = require("cozy-client");

var _getFilteredStoreUrl = require("./getFilteredStoreUrl");

describe('getFilteredStoreUrl', function () {
  it('should return correct store url', function () {
    var protocol = 'https';
    var subdomain = 'john';
    var domain = 'mycozy.cloud';
    var client = (0, _cozyClient.createMockClient)({
      clientOptions: {
        uri: "".concat(protocol, "://").concat(subdomain, ".").concat(domain, "/")
      }
    });
    var universalLink = 'https://links.mycozy.cloud/store/discover/?type=konnector&doctype=io.cozy.files';
    var nativePath = '#/discover/?type=konnector&doctype=io.cozy.files';
    var res = decodeURIComponent((0, _getFilteredStoreUrl.getFilteredStoreUrl)(client));
    var expected = "".concat(universalLink, "&fallback=").concat(protocol, "://").concat(subdomain, "-store.").concat(domain, "/").concat(nativePath);
    expect(res).toEqual(expected);
  });
});