"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _ContactWrapper = _interopRequireDefault(require("./ContactWrapper"));

var _FormDataProvider = require("../Contexts/FormDataProvider");

var _useFormData = require("../Hooks/useFormData");

var _fetchCurrentUser = require("../../helpers/fetchCurrentUser");

var mockCurrentStep = {
  illustration: 'Account.svg',
  text: 'text of step'
};

var mockFormData = function mockFormData() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$metadata = _ref.metadata,
      metadata = _ref$metadata === void 0 ? {} : _ref$metadata,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? [] : _ref$data,
      _ref$contacts = _ref.contacts,
      contacts = _ref$contacts === void 0 ? [] : _ref$contacts;

  return {
    metadata: metadata,
    data: data,
    contacts: contacts
  };
};

jest.mock('../Hooks/useFormData');
jest.mock('../../helpers/fetchCurrentUser', function () {
  return {
    fetchCurrentUser: jest.fn()
  };
});
/* eslint-disable react/display-name */

jest.mock('./widgets/ConfirmReplaceFile', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "ConfirmReplaceFile"
    });
  };
});
/* eslint-enable react/display-name */

var setup = function setup() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$formData = _ref2.formData,
      formData = _ref2$formData === void 0 ? mockFormData() : _ref2$formData,
      _ref2$formSubmit = _ref2.formSubmit,
      formSubmit = _ref2$formSubmit === void 0 ? jest.fn() : _ref2$formSubmit,
      _ref2$onClose = _ref2.onClose,
      onClose = _ref2$onClose === void 0 ? jest.fn() : _ref2$onClose,
      _ref2$mockFetchCurren = _ref2.mockFetchCurrentUser,
      mockFetchCurrentUser = _ref2$mockFetchCurren === void 0 ? jest.fn() : _ref2$mockFetchCurren;

  _fetchCurrentUser.fetchCurrentUser.mockImplementation(mockFetchCurrentUser);

  _useFormData.useFormData.mockReturnValue({
    formData: formData,
    setFormData: jest.fn(),
    formSubmit: formSubmit
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_FormDataProvider.FormDataProvider, null, /*#__PURE__*/_react.default.createElement(_ContactWrapper.default, {
    currentStep: mockCurrentStep,
    onClose: onClose
  }))));
};

describe('ContactWrapper', function () {
  it('should submit when save button is clicked, if the file is from user device', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var mockFormSubmit, mockFetchCurrentUser, userDeviceFile, _setup, findByTestId, btn;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockFormSubmit = jest.fn();
            mockFetchCurrentUser = jest.fn(function () {
              return {
                _id: '1234'
              };
            });
            userDeviceFile = new File([{}], 'userDeviceFile');
            _setup = setup({
              formData: mockFormData({
                data: [{
                  file: userDeviceFile
                }]
              }),
              formSubmit: mockFormSubmit,
              mockFetchCurrentUser: mockFetchCurrentUser
            }), findByTestId = _setup.findByTestId;
            _context.next = 6;
            return findByTestId('ButtonSave');

          case 6:
            btn = _context.sent;

            _react2.fireEvent.click(btn);

            expect(mockFormSubmit).toBeCalledTimes(1);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should not submit when save button is clicked, if the file is from Cozy Drive', function () {
    var mockFormSubmit = jest.fn();
    var cozyFile = new Blob();

    var _setup2 = setup({
      formData: mockFormData({
        data: [{
          file: cozyFile
        }]
      }),
      formSubmit: mockFormSubmit
    }),
        getByTestId = _setup2.getByTestId;

    var btn = getByTestId('ButtonSave');

    _react2.fireEvent.click(btn);

    expect(mockFormSubmit).toBeCalledTimes(0);
  });
  it('should call fetchCurrentUser once at mount', function () {
    var mockFetchCurrentUser = jest.fn();
    setup({
      mockFetchCurrentUser: mockFetchCurrentUser
    });
    expect(mockFetchCurrentUser).toBeCalledTimes(1);
  });
  it('should not diplay ConfirmReplaceFile modal when save button is clicked, if the file is from User Device', function () {
    var mockFetchCurrentUser = jest.fn(function () {
      return {
        _id: '1234'
      };
    });
    var userDeviceFile = new File([{}], 'userDeviceFile');

    var _setup3 = setup({
      formData: mockFormData({
        data: [{
          file: userDeviceFile
        }]
      }),
      mockFetchCurrentUser: mockFetchCurrentUser
    }),
        getByTestId = _setup3.getByTestId,
        queryByTestId = _setup3.queryByTestId;

    var btn = getByTestId('ButtonSave');

    _react2.fireEvent.click(btn);

    expect(queryByTestId('ConfirmReplaceFile')).toBeNull();
  });
  it('should diplay ConfirmReplaceFile modal when save button is clicked, if the file is from Cozy Drive', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var mockFetchCurrentUser, cozyFile, _setup4, findByTestId, getByTestId, btn;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mockFetchCurrentUser = jest.fn(function () {
              return {
                _id: '1234'
              };
            });
            cozyFile = new Blob();
            _setup4 = setup({
              formData: mockFormData({
                data: [{
                  file: cozyFile
                }]
              }),
              mockFetchCurrentUser: mockFetchCurrentUser
            }), findByTestId = _setup4.findByTestId, getByTestId = _setup4.getByTestId;
            _context2.next = 5;
            return findByTestId('ButtonSave');

          case 5:
            btn = _context2.sent;

            _react2.fireEvent.click(btn);

            expect(getByTestId('ConfirmReplaceFile'));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});