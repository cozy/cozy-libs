"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _FeaturedPlaceholdersList = _interopRequireDefault(require("./FeaturedPlaceholdersList"));

var fakePlaceholders = [{
  label: 'tax_notice',
  placeholderIndex: 6,
  icon: 'bank',
  featureDate: 'referencedDate',
  maxDisplay: 3,
  acquisitionSteps: [],
  connectorCriteria: {
    name: 'impots'
  }
}, {
  label: 'driver_license',
  placeholderIndex: 2,
  icon: 'car',
  featureDate: 'carObtentionDate',
  maxDisplay: 2,
  acquisitionSteps: [{
    stepIndex: 1,
    model: 'scan',
    page: 'front',
    illustration: 'IlluDriverLicenseFront.png',
    text: 'PaperJSON.generic.front.text'
  }]
}];
/* eslint-disable react/display-name */

jest.mock('./Placeholder', function () {
  return function (_ref) {
    var _onClick = _ref.onClick;
    var fakePlaceholder = {
      label: 'tax_notice',
      placeholderIndex: 6,
      icon: 'bank',
      featureDate: 'referencedDate',
      maxDisplay: 3,
      acquisitionSteps: [],
      connectorCriteria: {
        name: 'impots'
      }
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Placeholder",
      onClick: function onClick() {
        return _onClick(fakePlaceholder);
      }
    });
  };
});
/* eslint-enable react/display-name */

var setup = function setup() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? [] : _ref2$data;

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_FeaturedPlaceholdersList.default, {
    featuredPlaceholders: data
  })));
};

describe('FeaturedPlaceholdersList components:', function () {
  it('should not display Suggestions header', function () {
    var _setup = setup({
      data: []
    }),
        queryByText = _setup.queryByText;

    expect(queryByText('Suggestions')).toBeNull();
  });
  it('should display Suggestions', function () {
    var _setup2 = setup({
      data: fakePlaceholders
    }),
        getByText = _setup2.getByText;

    expect(getByText('Suggestions'));
  });
  it('should display ActionMenu modale when placeholder line is clicked', function () {
    var _setup3 = setup({
      data: [fakePlaceholders[0]]
    }),
        getByTestId = _setup3.getByTestId,
        getByText = _setup3.getByText;

    var placeholderComp = getByTestId('Placeholder');

    _react2.fireEvent.click(placeholderComp);

    expect(getByText('Add: Tax notice'));
  });
  it('should not display ActionMenu modale by default', function () {
    var _setup4 = setup({
      data: [fakePlaceholders[0]]
    }),
        getByTestId = _setup4.getByTestId,
        getByText = _setup4.getByText;

    var placeholderComp = getByTestId('Placeholder');

    _react2.fireEvent.click(placeholderComp);

    expect(getByText('Add: Tax notice'));
  });
});