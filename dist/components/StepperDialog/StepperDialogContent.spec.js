"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _StepperDialogContent = _interopRequireDefault(require("./StepperDialogContent"));

var _useStepperDialog = require("../Hooks/useStepperDialog");

/* eslint-disable react/display-name */
jest.mock('../ModelSteps/Scan', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Scan"
    });
  };
});
jest.mock('../ModelSteps/Information', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Information"
    });
  };
});
jest.mock('../ModelSteps/ContactWrapper', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "ContactWrapper"
    });
  };
});
jest.mock('../Hooks/useStepperDialog');
/* eslint-enable react/display-name */

var mockAllCurrentSteps = [{
  stepIndex: 1,
  model: 'Scan'
}, {
  stepIndex: 2,
  model: 'Information'
}, {
  stepIndex: 3,
  model: 'Contact'
}];
describe('StepperDialogContent', function () {
  var setup = function setup() {
    return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_StepperDialogContent.default, null)));
  };

  it('should contain only Scan component', function () {
    _useStepperDialog.useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 1
    });

    var _setup = setup(),
        queryByTestId = _setup.queryByTestId;

    expect(queryByTestId('Scan')).toBeTruthy();
    expect(queryByTestId('Information')).toBeNull();
    expect(queryByTestId('ContactWrapper')).toBeNull();
  });
  it('should contain only Information component', function () {
    _useStepperDialog.useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 2
    });

    var _setup2 = setup(),
        queryByTestId = _setup2.queryByTestId;

    expect(queryByTestId('Information')).toBeTruthy();
    expect(queryByTestId('scan')).toBeNull();
    expect(queryByTestId('ContactWrapper')).toBeNull();
  });
  it('should contain only Contact component', function () {
    _useStepperDialog.useStepperDialog.mockReturnValue({
      allCurrentSteps: mockAllCurrentSteps,
      currentStepIndex: 3
    });

    var _setup3 = setup(),
        queryByTestId = _setup3.queryByTestId;

    expect(queryByTestId('ContactWrapper')).toBeTruthy();
    expect(queryByTestId('Scan')).toBeNull();
    expect(queryByTestId('Information')).toBeNull();
  });
});