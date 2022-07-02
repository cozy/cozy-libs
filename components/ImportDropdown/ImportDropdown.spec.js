'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _cozyClient = require("cozy-client");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _ImportDropdown = _interopRequireDefault(require("./ImportDropdown"));

var getBoundT = _cozyClient.models.document.locales.getBoundT;
jest.mock('cozy-client/dist/models/document/locales', function () {
  return {
    getBoundT: jest.fn(function () {
      return jest.fn();
    })
  };
});

var setup = function setup() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'national_id_card';
  var placeholder = {
    label: label,
    icon: 'people',
    acquisitionSteps: []
  };
  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_ImportDropdown.default, {
    placeholder: placeholder
  })));
};

describe('ImportDropdown components:', function () {
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('should display correct menu for ID card', function () {
    getBoundT.mockReturnValueOnce(function () {
      return 'ID card';
    });

    var _setup2 = setup('national_id_card'),
        getByText = _setup2.getByText;

    expect(getByText('Add: ID card'));
    expect(getByText('Auto import'));
  });
  it('should display correct menu for Passeport', function () {
    getBoundT.mockReturnValueOnce(function () {
      return 'Passport';
    });

    var _setup3 = setup('passport'),
        getByText = _setup3.getByText;

    expect(getByText('Add: Passport'));
    expect(getByText('Auto import'));
  });
});