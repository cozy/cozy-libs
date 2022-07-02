"use strict";

var _getStoreWebLinkByKonnector = require("./getStoreWebLinkByKonnector");

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      konnectorName = _ref.konnectorName,
      konnectorCategory = _ref.konnectorCategory;

  var mockClient = {
    getStackClient: jest.fn(function () {
      return {
        uri: 'http://cozy.localhost:8080'
      };
    }),
    getInstanceOptions: jest.fn(function () {
      return {
        subdomain: 'nested'
      };
    })
  };
  return (0, _getStoreWebLinkByKonnector.getStoreWebLinkByKonnector)({
    client: mockClient,
    konnectorName: konnectorName,
    konnectorCategory: konnectorCategory
  });
};

describe('getStoreWebLinkByKonnector', function () {
  it('should be "null" if no information on the konnector is passed', function () {
    var res = setup();
    expect(res).toBeNull();
  });
  it('should be correct link when konnectorName passed', function () {
    var res = setup({
      konnectorName: 'caf'
    });
    expect(res).toBe('http://store.cozy.localhost:8080/#/discover/caf');
  });
  it('should be correct link when konnectorCategory passed', function () {
    var res = setup({
      konnectorCategory: 'impots'
    });
    expect(res).toBe('http://store.cozy.localhost:8080/#/discover?type=konnector&category=impots');
  });
});