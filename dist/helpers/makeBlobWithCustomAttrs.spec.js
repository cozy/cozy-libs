"use strict";

var _makeBlobWithCustomAttrs = require("./makeBlobWithCustomAttrs");

describe('makeBlobWithCustomAttrs', function () {
  var blob = new Blob(['{data: "value"}'], {
    type: 'application/json'
  });
  it('should return Blob', function () {
    var res = (0, _makeBlobWithCustomAttrs.makeBlobWithCustomAttrs)(blob, {});
    expect(res.constructor).toEqual(Blob);
  });
  it('should set the properties provided', function () {
    var res = (0, _makeBlobWithCustomAttrs.makeBlobWithCustomAttrs)(blob, {
      id: '01',
      name: 'my blob'
    });
    expect(res).toHaveProperty('id', '01');
    expect(res).toHaveProperty('name', 'my blob');
  });
  it('should return Blob with original type', function () {
    var res = (0, _makeBlobWithCustomAttrs.makeBlobWithCustomAttrs)(blob, {});
    expect(res.type).toEqual('application/json');
  });
});