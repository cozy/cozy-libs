"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _get = _interopRequireDefault(require("lodash/get"));

var _helpers = require("./helpers");

var locales = {
  items: {
    isp_invoice: 'Facture internet',
    driver_license: 'Permis de conduire',
    phone_invoice: 'Facture téléphonique'
  }
};

var scannerT = function scannerT(x) {
  return (0, _get.default)(locales, x);
};

var files = [{
  _id: 'file01',
  name: 'Facture internet',
  metadata: {
    qualification: {
      label: 'isp_invoice'
    }
  }
}, {
  _id: 'file02',
  name: 'Permis de conduire',
  metadata: {
    qualification: {
      label: 'driver_license'
    }
  }
}, {
  _id: 'file03',
  name: 'Facture minitel',
  metadata: {
    qualification: {
      label: 'phone_invoice'
    }
  }
}];
describe('filterPapersByThemeAndSearchValue', function () {
  describe('with only theme selected', function () {
    test('when one qualification label matches', function () {
      var res = (0, _helpers.filterPapersByThemeAndSearchValue)({
        files: files,
        theme: {
          items: [{
            label: 'isp_invoice'
          }]
        },
        search: '',
        scannerT: scannerT
      });
      expect(res).toHaveLength(1);
      expect(res).toContain(files[0]);
    });
    test('when two qualifiation labels matches', function () {
      var res = (0, _helpers.filterPapersByThemeAndSearchValue)({
        files: files,
        theme: {
          items: [{
            label: 'isp_invoice'
          }, {
            label: 'phone_invoice'
          }]
        },
        search: '',
        scannerT: scannerT
      });
      expect(res).toHaveLength(2);
      expect(res).toContain(files[0]);
      expect(res).toContain(files[2]);
    });
  });
  describe('with only search value', function () {
    test('when names matches', function () {
      var res = (0, _helpers.filterPapersByThemeAndSearchValue)({
        files: files,
        theme: '',
        search: 'facture',
        scannerT: scannerT
      });
      expect(res).toHaveLength(2);
      expect(res).toContain(files[0]);
      expect(res).toContain(files[2]);
    });
    test('when qualification labels matches', function () {
      var res = (0, _helpers.filterPapersByThemeAndSearchValue)({
        files: files,
        theme: '',
        search: 'téléphonique',
        scannerT: scannerT
      });
      expect(res).toHaveLength(1);
      expect(res).toContain(files[2]);
    });
  });
  describe('with theme selected and search value', function () {
    it('should return only the correct files', function () {
      var res = (0, _helpers.filterPapersByThemeAndSearchValue)({
        files: files,
        theme: {
          items: [{
            label: 'isp_invoice'
          }]
        },
        search: 'facture',
        scannerT: scannerT
      });
      expect(res).toHaveLength(1);
      expect(res).toContain(files[0]);
    });
  });
});
describe('hasItemByLabel', function () {
  it('should return true', function () {
    var res = (0, _helpers.hasItemByLabel)({
      items: [{
        label: 'isp_invoice'
      }]
    }, 'isp_invoice');
    expect(res).toBe(true);
  });
  it('should return false', function () {
    var res = (0, _helpers.hasItemByLabel)({
      items: [{
        label: 'isp_invoice'
      }]
    }, 'phone_invoice');
    expect(res).toBe(false);
  });
});