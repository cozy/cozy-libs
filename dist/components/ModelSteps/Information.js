"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _throttle = _interopRequireDefault(require("lodash/throttle"));

var _cozyDeviceHelper = require("cozy-device-helper");

var _DialogActions = _interopRequireDefault(require("cozy-ui/transpiled/react/DialogActions"));

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _useEventListener = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useEventListener"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _useFormData2 = require("../Hooks/useFormData");

var _useStepperDialog2 = require("../Hooks/useStepperDialog");

var _CompositeHeader = _interopRequireDefault(require("../CompositeHeader/CompositeHeader"));

var _InputDateAdapter = _interopRequireDefault(require("../ModelSteps/widgets/InputDateAdapter"));

var _InputTextAdapter = _interopRequireDefault(require("../ModelSteps/widgets/InputTextAdapter"));

var _IlluGenericInputText = _interopRequireDefault(require("../../assets/icons/IlluGenericInputText.svg"));

var _IlluGenericInputDate = _interopRequireDefault(require("../../assets/icons/IlluGenericInputDate.svg"));

var _hasNextvalue = require("../../utils/hasNextvalue");

var _const = require("../../constants/const");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var Information = function Information(_ref) {
  var _attributes$;

  var currentStep = _ref.currentStep;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var illustration = currentStep.illustration,
      text = currentStep.text,
      attributes = currentStep.attributes;

  var _useFormData = (0, _useFormData2.useFormData)(),
      formData = _useFormData.formData,
      setFormData = _useFormData.setFormData;

  var _useStepperDialog = (0, _useStepperDialog2.useStepperDialog)(),
      nextStep = _useStepperDialog.nextStep;

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      validInput = _useState4[0],
      setValidInput = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      isFocus = _useState6[0],
      setIsFocus = _useState6[1];

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var submit = (0, _throttle.default)(function () {
    if (value && allInputsValid) {
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          metadata: _objectSpread(_objectSpread({}, prev.metadata), value)
        });
      });
      nextStep();
    }
  }, 100);
  var handleKeyDown = (0, _react.useCallback)(function (evt) {
    if (evt.key === _const.KEYS.ENTER) submit();
  }, [submit]);
  (0, _useEventListener.default)(window, 'keydown', handleKeyDown);
  var inputs = (0, _react.useMemo)(function () {
    return attributes ? attributes.map(function (attrs) {
      switch (attrs.type) {
        case 'date':
          return function InputDate(props) {
            return /*#__PURE__*/_react.default.createElement(_InputDateAdapter.default, (0, _extends2.default)({
              attrs: attrs,
              defaultValue: formData.metadata[attrs.name],
              setValue: setValue,
              setValidInput: setValidInput,
              setIsFocus: setIsFocus
            }, props));
          };

        default:
          return function InputText(props) {
            return /*#__PURE__*/_react.default.createElement(_InputTextAdapter.default, (0, _extends2.default)({
              attrs: attrs,
              defaultValue: formData.metadata[attrs.name],
              setValue: setValue,
              setValidInput: setValidInput,
              setIsFocus: setIsFocus
            }, props));
          };
      }
    }) : [];
  }, [attributes, formData.metadata]);
  var hasMarginBottom = (0, _react.useCallback)(function (idx) {
    return (0, _hasNextvalue.hasNextvalue)(idx, inputs);
  }, [inputs]);
  var allInputsValid = (0, _react.useMemo)(function () {
    return Object.keys(validInput).every(function (val) {
      return validInput[val];
    });
  }, [validInput]);
  var fallbackIcon = (attributes === null || attributes === void 0 ? void 0 : (_attributes$ = attributes[0]) === null || _attributes$ === void 0 ? void 0 : _attributes$.type) === 'date' ? _IlluGenericInputDate.default : _IlluGenericInputText.default;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CompositeHeader.default, {
    icon: illustration,
    iconSize: "medium",
    className: isFocus && (0, _cozyDeviceHelper.isIOS)() ? 'is-focused' : '',
    fallbackIcon: fallbackIcon,
    title: t(text),
    text: inputs.map(function (Input, idx) {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: idx,
        className: (0, _classnames.default)((0, _defineProperty2.default)({
          'u-mh-1': !isMobile
        }, 'u-h-3 u-pb-1-half', hasMarginBottom(idx)))
      }, /*#__PURE__*/_react.default.createElement(Input, {
        idx: idx
      }));
    })
  }), /*#__PURE__*/_react.default.createElement(_DialogActions.default, {
    disableSpacing: true,
    className: (0, _classnames.default)('columnLayout u-mb-1-half u-mt-0 cozyDialogActions', {
      'u-mh-1': !isMobile,
      'u-mh-0': isMobile
    })
  }, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    label: t('common.next'),
    onClick: submit,
    fullWidth: true,
    onTouchEnd: function onTouchEnd(evt) {
      evt.preventDefault();
      submit();
    },
    disabled: !allInputsValid
  })));
};

var _default = /*#__PURE__*/_react.default.memo(Information);

exports.default = _default;