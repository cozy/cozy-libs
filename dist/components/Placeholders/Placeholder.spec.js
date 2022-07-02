'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _Placeholder = _interopRequireDefault(require("./Placeholder"));

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

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? fakePlaceholders[0] : _ref$placeholder,
      _ref$divider = _ref.divider,
      divider = _ref$divider === void 0 ? false : _ref$divider,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? jest.fn() : _ref$onClick;

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_Placeholder.default, {
    placeholder: placeholder,
    divider: divider,
    onClick: onClick
  })));
};

describe('Placeholder components:', function () {
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('should display label of placeholder', function () {
    var _setup2 = setup({
      placeholder: fakePlaceholders[0]
    }),
        getByText = _setup2.getByText;

    expect(getByText('Tax notice'));
  });
  it('should display an divider', function () {
    var _setup3 = setup({
      divider: true
    }),
        getByRole = _setup3.getByRole;

    expect(getByRole('separator'));
  });
  it('should not display an divider', function () {
    var _setup4 = setup({
      divider: false
    }),
        queryByRole = _setup4.queryByRole;

    expect(queryByRole('separator')).toBeNull();
  });
  it('should call onClick when placeholder line is clicked', function () {
    var mockOnClick = jest.fn();

    var _setup5 = setup({
      onClick: mockOnClick
    }),
        getByTestId = _setup5.getByTestId;

    var placeholderLine = getByTestId('Placeholder-ListItem');

    _react2.fireEvent.click(placeholderLine);

    expect(mockOnClick).toBeCalledTimes(1);
  });
});