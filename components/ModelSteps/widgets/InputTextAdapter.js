"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactInputMask = _interopRequireDefault(require("react-input-mask"));

var _TextField = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/TextField"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _input = require("../../../utils/input");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var styleFontMono = 'Segoe UI Mono, SF Mono, Roboto Mono, Courier';

var getInputMode = function getInputMode(inputType, mask) {
  if (mask) {
    // If the mask attribute contains "*" or "a", it can contain text
    // So on mobile, we want to display the text keyboard
    var hasText = ['*', 'a'].some(function (t) {
      return mask.includes(t);
    });
    return hasText ? 'text' : 'numeric';
  }

  return inputType === 'number' ? 'numeric' : 'text';
};

var InputTextAdapter = function InputTextAdapter(_ref) {
  var attrs = _ref.attrs,
      defaultValue = _ref.defaultValue,
      setValue = _ref.setValue,
      setValidInput = _ref.setValidInput,
      setIsFocus = _ref.setIsFocus,
      idx = _ref.idx;
  var name = attrs.name,
      inputLabel = attrs.inputLabel,
      mask = attrs.mask,
      _attrs$maskPlaceholde = attrs.maskPlaceholder,
      maskPlaceholder = _attrs$maskPlaceholde === void 0 ? 'ˍ' : _attrs$maskPlaceholde;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useState = (0, _react.useState)(defaultValue || ''),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      currentValue = _useState2[0],
      setCurrentValue = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isTooShort = _useState4[0],
      setIsTooShort = _useState4[1];

  var _useMemo = (0, _react.useMemo)(function () {
    return (0, _input.makeConstraintsOfInput)(attrs);
  }, [attrs]),
      inputType = _useMemo.inputType,
      expectedLength = _useMemo.expectedLength,
      isRequired = _useMemo.isRequired;

  var isValidInputValue = (0, _react.useMemo)(function () {
    return (0, _input.checkConstraintsOfIinput)(currentValue.length, expectedLength, isRequired);
  }, [currentValue.length, expectedLength, isRequired]);
  (0, _react.useEffect)(function () {
    setValue(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, (0, _defineProperty2.default)({}, name, currentValue));
    });
  }, [name, setValue, currentValue]);
  (0, _react.useEffect)(function () {
    setValidInput(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, (0, _defineProperty2.default)({}, idx, isValidInputValue));
    });
  }, [idx, isValidInputValue, setValidInput]);
  /*
  Fix to force Safari to accept only numbers in a field normally of type number
  We simulate the "number" field from a "text" field for at least 2 reasons:
    - Text entries in a "number" field are possible and are not visible in the "value" attribute
    - Avoid poor integration of the "number" field (control arrows on the right in the field)
  The "inputMode" is important to trigger the right keyboard on iOS > 12.1
  */

  var handleOnChange = function handleOnChange(evt) {
    var targetValue = evt.target.value;
    var currentValue = targetValue;

    if (mask) {
      var toReplace = new RegExp("\\s|".concat(maskPlaceholder), 'g');
      currentValue = targetValue.replaceAll(toReplace, '');
    }

    if (inputType === 'number' && !mask) {
      var parseIntValue = parseInt(currentValue, 10);

      if (/^[0-9]*$/.test(parseIntValue)) {
        setCurrentValue(parseIntValue.toString());
      } else if (currentValue === '') {
        setCurrentValue(currentValue);
      }
    } else {
      setCurrentValue(currentValue);
    }
  };

  var handleOnFocus = function handleOnFocus() {
    setIsFocus(true);
    setIsTooShort(false);
  };

  var handleOnBlur = function handleOnBlur() {
    setIsFocus(false);

    if (currentValue.length > 0) {
      setIsTooShort(expectedLength.min > 0 && currentValue.length < expectedLength.min);
    } else setIsTooShort(false);
  };

  var helperText = isTooShort ? t('InputTextAdapter.invalidTextMessage', {
    smart_count: expectedLength.min - currentValue.length
  }) : ' ';

  if (mask) {
    return /*#__PURE__*/_react.default.createElement(_reactInputMask.default, {
      mask: mask,
      maskPlaceholder: maskPlaceholder,
      alwaysShowMask: true,
      value: currentValue,
      onChange: handleOnChange,
      onFocus: handleOnFocus,
      onBlur: handleOnBlur
    }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
      type: "text",
      variant: "outlined",
      label: inputLabel ? t(inputLabel) : '',
      error: isTooShort,
      helperText: helperText,
      inputProps: {
        style: {
          fontFamily: styleFontMono,
          caretColor: 'var(--primaryTextColor)',
          textAlign: 'center',
          paddingLeft: '12px',
          paddingRight: '12px',
          transition: 'color 0.5s',
          color: currentValue ? 'var(--primaryTextColor)' : 'var(--hintTextColor)'
        },
        inputMode: getInputMode(inputType, mask),
        'data-testid': 'InputMask-TextField-input'
      },
      required: isRequired,
      fullWidth: true
    }));
  }

  return /*#__PURE__*/_react.default.createElement(_TextField.default, {
    type: "text",
    variant: "outlined",
    label: inputLabel ? t(inputLabel) : '',
    error: isTooShort,
    helperText: helperText,
    value: currentValue,
    inputProps: {
      maxLength: expectedLength.max,
      minLength: expectedLength.min,
      inputMode: getInputMode(inputType),
      'data-testid': 'TextField-input'
    },
    onChange: handleOnChange,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    required: isRequired,
    fullWidth: true
  });
};

var attrsProptypes = _propTypes.default.shape({
  name: _propTypes.default.string,
  inputLabel: _propTypes.default.string,
  type: _propTypes.default.string,
  required: _propTypes.default.bool,
  minLength: _propTypes.default.number,
  maxLength: _propTypes.default.number,
  mask: _propTypes.default.string,
  maskPlaceholder: _propTypes.default.string
});

InputTextAdapter.propTypes = {
  attrs: attrsProptypes.isRequired,
  defaultValue: _propTypes.default.string,
  setValue: _propTypes.default.func.isRequired,
  setValidInput: _propTypes.default.func.isRequired,
  setIsFocus: _propTypes.default.func.isRequired,
  idx: _propTypes.default.number
};
var _default = InputTextAdapter;
exports.default = _default;