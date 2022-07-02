"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _cozyFlags = _interopRequireDefault(require("cozy-flags"));

var _useStepperDialog = require("./Hooks/useStepperDialog");

var _usePapersDefinitions = require("./Hooks/usePapersDefinitions");

var _MesPapiersLib = _interopRequireDefault(require("./MesPapiersLib"));

var _AppLike = _interopRequireDefault(require("../../test/components/AppLike"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/* eslint-disable react/display-name */
jest.mock('cozy-ui/transpiled/react/Alerter', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Alerter"
    });
  };
});
jest.mock('./Contexts/ModalProvider', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('./Contexts/ModalProvider')), {}, {
    ModalStack: function ModalStack() {
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "ModalStack"
      });
    }
  });
});
jest.mock('cozy-client', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client')), {}, {
    RealTimeQueries: function RealTimeQueries() {
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "RealTimeQueries"
      });
    }
  });
});
jest.mock('./AppRouter', function () {
  return {
    AppRouter: function AppRouter() {
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "AppRouter"
      });
    }
  };
});
jest.mock('cozy-flags');
jest.mock('cozy-flags/dist/FlagSwitcher', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "FlagSwitcher"
    });
  };
});
jest.mock('./Hooks/useStepperDialog');
jest.mock('./Hooks/usePapersDefinitions');
/* eslint-enable react/display-name */

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isFlag = _ref.isFlag,
      isFlag = _ref$isFlag === void 0 ? false : _ref$isFlag,
      _ref$papersDefinition = _ref.papersDefinitions,
      papersDefinitions = _ref$papersDefinition === void 0 ? [] : _ref$papersDefinition,
      _ref$customPapersDefi = _ref.customPapersDefinitions,
      customPapersDefinitions = _ref$customPapersDefi === void 0 ? {
    isLoaded: true,
    name: ''
  } : _ref$customPapersDefi,
      _ref$isStepperDialogO = _ref.isStepperDialogOpen,
      isStepperDialogOpen = _ref$isStepperDialogO === void 0 ? false : _ref$isStepperDialogO;

  _cozyFlags.default.mockReturnValue(isFlag);

  _useStepperDialog.useStepperDialog.mockReturnValue({
    isStepperDialogOpen: isStepperDialogOpen
  });

  _usePapersDefinitions.usePapersDefinitions.mockReturnValue({
    papersDefinitions: papersDefinitions,
    customPapersDefinitions: customPapersDefinitions
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_MesPapiersLib.default, null)));
};

describe('MesPapiersLib', function () {
  it('should contain FlagSwitcher when flag "switcher" is activate', function () {
    var _setup = setup({
      isFlag: true
    }),
        queryByTestId = _setup.queryByTestId;

    expect(queryByTestId('FlagSwitcher')).toBeTruthy();
  });
  it('should return AppRouter component', function () {
    var _setup2 = setup({
      papersDefinitions: ['1', '2']
    }),
        queryByTestId = _setup2.queryByTestId;

    expect(queryByTestId('AppRouter')).toBeTruthy();
  });
  it('should contain "custom name" text if custom papersDefinitions file is used', function () {
    var _setup3 = setup({
      customPapersDefinitions: {
        isLoaded: true,
        name: 'custom name'
      }
    }),
        queryByText = _setup3.queryByText;

    expect(queryByText('File "custom name" loaded from your Drive')).toBeTruthy();
  });
  it('should contain progressbar when no papers', function () {
    var _setup4 = setup(),
        getByRole = _setup4.getByRole;

    expect(getByRole('progressbar')).toBeTruthy();
  });
  it('should contain RealTimeQueries(2), Alerter & ModalStack components', function () {
    var _setup5 = setup(),
        queryByTestId = _setup5.queryByTestId,
        queryAllByTestId = _setup5.queryAllByTestId;

    expect(queryAllByTestId('RealTimeQueries')).toHaveLength(2);
    expect(queryByTestId('Alerter')).toBeTruthy();
    expect(queryByTestId('ModalStack')).toBeTruthy();
  });
});