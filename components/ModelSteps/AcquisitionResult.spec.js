"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _AcquisitionResult = _interopRequireDefault(require("./AcquisitionResult"));

var _FormDataProvider = require("../Contexts/FormDataProvider");

var _useStepperDialog = require("../Hooks/useStepperDialog");

var _useFormData = require("../Hooks/useFormData");

var mockCurrentStep = function mockCurrentStep() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$page = _ref.page,
      page = _ref$page === void 0 ? '' : _ref$page,
      _ref$multipage = _ref.multipage,
      multipage = _ref$multipage === void 0 ? false : _ref$multipage,
      _ref$stepIndex = _ref.stepIndex,
      stepIndex = _ref$stepIndex === void 0 ? 0 : _ref$stepIndex;

  return {
    page: page,
    multipage: multipage,
    stepIndex: stepIndex
  };
};

var mockFile = function mockFile() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? '' : _ref2$type,
      _ref2$name = _ref2.name,
      name = _ref2$name === void 0 ? '' : _ref2$name;

  return {
    type: type,
    name: name
  };
};

var mockFormData = function mockFormData() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$metadata = _ref3.metadata,
      metadata = _ref3$metadata === void 0 ? {} : _ref3$metadata,
      _ref3$data = _ref3.data,
      data = _ref3$data === void 0 ? [] : _ref3$data,
      _ref3$contacts = _ref3.contacts,
      contacts = _ref3$contacts === void 0 ? [] : _ref3$contacts;

  return {
    metadata: metadata,
    data: data,
    contacts: contacts
  };
};

jest.mock('../Hooks/useStepperDialog');
jest.mock('../Hooks/useFormData');

var setup = function setup() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$nextStep = _ref4.nextStep,
      nextStep = _ref4$nextStep === void 0 ? jest.fn() : _ref4$nextStep,
      _ref4$setFormData = _ref4.setFormData,
      setFormData = _ref4$setFormData === void 0 ? jest.fn() : _ref4$setFormData,
      _ref4$setCurrentFile = _ref4.setCurrentFile,
      setCurrentFile = _ref4$setCurrentFile === void 0 ? jest.fn() : _ref4$setCurrentFile,
      _ref4$formData = _ref4.formData,
      formData = _ref4$formData === void 0 ? mockFormData() : _ref4$formData,
      _ref4$currentFile = _ref4.currentFile,
      currentFile = _ref4$currentFile === void 0 ? mockFile() : _ref4$currentFile,
      _ref4$currentStep = _ref4.currentStep,
      currentStep = _ref4$currentStep === void 0 ? mockCurrentStep() : _ref4$currentStep;

  _useStepperDialog.useStepperDialog.mockReturnValue({
    nextStep: nextStep
  });

  _useFormData.useFormData.mockReturnValue({
    setFormData: setFormData,
    formData: formData
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_FormDataProvider.FormDataProvider, null, /*#__PURE__*/_react.default.createElement(_AcquisitionResult.default, {
    setCurrentFile: setCurrentFile,
    currentFile: currentFile,
    currentStep: currentStep
  }))));
};

describe('AcquisitionResult component:', function () {
  beforeEach(function () {
    window.URL.createObjectURL = jest.fn();
    jest.resetAllMocks();
  });
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('repeat button should not exist if the step is not multipage', function () {
    var _setup2 = setup({
      currentStep: mockCurrentStep({
        multipage: false
      })
    }),
        container = _setup2.container;

    var btn = container.querySelector('[data-testid="repeat-button"]');
    expect(btn).toBeNull();
  });
  it('repeat button should exist if the step is multipage', function () {
    var _setup3 = setup({
      currentStep: mockCurrentStep({
        multipage: true
      })
    }),
        container = _setup3.container;

    var btn = container.querySelector('[data-testid="repeat-button"]');
    expect(btn).toBeDefined();
  });
  describe('setCurrentFile', function () {
    it('should setCurrentFile must be called once with null when restarting the file selection', function () {
      var mockSetCurrentFile = jest.fn();

      var _setup4 = setup({
        setCurrentFile: mockSetCurrentFile
      }),
          getByTestId = _setup4.getByTestId;

      var btn = getByTestId('retry-button');

      _react2.fireEvent.click(btn);

      expect(mockSetCurrentFile).toHaveBeenCalledWith(null);
      expect(mockSetCurrentFile).toHaveBeenCalledTimes(1);
    });
    it('should setCurrentFile must be called once with null when add more files', function () {
      var mockSetCurrentFile = jest.fn();
      var mockNextStep = jest.fn();

      var _setup5 = setup({
        nextStep: mockNextStep,
        setCurrentFile: mockSetCurrentFile,
        currentStep: mockCurrentStep({
          multipage: true
        })
      }),
          getByTestId = _setup5.getByTestId;

      var btn = getByTestId('repeat-button');

      _react2.fireEvent.click(btn);

      expect(mockSetCurrentFile).toHaveBeenCalledWith(null);
      expect(mockSetCurrentFile).toHaveBeenCalledTimes(1);
      expect(mockNextStep).toHaveBeenCalledTimes(0);
    });
  });
  describe('nextStep', function () {
    it('should nextStep does not be called when add more files', function () {
      var mockNextStep = jest.fn();

      var _setup6 = setup({
        nextStep: mockNextStep,
        currentStep: mockCurrentStep({
          multipage: true
        })
      }),
          getByTestId = _setup6.getByTestId;

      var btn = getByTestId('repeat-button');

      _react2.fireEvent.click(btn);

      expect(mockNextStep).toHaveBeenCalledTimes(0);
    });
    it('should nextStep must be called when next button is clicked', function () {
      var nextStep = jest.fn();

      var _setup7 = setup({
        nextStep: nextStep
      }),
          getByTestId = _setup7.getByTestId;

      var btn = getByTestId('next-button');

      _react2.fireEvent.click(btn);

      expect(nextStep).toHaveBeenCalledTimes(1);
    });
    it('should nextStep must be called when Enter key is pressed', function () {
      var nextStep = jest.fn();
      setup({
        nextStep: nextStep
      });

      _react2.fireEvent.keyDown(window, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });

      expect(nextStep).toHaveBeenCalledTimes(1);
    });
  });
  describe('setFormData', function () {
    it('should setFormData must be called once when component is mounted', function () {
      var mockSetFormData = jest.fn();
      setup({
        setFormData: mockSetFormData
      });
      expect(mockSetFormData).toHaveBeenCalledTimes(1);
    });
    it('should setFormData must not be called when component is mounted if file already exists on same stepIndex', function () {
      var mockSetFormData = jest.fn();
      setup({
        setFormData: mockSetFormData,
        currentFile: mockFile({
          name: 'test.pdf'
        }),
        currentStep: mockCurrentStep({
          stepIndex: 1
        }),
        formData: mockFormData({
          data: [{
            stepIndex: 1,
            file: {
              name: 'test.pdf'
            }
          }]
        })
      });
      expect(mockSetFormData).toHaveBeenCalledTimes(0);
    });
    it('should setFormData must be called once when restarting the file selection', function () {
      var mockSetFormData = jest.fn();

      var _setup8 = setup({
        setFormData: mockSetFormData
      }),
          getByTestId = _setup8.getByTestId;

      expect(mockSetFormData).toHaveBeenCalledTimes(1);
      var btn = getByTestId('retry-button');

      _react2.fireEvent.click(btn);

      expect(mockSetFormData).toHaveBeenCalledTimes(2);
    });
  });
});