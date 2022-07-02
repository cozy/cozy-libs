'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

require("@testing-library/jest-dom");

var _AppLike = _interopRequireDefault(require("../../../../test/components/AppLike"));

var _InputTextAdapter = _interopRequireDefault(require("./InputTextAdapter"));

jest.mock('cozy-client/dist/models/document/locales', function () {
  return {
    getBoundT: jest.fn(function () {
      return jest.fn();
    })
  };
});

var mockAttrs = function mockAttrs() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? '' : _ref$type,
      maxLength = _ref.maxLength,
      minLength = _ref.minLength,
      _ref$required = _ref.required,
      required = _ref$required === void 0 ? false : _ref$required,
      _ref$mask = _ref.mask,
      mask = _ref$mask === void 0 ? null : _ref$mask,
      _ref$maskPlaceholder = _ref.maskPlaceholder,
      maskPlaceholder = _ref$maskPlaceholder === void 0 ? 'ˍ' : _ref$maskPlaceholder;

  return {
    name: 'name01',
    inputLabel: 'PaperJSON.IDCard.number.inputLabel',
    required: required,
    minLength: minLength,
    maxLength: maxLength,
    type: type,
    mask: mask,
    maskPlaceholder: maskPlaceholder
  };
};

var setup = function setup() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$attrs = _ref2.attrs,
      attrs = _ref2$attrs === void 0 ? mockAttrs() : _ref2$attrs,
      _ref2$defaultValue = _ref2.defaultValue,
      defaultValue = _ref2$defaultValue === void 0 ? '' : _ref2$defaultValue;

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_InputTextAdapter.default, {
    attrs: attrs,
    defaultValue: defaultValue,
    setValue: jest.fn(),
    setValidInput: jest.fn(),
    setIsFocus: jest.fn(),
    idx: 0
  })));
};

describe('InputTextAdapter components:', function () {
  describe('With "mask" attribute', function () {
    it('should have the "minlength" property at 0', function () {
      var _setup = setup({
        attrs: {
          minLength: 2,
          mask: '** **'
        }
      }),
          getByTestId = _setup.getByTestId;

      var input = getByTestId('InputMask-TextField-input');
      expect(input).not.toHaveAttribute('minLength');
    });
    it('should have the "maxlength" property equal to max length default', function () {
      var _setup2 = setup({
        attrs: {
          minLength: 2,
          maxLength: 5,
          mask: '** **'
        }
      }),
          getByTestId = _setup2.getByTestId;

      var input = getByTestId('InputMask-TextField-input');
      expect(input).not.toHaveAttribute('maxLength');
    });
    it('should have a correctly formatted value', function () {
      var _setup3 = setup({
        attrs: {
          mask: '** **'
        }
      }),
          getByTestId = _setup3.getByTestId;

      var input = getByTestId('InputMask-TextField-input');

      _react2.fireEvent.change(input, {
        target: {
          value: 'text value'
        }
      });

      expect(input).toHaveAttribute('value', 'te xt');
    });
    it('should have a value with text and numbers', function () {
      var _setup4 = setup({
        attrs: {
          mask: '****'
        }
      }),
          getByTestId = _setup4.getByTestId;

      var input = getByTestId('InputMask-TextField-input');

      _react2.fireEvent.change(input, {
        target: {
          value: 'aB12'
        }
      });

      expect(input).toHaveAttribute('value', 'aB12');
    });
    it('should have only maskPlaceholder value if you type letters with the "mask" property accepts only numbers', function () {
      var _setup5 = setup({
        attrs: {
          mask: '9999'
        }
      }),
          getByTestId = _setup5.getByTestId;

      var input = getByTestId('InputMask-TextField-input');

      _react2.fireEvent.change(input, {
        target: {
          value: 'text'
        }
      });

      expect(input).toHaveAttribute('value', 'ˍˍˍˍ');
    });
    it('should have only maskPlaceholder if you type numbers with the "mask" property accepts only letters', function () {
      var _setup6 = setup({
        attrs: {
          mask: 'aaaa'
        }
      }),
          getByTestId = _setup6.getByTestId;

      var input = getByTestId('InputMask-TextField-input');

      _react2.fireEvent.change(input, {
        target: {
          value: '1234'
        }
      });

      expect(input).toHaveAttribute('value', 'ˍˍˍˍ');
    });
    it('should have a "maskPlaceholder" defined to "ˍ" by default', function () {
      var _setup7 = setup({
        attrs: {
          mask: '**'
        }
      }),
          getByTestId = _setup7.getByTestId;

      var input = getByTestId('InputMask-TextField-input');

      _react2.fireEvent.change(input, {
        target: {
          value: 'a'
        }
      });

      expect(input).toHaveAttribute('value', 'aˍ');
    });
    it('should have a "-" like "maskPlaceholder"', function () {
      var _setup8 = setup({
        attrs: {
          mask: '**',
          maskPlaceholder: '-'
        }
      }),
          getByTestId = _setup8.getByTestId;

      var input = getByTestId('InputMask-TextField-input');

      _react2.fireEvent.change(input, {
        target: {
          value: 'a'
        }
      });

      expect(input).toHaveAttribute('value', 'a-');
    });
    it('should have the "inputMode" property at "numeric" if mask cannot contain text', function () {
      var _setup9 = setup({
        attrs: {
          type: 'text',
          mask: '9999'
        }
      }),
          getByTestId = _setup9.getByTestId;

      var input = getByTestId('InputMask-TextField-input');
      expect(input).toHaveAttribute('inputMode', 'numeric');
    });
    it('should have the "inputMode" property at "text" if mask can contain text', function () {
      var _setup10 = setup({
        attrs: {
          type: 'number',
          mask: '99aa'
        }
      }),
          getByTestId = _setup10.getByTestId;

      var input = getByTestId('InputMask-TextField-input');
      expect(input).toHaveAttribute('inputMode', 'text');
    });
  });
  describe('Without "mask" attribute', function () {
    it('should have the "minlength" property at 2', function () {
      var _setup11 = setup({
        attrs: {
          minLength: 2
        }
      }),
          getByTestId = _setup11.getByTestId;

      var input = getByTestId('TextField-input');
      expect(input).toHaveAttribute('minLength', '2');
    });
    it('should have the "maxlength" property at 5', function () {
      var _setup12 = setup({
        attrs: {
          maxLength: 5
        }
      }),
          getByTestId = _setup12.getByTestId;

      var input = getByTestId('TextField-input');
      expect(input).toHaveAttribute('maxLength', '5');
    });
    it('should have the "inputMode" property at "numeric"', function () {
      var _setup13 = setup({
        attrs: {
          type: 'number'
        }
      }),
          getByTestId = _setup13.getByTestId;

      var input = getByTestId('TextField-input');
      expect(input).toHaveAttribute('inputMode', 'numeric');
    });
    it('should have the "inputMode" property at "text"', function () {
      var _setup14 = setup({
        attrs: {
          type: 'text'
        }
      }),
          getByTestId = _setup14.getByTestId;

      var input = getByTestId('TextField-input');
      expect(input).toHaveAttribute('inputMode', 'text');
    });
    it('should have the "inputMode" property at "text" by default', function () {
      var _setup15 = setup({
        attrs: {
          type: ''
        }
      }),
          getByTestId = _setup15.getByTestId;

      var input = getByTestId('TextField-input');
      expect(input).toHaveAttribute('inputMode', 'text');
    });
  });
});