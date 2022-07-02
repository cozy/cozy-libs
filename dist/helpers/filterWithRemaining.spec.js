"use strict";

var _filterWithRemaining = require("./filterWithRemaining");

var mockObjectInArray = [{
  stepIndex: 1,
  model: 'scan'
}, {
  stepIndex: 2,
  model: 'information'
}, {
  stepIndex: 3,
  model: 'owner'
}, {
  stepIndex: 4
}];
describe('filterWithRemaining', function () {
  it('should be return correct value with "owner" filter', function () {
    var testFunction = function testFunction(item) {
      return item === 'owner';
    };

    var res = (0, _filterWithRemaining.filterWithRemaining)(mockObjectInArray, testFunction);
    expect(res).toStrictEqual({
      itemsFound: [{
        stepIndex: 3,
        model: 'owner'
      }],
      remainingItems: [{
        stepIndex: 1,
        model: 'scan'
      }, {
        stepIndex: 2,
        model: 'information'
      }, {
        stepIndex: 4
      }]
    });
  });
  it('should be return correct value with "owner" & "scan" filter', function () {
    var testFunction = function testFunction(item) {
      return item === 'owner' || item === 'scan';
    };

    var res = (0, _filterWithRemaining.filterWithRemaining)(mockObjectInArray, testFunction);
    expect(res).toStrictEqual({
      itemsFound: [{
        stepIndex: 1,
        model: 'scan'
      }, {
        stepIndex: 3,
        model: 'owner'
      }],
      remainingItems: [{
        stepIndex: 2,
        model: 'information'
      }, {
        stepIndex: 4
      }]
    });
  });
  it('should be return correct value with filter by index', function () {
    var testFunction = function testFunction(_, index) {
      return index === 1;
    };

    var res = (0, _filterWithRemaining.filterWithRemaining)(mockObjectInArray, testFunction);
    expect(res).toStrictEqual({
      itemsFound: [{
        stepIndex: 2,
        model: 'information'
      }],
      remainingItems: [{
        stepIndex: 1,
        model: 'scan'
      }, {
        stepIndex: 3,
        model: 'owner'
      }, {
        stepIndex: 4
      }]
    });
  });
});