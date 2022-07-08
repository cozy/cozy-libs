"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppRouter = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _Home = _interopRequireDefault(require("./Home/Home"));

var _Onboarding = _interopRequireDefault(require("./Onboarding/Onboarding"));

var _MultiselectView = _interopRequireDefault(require("./Multiselect/MultiselectView"));

var _PapersListWrapper = _interopRequireDefault(require("./Papers/PapersListWrapper"));

var _FileViewerWithQuery = _interopRequireDefault(require("./Viewer/FileViewerWithQuery"));

var _OnboardedGuardedRoute = _interopRequireDefault(require("./OnboardedGuardedRoute"));

var _PlaceholderListModal = _interopRequireDefault(require("./Placeholders/PlaceholderListModal/PlaceholderListModal"));

var _CreatePaperModal = _interopRequireDefault(require("./StepperDialog/CreatePaperModal"));

var _StepperDialogProvider = require("./Contexts/StepperDialogProvider");

var routes = [{
  path: '/paper',
  component: _Home.default
}, {
  path: '/paper/files/:fileTheme',
  component: _PapersListWrapper.default
}, {
  path: '/paper/file/:fileTheme/:fileId',
  component: _FileViewerWithQuery.default
}, {
  path: '/paper/onboarding',
  component: _Onboarding.default
}];

var Routes = function Routes() {
  var location = (0, _reactRouterDom.useLocation)();
  var backgroundPath = new URLSearchParams(location.search).get('backgroundPath');
  var background = backgroundPath ? {
    pathname: backgroundPath
  } : null;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, {
    location: background || location
  }, routes.map(function (route, idx) {
    return /*#__PURE__*/_react.default.createElement(_OnboardedGuardedRoute.default, {
      key: idx,
      exact: true,
      path: route.path,
      component: route.component
    });
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
    from: "*",
    to: "/paper"
  })), background && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    exact: true,
    path: "/paper/multiselect",
    component: _MultiselectView.default
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    exact: true,
    path: "/paper/create",
    component: _PlaceholderListModal.default
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    exact: true,
    path: "/paper/create/:qualificationLabel",
    render: function render(props) {
      var search = props.location.search,
          history = props.history;
      var isDeepBack = search.includes('deepBack');

      var onClose = function onClose() {
        return history.go(isDeepBack ? -2 : -1);
      };

      return /*#__PURE__*/_react.default.createElement(_StepperDialogProvider.StepperDialogProvider, null, /*#__PURE__*/_react.default.createElement(_CreatePaperModal.default, (0, _extends2.default)({}, props, {
        onClose: onClose
      })));
    }
  })));
};

var AppRouter = function AppRouter() {
  return /*#__PURE__*/_react.default.createElement(_reactRouterDom.HashRouter, null, /*#__PURE__*/_react.default.createElement(Routes, null));
};

exports.AppRouter = AppRouter;