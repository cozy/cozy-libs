"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("@testing-library/react");

var _react2 = _interopRequireDefault(require("react"));

var _useSessionstorage3 = require("./useSessionstorage");

describe('useSessionstorage defined', function () {
  it('should be defined', function () {
    expect(_useSessionstorage3.useSessionstorage).toBeDefined();
  });
});
describe('useSessionstorage basic', function () {
  var App;
  beforeEach(function () {
    // eslint-disable-next-line react/display-name
    App = function App() {
      var _useSessionstorage = (0, _useSessionstorage3.useSessionstorage)('test-key', 'test value'),
          _useSessionstorage2 = (0, _slicedToArray2.default)(_useSessionstorage, 2),
          value = _useSessionstorage2[0],
          set = _useSessionstorage2[1];

      return /*#__PURE__*/_react2.default.createElement("div", {
        "data-testid": "container"
      }, /*#__PURE__*/_react2.default.createElement("p", {
        "data-testid": "value"
      }, value), /*#__PURE__*/_react2.default.createElement("button", {
        "data-testid": "new-value",
        onClick: function onClick() {
          set('new test value');
        }
      }, "Set to new value"));
    };
  });
  afterEach(_react.cleanup);
  it('initializes correctly', function () {
    var _render = (0, _react.render)( /*#__PURE__*/_react2.default.createElement(App, null)),
        container = _render.container;

    var valueElement = (0, _react.getByTestId)(container, 'value');
    expect(valueElement.innerHTML).toBe('test value');
  });
  it('setting the new value', function () {
    var _render2 = (0, _react.render)( /*#__PURE__*/_react2.default.createElement(App, null)),
        container = _render2.container;

    var setToNewValueButton = (0, _react.getByTestId)(container, 'new-value');
    (0, _react.act)(function () {
      return _react.fireEvent.click(setToNewValueButton);
    });
    var valueElement = (0, _react.getByTestId)(container, 'value');
    expect(valueElement.innerHTML).toBe('new test value');
  });
});