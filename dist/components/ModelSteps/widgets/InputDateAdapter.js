"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _dateFns = _interopRequireDefault(require("@date-io/date-fns"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pickers = require("@material-ui/pickers");

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var useStyles = (0, _makeStyles.default)(function () {
  return {
    overrides: {
      width: '100%',
      height: function height(isDesktop) {
        return isDesktop ? '5rem' : 'inehrit';
      },
      MuiOutlinedInput: {
        '&:focused': {
          notchedOutline: {
            borderColor: 'var(--primaryColor)'
          }
        }
      }
    }
  };
});

var InputDateAdapter = function InputDateAdapter(_ref) {
  var attrs = _ref.attrs,
      defaultValue = _ref.defaultValue,
      setValue = _ref.setValue,
      setValidInput = _ref.setValidInput,
      setIsFocus = _ref.setIsFocus,
      idx = _ref.idx;
  var name = attrs.name,
      inputLabel = attrs.inputLabel;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t,
      lang = _useI18n.lang;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isDesktop = _useBreakpoints.isDesktop;

  var classes = useStyles(isDesktop);

  var _useState = (0, _react.useState)(''),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      locales = _useState2[0],
      setLocales = _useState2[1];

  var _useState3 = (0, _react.useState)(true),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isValidDate = _useState4[0],
      setIsValidDate = _useState4[1];

  var _useState5 = (0, _react.useState)(defaultValue || null),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      selectedDate = _useState6[0],
      setSelectedDate = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      displayHelper = _useState8[0],
      setDisplayHelper = _useState8[1];

  (0, _react.useEffect)(function () {
    var isMounted = true;
    (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var src;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              src = require("date-fns/locale/".concat(lang, "/index.js"));
              isMounted && setLocales(src);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
    return function () {
      isMounted = false;
    };
  }, [lang]);

  var handleDateChange = function handleDateChange(value) {
    if ((value === null || value === void 0 ? void 0 : value.toString()) !== 'Invalid Date') {
      setSelectedDate(value);
      setIsValidDate(true);
    } else setIsValidDate(false);

    if (value === '') setSelectedDate(null);
  };

  (0, _react.useEffect)(function () {
    setValue(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, (0, _defineProperty2.default)({}, name, selectedDate));
    });
  }, [name, selectedDate, setValue]);
  (0, _react.useEffect)(function () {
    setValidInput(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, (0, _defineProperty2.default)({}, idx, isValidDate));
    });
  }, [idx, isValidDate, setValidInput]);

  var handleOnFocus = function handleOnFocus() {
    setIsFocus(true);
    setDisplayHelper(false);
  };

  var handleOnBlur = function handleOnBlur() {
    setIsFocus(false);
    setDisplayHelper(true);
  };

  return /*#__PURE__*/_react.default.createElement(_pickers.MuiPickersUtilsProvider, {
    utils: _dateFns.default,
    locale: locales
  }, /*#__PURE__*/_react.default.createElement(_pickers.KeyboardDatePicker, {
    placeholder: "01/01/2022",
    className: classes.overrides,
    error: displayHelper && !isValidDate,
    inputProps: {
      inputMode: 'numeric'
    },
    helperText: displayHelper && !isValidDate && t('InputDateAdapter.invalidDateMessage'),
    value: selectedDate,
    label: inputLabel ? t(inputLabel) : '',
    onChange: handleDateChange,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    inputVariant: "outlined",
    cancelLabel: t('common.cancel'),
    format: lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'
  }));
};

var attrsProptypes = _propTypes.default.shape({
  name: _propTypes.default.string,
  inputLabel: _propTypes.default.string,
  type: _propTypes.default.string,
  required: _propTypes.default.bool,
  minLength: _propTypes.default.number,
  maxLength: _propTypes.default.number
});

InputDateAdapter.propTypes = {
  attrs: attrsProptypes.isRequired,
  defaultValue: _propTypes.default.string,
  setValue: _propTypes.default.func.isRequired,
  setValidInput: _propTypes.default.func.isRequired,
  setIsFocus: _propTypes.default.func.isRequired,
  idx: _propTypes.default.number
};
var _default = InputDateAdapter;
exports.default = _default;