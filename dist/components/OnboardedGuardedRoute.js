"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _cozyClient = require("cozy-client");

var _Spinner = _interopRequireDefault(require("cozy-ui/transpiled/react/Spinner"));

var _queries = require("../helpers/queries");

var _excluded = ["component", "render"],
    _excluded2 = ["data"];

var OnboardedGuardedRoute = function OnboardedGuardedRoute(_ref) {
  var _settingsData$;

  var Component = _ref.component,
      _render = _ref.render,
      rest = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _useQuery = (0, _cozyClient.useQuery)(_queries.getOnboardingStatus.definition, _queries.getOnboardingStatus.options),
      settingsData = _useQuery.data,
      settingsQuery = (0, _objectWithoutProperties2.default)(_useQuery, _excluded2);

  var onboarded = settingsData === null || settingsData === void 0 ? void 0 : (_settingsData$ = settingsData[0]) === null || _settingsData$ === void 0 ? void 0 : _settingsData$.onboarded;
  return !(0, _cozyClient.hasQueryBeenLoaded)(settingsQuery) ? /*#__PURE__*/_react.default.createElement(_Spinner.default, {
    size: "xxlarge",
    className: "u-flex u-flex-justify-center u-mt-2 u-h-5"
  }) : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, (0, _extends2.default)({}, rest, {
    render: function render(props) {
      var isOnboardingPage = (rest === null || rest === void 0 ? void 0 : rest.path) === '/paper/onboarding';

      if (isOnboardingPage && onboarded === true) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: "/paper"
        });
      } else if (!isOnboardingPage && onboarded !== true) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: "/paper/onboarding"
        });
      } else if (Component) {
        return /*#__PURE__*/_react.default.createElement(Component, props);
      } else {
        return _render(props);
      }
    }
  }));
};

var _default = OnboardedGuardedRoute;
exports.default = _default;