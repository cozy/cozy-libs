"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StepperDialogProvider = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _filterWithRemaining2 = require("../../helpers/filterWithRemaining");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var isOwner = function isOwner(item) {
  return item === 'owner';
};

var StepperDialogContext = /*#__PURE__*/(0, _react.createContext)();

var StepperDialogProvider = function StepperDialogProvider(_ref) {
  var children = _ref.children;

  var _useState = (0, _react.useState)(''),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      stepperDialogTitle = _useState2[0],
      setStepperDialogTitle = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      allCurrentSteps = _useState4[0],
      setAllCurrentSteps = _useState4[1];

  var _useState5 = (0, _react.useState)(1),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      currentStepIndex = _useState6[0],
      setCurrentStepIndex = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      currentDefinition = _useState8[0],
      setCurrentDefinition = _useState8[1];

  var resetStepperDialog = (0, _react.useCallback)(function () {
    setCurrentDefinition(null);
    setStepperDialogTitle('');
    setAllCurrentSteps([]);
    setCurrentStepIndex(1);
  }, []);
  (0, _react.useEffect)(function () {
    if (currentDefinition) {
      setStepperDialogTitle(currentDefinition.label);
      var allCurrentStepsDefinitions = currentDefinition.acquisitionSteps;

      if (allCurrentStepsDefinitions.length > 0) {
        var _contactStep$;

        var allCurrentStepsDefinitionsSorted = allCurrentStepsDefinitions.sort(function (a, b) {
          return a.stepIndex - b.stepIndex;
        }); // Despite its presence in the PapersDefinitions.json, it is not yet expected that the Contact step will be anywhere but in the last position

        var _filterWithRemaining = (0, _filterWithRemaining2.filterWithRemaining)(allCurrentStepsDefinitionsSorted, isOwner),
            contactStep = _filterWithRemaining.itemsFound,
            allStepsWithoutContact = _filterWithRemaining.remainingItems;

        var _allStepsWithoutConta = allStepsWithoutContact.slice(-1).pop(),
            lastStepIndex = _allStepsWithoutConta.stepIndex;

        setAllCurrentSteps([].concat((0, _toConsumableArray2.default)(allStepsWithoutContact), [{
          stepIndex: lastStepIndex + 1,
          multiple: ((_contactStep$ = contactStep[0]) === null || _contactStep$ === void 0 ? void 0 : _contactStep$.multiple) || false,
          illustration: 'Account.svg',
          text: 'PaperJSON.generic.owner.text',
          model: 'contact'
        }]));
      }
    }
  }, [currentDefinition]);
  var previousStep = (0, _react.useCallback)(function () {
    if (currentStepIndex > 1) {
      setCurrentStepIndex(function (prev) {
        return prev - 1;
      });
    }
  }, [currentStepIndex]);
  var nextStep = (0, _react.useCallback)(function () {
    allCurrentSteps.length > currentStepIndex && setCurrentStepIndex(function (prev) {
      return prev + 1;
    });
  }, [allCurrentSteps.length, currentStepIndex]);

  var stepperDialog = _react.default.useMemo(function () {
    return {
      allCurrentSteps: allCurrentSteps,
      currentStepIndex: currentStepIndex,
      stepperDialogTitle: stepperDialogTitle,
      currentDefinition: currentDefinition,
      setCurrentDefinition: setCurrentDefinition,
      previousStep: previousStep,
      nextStep: nextStep,
      resetStepperDialog: resetStepperDialog
    };
  }, [allCurrentSteps, currentStepIndex, stepperDialogTitle, currentDefinition, previousStep, nextStep, resetStepperDialog]);

  return /*#__PURE__*/_react.default.createElement(StepperDialogContext.Provider, {
    value: stepperDialog
  }, children);
};

exports.StepperDialogProvider = StepperDialogProvider;
var _default = StepperDialogContext;
exports.default = _default;