"use strict";

var _buildPapersDefinitions = require("./buildPapersDefinitions");

describe('buildPapersDefinitions', function () {
  var scannerT = jest.fn(function (key) {
    switch (key) {
      case 'items.one':
        return 'a';

      case 'items.two':
        return 'b';

      case 'items.other_three':
        return 'c';

      case 'items.four':
        return 'd';
    }
  });
  var mockPapersDef = [{
    label: 'two',
    acquisitionSteps: [],
    connectorCriteria: {
      name: 'myConnector'
    }
  }, {
    label: 'other_three',
    acquisitionSteps: [{
      stepIndex: 1
    }],
    connectorCriteria: {
      name: 'myConnector'
    }
  }, {
    label: 'four',
    acquisitionSteps: []
  }, {
    label: 'one',
    acquisitionSteps: [{
      stepIndex: 1
    }],
    connectorCriteria: {
      name: 'myConnector'
    }
  }];
  var expectedPapersDef = [{
    label: 'one',
    acquisitionSteps: [{
      stepIndex: 1
    }],
    connectorCriteria: {
      name: 'myConnector'
    }
  }, {
    label: 'two',
    acquisitionSteps: [],
    connectorCriteria: {
      name: 'myConnector'
    }
  }, {
    label: 'other_three',
    acquisitionSteps: [{
      stepIndex: 1
    }],
    connectorCriteria: {
      name: 'myConnector'
    }
  }, {
    label: 'four',
    acquisitionSteps: []
  }];
  it('should correctly sort papersDef', function () {
    var res = (0, _buildPapersDefinitions.buildPapersDefinitions)(mockPapersDef, scannerT);
    expect(res).toEqual(expectedPapersDef);
  });
});