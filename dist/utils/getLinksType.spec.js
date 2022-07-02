"use strict";

var _getLinksType = require("./getLinksType");

describe('getLinksType', function () {
  it('should return "small" string', function () {
    var res = (0, _getLinksType.getLinksType)({
      _id: 0,
      class: 'image'
    });
    expect(res).toBe('small');
  });
  it('should return "icon" string', function () {
    var res = (0, _getLinksType.getLinksType)({
      _id: 1,
      class: 'pdf'
    });
    expect(res).toBe('icon');
  });
  it('should return undefined', function () {
    var res = (0, _getLinksType.getLinksType)({
      _id: 2,
      class: 'text'
    });
    expect(res).toBeUndefined();
  });
});