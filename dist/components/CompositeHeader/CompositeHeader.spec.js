"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _CompositeHeader = _interopRequireDefault(require("./CompositeHeader"));

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var mockStringTitle = 'String Title';
var mockStringText = 'String Text';

var MockComponentTitle = function MockComponentTitle() {
  return /*#__PURE__*/_react.default.createElement("div", null, "Component Title");
};

var MockComponentText = function MockComponentText(_ref) {
  var n = _ref.n;
  return /*#__PURE__*/_react.default.createElement("div", null, "Component Text ", n);
};

var setup = function setup() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      text = _ref2.text,
      title = _ref2.title;

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_CompositeHeader.default, {
    icon: "IlluIBAN.png",
    fallbackIcon: "fallback.svg",
    iconSize: "medium",
    title: title,
    text: text
  })));
};

describe('CompositeHeader', function () {
  it('should return string title', function () {
    var _setup = setup({
      title: mockStringTitle
    }),
        getByText = _setup.getByText;

    expect(getByText('String Title'));
  });
  it('should return string text', function () {
    var _setup2 = setup({
      text: mockStringText
    }),
        getByText = _setup2.getByText;

    expect(getByText('String Text'));
  });
  it('should return Component title', function () {
    var _setup3 = setup({
      title: /*#__PURE__*/_react.default.createElement(MockComponentTitle, null)
    }),
        getByText = _setup3.getByText;

    expect(getByText('Component Title'));
  });
  it('should return Component text', function () {
    var _setup4 = setup({
      text: /*#__PURE__*/_react.default.createElement(MockComponentText, null)
    }),
        getByText = _setup4.getByText;

    expect(getByText('Component Text'));
  });
  it('should return Component text', function () {
    var _setup5 = setup({
      text: [/*#__PURE__*/_react.default.createElement(MockComponentText, {
        key: 0,
        n: 0
      }), /*#__PURE__*/_react.default.createElement(MockComponentText, {
        key: 1,
        n: 1
      })]
    }),
        getByText = _setup5.getByText;

    expect(getByText('Component Text 0'));
    expect(getByText('Component Text 1'));
  });
});