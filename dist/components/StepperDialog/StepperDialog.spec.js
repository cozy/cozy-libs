"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _useBreakpoints = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _StepperDialog = _interopRequireDefault(require("./StepperDialog"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/* eslint-disable react/display-name */
jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', function () {
  return jest.fn(function () {
    return {
      isMobile: false
    };
  });
});
jest.mock('cozy-ui/transpiled/react/Dialog', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-ui/transpiled/react/Dialog')), {}, {
    __esModule: true,
    default: 'MUIDialog'
  });
});
jest.mock('cozy-ui/transpiled/react/CozyDialogs', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-ui/transpiled/react/CozyDialogs')), {}, {
    DialogBackButton: function DialogBackButton(_ref) {
      var onClick = _ref.onClick;
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "DialogBackButton",
        onClick: onClick
      });
    },
    DialogCloseButton: function DialogCloseButton(_ref2) {
      var onClick = _ref2.onClick;
      return /*#__PURE__*/_react.default.createElement("div", {
        "data-testid": "DialogCloseButton",
        onClick: onClick
      });
    }
  });
});
/* eslint-enable react/display-name */

describe('StepperDialog', function () {
  it('should display "stepper" content', function () {
    var _render = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
      stepper: "1/2"
    })),
        getByText = _render.getByText;

    expect(getByText('1/2')).toBeTruthy();
  });
  describe('DialogCloseButton', function () {
    var closeAction = jest.fn();
    it('should render DialogCloseButton in Desktop view & "onClose" prop is defined', function () {
      _useBreakpoints.default.mockReturnValue({
        isMobile: false
      });

      var _render2 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
        onClose: closeAction
      })),
          queryByTestId = _render2.queryByTestId;

      expect(queryByTestId('DialogCloseButton')).toBeTruthy();
    });
    it('should not render DialogCloseButton in Desktop view & "onClose" prop is undefined', function () {
      _useBreakpoints.default.mockReturnValue({
        isMobile: false
      });

      var _render3 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, null)),
          queryByTestId = _render3.queryByTestId;

      expect(queryByTestId('DialogCloseButton')).not.toBeTruthy();
    });
    it('should not render DialogCloseButton in Mobile view even if "onClose" prop is defined', function () {
      _useBreakpoints.default.mockReturnValue({
        isMobile: true
      });

      var _render4 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
        onClose: closeAction
      })),
          queryByTestId = _render4.queryByTestId;

      expect(queryByTestId('DialogCloseButton')).not.toBeTruthy();
    });
    it('should called closeAction function', function () {
      _useBreakpoints.default.mockReturnValue({
        isMobile: false
      });

      var _render5 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
        onClose: closeAction
      })),
          queryByTestId = _render5.queryByTestId;

      var dialogCloseButton = queryByTestId('DialogCloseButton');

      _react2.fireEvent.click(dialogCloseButton);

      expect(closeAction).toBeCalledTimes(1);
    });
  });
  describe('DialogBackButton', function () {
    var backAction = jest.fn();
    it('should render DialogBackButton if "onBack" prop is defined', function () {
      var _render6 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
        onBack: backAction
      })),
          queryByTestId = _render6.queryByTestId;

      expect(queryByTestId('DialogBackButton')).toBeTruthy();
    });
    it('should not render DialogBackButton if "onBack" prop is undefined', function () {
      var _render7 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, null)),
          queryByTestId = _render7.queryByTestId;

      expect(queryByTestId('DialogBackButton')).not.toBeTruthy();
    });
    it('should called backAction function', function () {
      var _render8 = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
        onBack: backAction
      })),
          queryByTestId = _render8.queryByTestId;

      var dialogBackButton = queryByTestId('DialogBackButton');

      _react2.fireEvent.click(dialogBackButton);

      expect(backAction).toBeCalledTimes(1);
    });
  });
});