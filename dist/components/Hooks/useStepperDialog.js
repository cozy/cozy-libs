"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStepperDialog = void 0;

var _react = require("react");

var _StepperDialogProvider = _interopRequireDefault(require("../Contexts/StepperDialogProvider"));

var useStepperDialog = function useStepperDialog() {
  var stepperDialogContext = (0, _react.useContext)(_StepperDialogProvider.default);

  if (!stepperDialogContext) {
    throw new Error('useStepperDialog must be used within a StepperDialogProvider');
  }

  return stepperDialogContext;
};

exports.useStepperDialog = useStepperDialog;