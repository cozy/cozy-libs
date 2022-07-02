"use strict";

var _findPlaceholders = require("./findPlaceholders");

var _mockPaperDefinitions = require("../../test/mockPaperDefinitions");

var fakeIspInvoiceFile = [{
  metadata: {
    qualification: {
      label: 'isp_invoice'
    }
  }
}];
var fakeQualificationItems = [{
  label: 'isp_invoice'
}];
describe('getPlaceholders', function () {
  describe('getFeaturedPlaceholders', function () {
    it('should return list of placeholders', function () {
      var featuredPlaceholders = (0, _findPlaceholders.getFeaturedPlaceholders)({
        papersDefinitions: _mockPaperDefinitions.mockPapersDefinitions
      });
      expect(featuredPlaceholders).toEqual(expect.arrayContaining([expect.objectContaining({
        label: 'isp_invoice'
      })]), expect.arrayContaining([expect.objectContaining({
        label: 'tax_notice'
      })]), expect.arrayContaining([expect.not.objectContaining({
        label: 'health_certificate'
      })]));
      expect(featuredPlaceholders.length).toBe(2);
    });
    it('should return correct list of placeholders with file constraint', function () {
      var featuredPlaceholders = (0, _findPlaceholders.getFeaturedPlaceholders)({
        papersDefinitions: _mockPaperDefinitions.mockPapersDefinitions,
        files: fakeIspInvoiceFile
      });
      expect(featuredPlaceholders).toEqual(expect.arrayContaining([expect.not.objectContaining({
        label: 'isp_invoice'
      })]));
      expect(featuredPlaceholders).toEqual(expect.arrayContaining([expect.objectContaining({
        label: 'tax_notice'
      })]));
    });
    describe('with theme selected', function () {
      it('should return list of placeholders', function () {
        var featuredPlaceholders = (0, _findPlaceholders.getFeaturedPlaceholders)({
          papersDefinitions: _mockPaperDefinitions.mockPapersDefinitions,
          selectedTheme: {
            items: [{
              label: 'isp_invoice'
            }, {
              label: 'tax_notice'
            }]
          }
        });
        expect(featuredPlaceholders).toEqual(expect.arrayContaining([expect.objectContaining({
          label: 'isp_invoice'
        })]), expect.arrayContaining([expect.objectContaining({
          label: 'tax_notice'
        })]), expect.arrayContaining([expect.not.objectContaining({
          label: 'health_certificate'
        })]));
        expect(featuredPlaceholders.length).toBe(2);
      });
      it('should return correct list of placeholders with file constraint', function () {
        var featuredPlaceholders = (0, _findPlaceholders.getFeaturedPlaceholders)({
          papersDefinitions: _mockPaperDefinitions.mockPapersDefinitions,
          files: fakeIspInvoiceFile,
          selectedTheme: {
            items: [{
              label: 'isp_invoice'
            }, {
              label: 'tax_notice'
            }]
          }
        });
        expect(featuredPlaceholders).toEqual(expect.arrayContaining([expect.not.objectContaining({
          label: 'isp_invoice'
        })]), expect.arrayContaining([expect.objectContaining({
          label: 'tax_notice'
        })]), expect.arrayContaining([expect.not.objectContaining({
          label: 'health_certificate'
        })]));
        expect(featuredPlaceholders.length).toBe(1);
      });
      it('should not return unsupported paper', function () {
        var featuredPlaceholders = (0, _findPlaceholders.getFeaturedPlaceholders)({
          papersDefinitions: _mockPaperDefinitions.mockPapersDefinitions,
          files: fakeIspInvoiceFile,
          selectedTheme: {
            items: [{
              label: 'health_certificate'
            }]
          }
        });
        expect(featuredPlaceholders).toEqual(expect.not.arrayContaining([expect.objectContaining({
          label: 'health_certificate'
        })]));
        expect(featuredPlaceholders.length).toBe(0);
      });
    });
  });
  describe('findPlaceholdersByQualification', function () {
    it('should return an empty list', function () {
      var placeholders = (0, _findPlaceholders.findPlaceholdersByQualification)(_mockPaperDefinitions.mockPapersDefinitions);
      expect(placeholders).toHaveLength(0);
    });
    it('should return correct list of placeholders with param', function () {
      var placeholders = (0, _findPlaceholders.findPlaceholdersByQualification)(_mockPaperDefinitions.mockPapersDefinitions, fakeQualificationItems);
      expect(placeholders).toEqual(expect.arrayContaining([expect.objectContaining({
        label: 'isp_invoice'
      })]));
    });
  });
});
describe('hasNoFileWithSameQualificationLabel', function () {
  it('should handle empty files', function () {
    var res = (0, _findPlaceholders.hasNoFileWithSameQualificationLabel)(null, _mockPaperDefinitions.mockPapersDefinitions);
    expect(res).toBe(null);
  });
});