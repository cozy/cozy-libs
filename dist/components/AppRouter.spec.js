"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppRouter = require("./AppRouter");

var _AppLike = _interopRequireDefault(require("../../test/components/AppLike"));

/* eslint-disable react/display-name */
jest.mock('./OnboardedGuardedRoute', function () {
  return function (_ref) {
    var component = _ref.component,
        render = _ref.render;
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "OnboardedGuardedRoute"
    }, render ? render({
      location: {
        search: ''
      },
      history: jest.fn(function () {
        return {
          go: jest.fn()
        };
      })
    }) : component());
  };
});
jest.mock('./StepperDialog/CreatePaperModal', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "CreatePaperModal"
    });
  };
});
jest.mock('./Home/Home', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Home"
    });
  };
});
jest.mock('./Onboarding/Onboarding', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Onboarding"
    });
  };
});
jest.mock('./Papers/PapersListWrapper', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "PapersListWrapper"
    });
  };
});
jest.mock('./Viewer/FileViewerWithQuery', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "FileViewerWithQuery"
    });
  };
});
jest.mock('react-router-dom', function () {
  return {
    useLocation: jest.fn(function () {
      return {
        search: ''
      };
    }),
    useHistory: jest.fn(function () {
      return {
        goBack: jest.fn()
      };
    }),
    HashRouter: function HashRouter(_ref2) {
      var children = _ref2.children;
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "HashRouter"
      }, children);
    },
    Redirect: function Redirect(_ref3) {
      var children = _ref3.children;
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "Redirect"
      }, children);
    },
    Switch: function Switch(_ref4) {
      var children = _ref4.children;
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "Switch"
      }, children);
    }
  };
});
/* eslint-enable react/display-name */

describe('AppRouter', function () {
  it('should render home, onboarding, papersListWrapper, fileViewerWithQuery components', function () {
    var _render = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_AppRouter.AppRouter, null))),
        queryByTestId = _render.queryByTestId;

    expect(queryByTestId('Home')).toBeTruthy();
    expect(queryByTestId('Onboarding')).toBeTruthy();
    expect(queryByTestId('PapersListWrapper')).toBeTruthy();
    expect(queryByTestId('FileViewerWithQuery')).toBeTruthy();
  });
});