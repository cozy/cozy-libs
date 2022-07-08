"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _findPlaceholders = require("../../helpers/findPlaceholders");

var _FormDataProvider = require("../Contexts/FormDataProvider");

var _usePapersDefinitions2 = require("../Hooks/usePapersDefinitions");

var _useStepperDialog2 = require("../Hooks/useStepperDialog");

var _StepperDialogWrapper = _interopRequireDefault(require("./StepperDialogWrapper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var CreatePaperModal = function CreatePaperModal(_ref) {
  var onClose = _ref.onClose;

  var _useParams = (0, _reactRouterDom.useParams)(),
      qualificationLabel = _useParams.qualificationLabel;

  var _usePapersDefinitions = (0, _usePapersDefinitions2.usePapersDefinitions)(),
      papersDefinitions = _usePapersDefinitions.papersDefinitions;

  var _useStepperDialog = (0, _useStepperDialog2.useStepperDialog)(),
      setCurrentDefinition = _useStepperDialog.setCurrentDefinition,
      currentDefinition = _useStepperDialog.currentDefinition;

  var allPlaceholders = (0, _react.useMemo)(function () {
    return (0, _findPlaceholders.findPlaceholdersByQualification)(papersDefinitions, [{
      label: qualificationLabel
    }]);
  }, [qualificationLabel, papersDefinitions]);
  var formModel = allPlaceholders[0];
  (0, _react.useEffect)(function () {
    if (formModel && currentDefinition !== formModel) {
      setCurrentDefinition(formModel);
    }
  }, [formModel, currentDefinition, setCurrentDefinition]);

  if (!currentDefinition) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_FormDataProvider.FormDataProvider, null, /*#__PURE__*/_react.default.createElement(_StepperDialogWrapper.default, {
    onClose: onClose
  }));
};

var _default = CreatePaperModal;
exports.default = _default;