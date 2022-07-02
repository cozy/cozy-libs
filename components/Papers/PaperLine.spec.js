'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _cozyClient = require("cozy-client");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _PaperLine = _interopRequireDefault(require("./PaperLine"));

var getBoundT = _cozyClient.models.document.locales.getBoundT;
var mockPapers = [{
  id: '00',
  name: 'ID card'
}, {
  id: '01',
  name: 'Passport'
}];
jest.mock('cozy-client/dist/models/document/locales', function () {
  return {
    getBoundT: jest.fn(function () {
      return jest.fn();
    })
  };
});

var setup = function setup() {
  var paper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mockPapers[0];
  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_PaperLine.default, {
    paper: paper,
    divider: true
  })));
};

describe('PaperLine components:', function () {
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('should display "ID card"', function () {
    getBoundT.mockReturnValueOnce(function () {
      return 'ID card';
    });

    var _setup2 = setup(mockPapers[0]),
        getByText = _setup2.getByText;

    expect(getByText('ID card'));
  });
  it('should display "Passport"', function () {
    getBoundT.mockReturnValueOnce(function () {
      return 'Passport';
    });

    var _setup3 = setup(mockPapers[1]),
        getByText = _setup3.getByText;

    expect(getByText('Passport'));
  });
});