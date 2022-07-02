"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _reactRouterDom = require("react-router-dom");

var _history = require("history");

var _cozyClient = require("cozy-client");

var _AppLike = _interopRequireDefault(require("../../test/components/AppLike"));

var _OnboardedGuardedRoute = _interopRequireDefault(require("./OnboardedGuardedRoute"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

jest.mock('cozy-client/dist/hooks/useQuery');
jest.mock('cozy-client/dist/utils', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client/dist/utils')), {}, {
    hasQueryBeenLoaded: jest.fn()
  });
});

var ComponentOnboarded = function ComponentOnboarded() {
  return /*#__PURE__*/_react.default.createElement("div", null, "ONBOARDED");
};

var ComponentOnboarding = function ComponentOnboarding() {
  return /*#__PURE__*/_react.default.createElement("div", null, "ONBOARDING");
};

var setup = function setup(_ref) {
  var result = _ref.result,
      _ref$isLoaded = _ref.isLoaded,
      isLoaded = _ref$isLoaded === void 0 ? true : _ref$isLoaded,
      history = _ref.history;

  _cozyClient.hasQueryBeenLoaded.mockReturnValue(isLoaded);

  _cozyClient.useQuery.mockReturnValue({
    data: result
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, {
    history: history
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_OnboardedGuardedRoute.default, {
    exact: true,
    path: "/paper",
    component: ComponentOnboarded
  }), /*#__PURE__*/_react.default.createElement(_OnboardedGuardedRoute.default, {
    exact: true,
    path: "/paper/onboarding",
    component: ComponentOnboarding
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
    from: "*",
    to: "/paper"
  }))));
};

describe('OnboardedGuardedRoute', function () {
  it('should display Spinner when query is not loaded', function () {
    var _setup = setup({
      result: undefined,
      isLoaded: false
    }),
        getByRole = _setup.getByRole;

    expect(getByRole('progressbar')).toBeDefined();
  });
  it('should display route when onboarded = true', function () {
    var _setup2 = setup({
      result: [{
        onboarded: true
      }]
    }),
        getByText = _setup2.getByText;

    expect(getByText('ONBOARDED')).toBeDefined();
  });
  it('should redirect to /paper/onboarding route when onboarded = false', function () {
    var _setup3 = setup({
      result: [{
        onboarded: false
      }]
    }),
        getByText = _setup3.getByText;

    expect(getByText('ONBOARDING')).toBeDefined();
  });
  it('should redirect to /paper/onboarding route when onboarded is undefined', function () {
    var _setup4 = setup({
      result: undefined
    }),
        getByText = _setup4.getByText;

    expect(getByText('ONBOARDING')).toBeDefined();
  });
  it('should redirect to /paper/onboarding route when onboarded is empty array', function () {
    var _setup5 = setup({
      result: []
    }),
        getByText = _setup5.getByText;

    expect(getByText('ONBOARDING')).toBeDefined();
  });
  it('should display route when onboarded is false', function () {
    var history = (0, _history.createHashHistory)();
    history.push('/paper/onboarding');

    var _setup6 = setup({
      result: [{
        onboarded: false,
        history: history
      }]
    }),
        getByText = _setup6.getByText;

    expect(getByText('ONBOARDING')).toBeDefined();
  });
  it('should redirect to /paper route when onboarded is true', function () {
    var history = (0, _history.createHashHistory)();
    history.push('/paper/onboarding');

    var _setup7 = setup({
      result: [{
        onboarded: true,
        history: history
      }]
    }),
        getByText = _setup7.getByText;

    expect(getByText('ONBOARDED')).toBeDefined();
  });
});