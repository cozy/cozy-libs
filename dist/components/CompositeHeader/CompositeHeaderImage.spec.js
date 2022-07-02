"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

require("@testing-library/jest-dom");

var _CompositeHeaderImage = _interopRequireDefault(require("./CompositeHeaderImage"));

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      icon = _ref.icon,
      fallbackIcon = _ref.fallbackIcon;

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_CompositeHeaderImage.default, {
    icon: icon,
    fallbackIcon: fallbackIcon,
    iconSize: "medium",
    title: "Title",
    text: "Text"
  }));
};

describe('CompositeHeaderImage', function () {
  it('should return nothing if icon & fallbackIcon props is undefined', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeEmptyDOMElement();
  });
  it('should use fallbackIcon if icon is undefined', function () {
    var _setup2 = setup({
      fallbackIcon: 'fallback.svg'
    }),
        getByTestId = _setup2.getByTestId;

    expect(getByTestId('fallback.svg'));
  });
  it('should use fallback icon for not supported png', function () {
    var _setup3 = setup({
      icon: 'notSupported.png',
      fallbackIcon: 'fallback.svg'
    }),
        getByTestId = _setup3.getByTestId;

    expect(getByTestId('fallback.svg'));
  });
  it('should use png if supported', function () {
    var _setup4 = setup({
      icon: 'IlluIBAN.png'
    }),
        getByTestId = _setup4.getByTestId;

    expect(getByTestId('test-file-stub'));
  });
});