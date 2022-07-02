"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _Card = _interopRequireDefault(require("cozy-ui/transpiled/react/Card"));

var _DialogActions = _interopRequireDefault(require("cozy-ui/transpiled/react/DialogActions"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Avatar = _interopRequireDefault(require("cozy-ui/transpiled/react/Avatar"));

var _Button = _interopRequireWildcard(require("cozy-ui/transpiled/react/Button"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _useEventListener = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useEventListener"));

var _useStepperDialog2 = require("../Hooks/useStepperDialog");

var _useFormData2 = require("../Hooks/useFormData");

var _PaperDefinitionsPropTypes = require("../../constants/PaperDefinitionsPropTypes");

var _const = require("../../constants/const");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var isPDF = function isPDF(file) {
  return file.type === 'application/pdf';
};

var useStyles = (0, _makeStyles.default)(function () {
  return {
    img: {
      maxWidth: '100%',
      maxHeight: 'inherit'
    },
    avatar: {
      color: 'var(--paperBackgroundColor)',
      backgroundColor: 'var(--successColor)',
      marginBottom: '1rem'
    }
  };
});

var AcquisitionResult = function AcquisitionResult(_ref) {
  var currentFile = _ref.currentFile,
      setCurrentFile = _ref.setCurrentFile,
      currentStep = _ref.currentStep;
  var styles = useStyles();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var _useStepperDialog = (0, _useStepperDialog2.useStepperDialog)(),
      nextStep = _useStepperDialog.nextStep;

  var _useFormData = (0, _useFormData2.useFormData)(),
      setFormData = _useFormData.setFormData,
      formData = _useFormData.formData;

  var page = currentStep.page,
      multipage = currentStep.multipage,
      stepIndex = currentStep.stepIndex;
  (0, _react.useEffect)(function () {
    var hasAlreadyFile = formData.data.some(function (d) {
      return d.stepIndex === stepIndex && d.file.name === currentFile.name;
    });

    if (!hasAlreadyFile) {
      setFormData(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          data: [].concat((0, _toConsumableArray2.default)(prev.data), [{
            file: currentFile,
            stepIndex: stepIndex,
            fileMetadata: {
              page: !multipage ? page : '',
              multipage: multipage
            }
          }])
        });
      });
    }
  }, [formData.data, stepIndex, currentFile, multipage, page, setFormData]);

  var changeSelectedFile = function changeSelectedFile() {
    var newData = formData.data.filter(function (data) {
      return data.file.name !== currentFile.name;
    });
    setFormData(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        data: newData
      });
    });
    setCurrentFile(null);
  };

  var onValid = (0, _react.useCallback)(function () {
    var repeat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!repeat) nextStep();else setCurrentFile(null);
  }, [nextStep, setCurrentFile]);
  var handleKeyDown = (0, _react.useCallback)(function (_ref2) {
    var key = _ref2.key;
    if (key === _const.KEYS.ENTER) onValid();
  }, [onValid]);
  (0, _useEventListener.default)(window, 'keydown', handleKeyDown);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('u-h-100 u-mb-2 u-flex u-flex-column u-flex-justify-center', (0, _defineProperty2.default)({}, 'u-mt-2 u-mh-1', !isMobile))
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "u-flex u-flex-column u-flex-items-center u-mb-2"
  }, /*#__PURE__*/_react.default.createElement(_Avatar.default, {
    icon: "check",
    size: "xlarge",
    className: styles.avatar
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5"
  }, t('Acquisition.success'))), /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: "u-ta-center u-p-1 u-pb-half"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "u-mah-5"
  }, !isPDF(currentFile) ? /*#__PURE__*/_react.default.createElement("img", {
    src: URL.createObjectURL(currentFile),
    className: styles.img
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "file-type-pdf",
    size: 80
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, null, currentFile.name))), /*#__PURE__*/_react.default.createElement(_Button.default, {
    className: "u-mt-half",
    "data-testid": "retry-button",
    label: t('Acquisition.retry'),
    theme: "text",
    onClick: changeSelectedFile
  }))), /*#__PURE__*/_react.default.createElement(_DialogActions.default, {
    disableSpacing: true,
    className: (0, _classnames.default)('columnLayout u-mb-1-half u-mt-0 cozyDialogActions', {
      'u-mh-1': !isMobile,
      'u-mh-0': isMobile
    })
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    className: "u-db",
    "data-testid": "next-button",
    extension: "full",
    label: t('common.next'),
    onClick: function onClick() {
      return onValid(false);
    }
  }), multipage && /*#__PURE__*/_react.default.createElement(_Button.ButtonLink, {
    className: "u-ml-0 u-mb-half",
    "data-testid": "repeat-button",
    extension: "full",
    theme: "secondary",
    icon: "camera",
    label: t('Acquisition.repeat'),
    onClick: function onClick() {
      return onValid(true);
    }
  })));
};

AcquisitionResult.propTypes = {
  currentFile: _propTypes.default.object.isRequired,
  setCurrentFile: _propTypes.default.func.isRequired,
  currentStep: _PaperDefinitionsPropTypes.PaperDefinitionsStepPropTypes
};

var _default = /*#__PURE__*/(0, _react.memo)(AcquisitionResult);

exports.default = _default;