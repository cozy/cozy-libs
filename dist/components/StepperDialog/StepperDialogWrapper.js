"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _useStepperDialog2 = require("../Hooks/useStepperDialog");

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _StepperDialog = _interopRequireDefault(require("../StepperDialog/StepperDialog"));

var _StepperDialogContent = _interopRequireDefault(require("../StepperDialog/StepperDialogContent"));

var StepperDialogWrapper = function StepperDialogWrapper(_ref) {
  var onClose = _ref.onClose;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useStepperDialog = (0, _useStepperDialog2.useStepperDialog)(),
      allCurrentSteps = _useStepperDialog.allCurrentSteps,
      currentStepIndex = _useStepperDialog.currentStepIndex,
      previousStep = _useStepperDialog.previousStep,
      stepperDialogTitle = _useStepperDialog.stepperDialogTitle;

  var handleBack = function handleBack() {
    if (currentStepIndex > 1) {
      return previousStep;
    }

    return isMobile ? onClose : undefined;
  };

  return /*#__PURE__*/_react.default.createElement(_StepperDialog.default, {
    open: true,
    onClose: onClose,
    onBack: handleBack(),
    title: stepperDialogTitle && scannerT("items.".concat(stepperDialogTitle)),
    content: /*#__PURE__*/_react.default.createElement(_StepperDialogContent.default, {
      onClose: onClose
    }),
    stepper: "".concat(currentStepIndex, "/").concat(allCurrentSteps.length)
  });
};

var _default = StepperDialogWrapper;
exports.default = _default;