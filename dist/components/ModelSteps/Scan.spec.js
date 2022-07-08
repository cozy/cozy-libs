"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _cozyDeviceHelper = require("cozy-device-helper");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _Scan = _interopRequireDefault(require("./Scan"));

var _FormDataProvider = require("../Contexts/FormDataProvider");

var _useFormData = require("../Hooks/useFormData");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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

jest.mock('cozy-device-helper', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-device-helper')), {}, {
    isMobile: jest.fn()
  });
});
jest.mock('../Hooks/useFormData');
/* eslint-disable react/display-name */

jest.mock('../CompositeHeader/CompositeHeader', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "CompositeHeader"
    });
  };
});
jest.mock('./AcquisitionResult', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "AcquisitionResult"
    });
  };
});
jest.mock('../ModelSteps/ScanMobileActions', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "ScanMobileActions"
    });
  };
});
jest.mock('../ModelSteps/ScanDesktopActions', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "ScanDesktopActions"
    });
  };
});
/* eslint-enable react/display-name */

var setup = function setup() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$setFormData = _ref4.setFormData,
      setFormData = _ref4$setFormData === void 0 ? jest.fn() : _ref4$setFormData,
      _ref4$formData = _ref4.formData,
      formData = _ref4$formData === void 0 ? mockFormData() : _ref4$formData,
      _ref4$currentStep = _ref4.currentStep,
      currentStep = _ref4$currentStep === void 0 ? mockCurrentStep() : _ref4$currentStep;

  _useFormData.useFormData.mockReturnValue({
    setFormData: setFormData,
    formData: formData
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_FormDataProvider.FormDataProvider, null, /*#__PURE__*/_react.default.createElement(_Scan.default, {
    currentStep: currentStep
  }))));
};

describe('Scan component:', function () {
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('ScanMobileActions component must be displayed if is on Mobile', function () {
    _cozyDeviceHelper.isMobile.mockReturnValue(true);

    var _setup2 = setup(),
        queryByTestId = _setup2.queryByTestId;

    expect(queryByTestId('ScanMobileActions')).toBeTruthy();
  });
  it('ScanDesktopActions component must be displayed if is on Desktop', function () {
    _cozyDeviceHelper.isMobile.mockReturnValue(false);

    var _setup3 = setup(),
        queryByTestId = _setup3.queryByTestId;

    expect(queryByTestId('ScanDesktopActions')).toBeTruthy();
  });
  it('CompositeHeader component must be displayed if no file exists', function () {
    var _setup4 = setup({
      formData: mockFormData({
        data: []
      })
    }),
        queryByTestId = _setup4.queryByTestId;

    expect(queryByTestId('CompositeHeader')).toBeTruthy();
  });
  it('CompositeHeader component must be displayed if no file of the current step exists', function () {
    var _setup5 = setup({
      currentStep: mockCurrentStep({
        stepIndex: 1
      }),
      formData: mockFormData({
        data: [{
          stepIndex: 2,
          file: mockFile({
            name: 'test.pdf'
          })
        }]
      })
    }),
        queryByTestId = _setup5.queryByTestId;

    expect(queryByTestId('CompositeHeader')).toBeTruthy();
  });
  it('AcquisitionResult component must be displayed if a file in the current step exists', function () {
    var _setup6 = setup({
      currentStep: mockCurrentStep({
        stepIndex: 1
      }),
      formData: mockFormData({
        data: [{
          stepIndex: 1,
          file: mockFile({
            name: 'test.pdf'
          })
        }]
      })
    }),
        queryByTestId = _setup6.queryByTestId;

    expect(queryByTestId('AcquisitionResult')).toBeTruthy();
  });
});