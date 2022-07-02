"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useStepperDialog2 = require("../Hooks/useStepperDialog");

var _Scan = _interopRequireDefault(require("../ModelSteps/Scan"));

var _Information = _interopRequireDefault(require("../ModelSteps/Information"));

var _ContactWrapper = _interopRequireDefault(require("../ModelSteps/ContactWrapper"));

var StepperDialogContent = function StepperDialogContent(_ref) {
  var onClose = _ref.onClose;

  var _useStepperDialog = (0, _useStepperDialog2.useStepperDialog)(),
      allCurrentSteps = _useStepperDialog.allCurrentSteps,
      currentStepIndex = _useStepperDialog.currentStepIndex;

  return allCurrentSteps.map(function (currentStep) {
    if (currentStep.stepIndex === currentStepIndex) {
      var modelPage = currentStep.model.toLowerCase();

      switch (modelPage) {
        case 'scan':
          return /*#__PURE__*/_react.default.createElement(_Scan.default, {
            key: currentStep.stepIndex,
            currentStep: currentStep
          });

        case 'information':
          return /*#__PURE__*/_react.default.createElement(_Information.default, {
            key: currentStep.stepIndex,
            currentStep: currentStep
          });

        case 'contact':
          return /*#__PURE__*/_react.default.createElement(_ContactWrapper.default, {
            key: currentStep.stepIndex,
            currentStep: currentStep,
            onClose: onClose
          });
      }
    }
  });
};

var _default = StepperDialogContent;
exports.default = _default;