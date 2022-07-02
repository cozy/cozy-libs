"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _Dialog = _interopRequireWildcard(require("cozy-ui/transpiled/react/Dialog"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Divider = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/Divider"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _excluded = ["onClose", "onBack", "title", "content", "stepper"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)(function () {
  return {
    root: {
      padding: '0',
      margin: '0 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    typography: {
      marginTop: function marginTop(isMobile) {
        return !isMobile ? '2px' : '';
      }
    }
  };
});

var StepperDialog = function StepperDialog(_ref) {
  var onClose = _ref.onClose,
      onBack = _ref.onBack,
      title = _ref.title,
      content = _ref.content,
      stepper = _ref.stepper,
      rest = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var classes = useStyles(isMobile);

  var _useCozyDialog = (0, _CozyDialogs.useCozyDialog)(rest),
      dialogProps = _useCozyDialog.dialogProps,
      dialogTitleProps = _useCozyDialog.dialogTitleProps,
      fullScreen = _useCozyDialog.fullScreen;

  return /*#__PURE__*/_react.default.createElement(_Dialog.default, dialogProps, !fullScreen && onClose && /*#__PURE__*/_react.default.createElement(_CozyDialogs.DialogCloseButton, {
    onClick: onClose
  }), onBack && /*#__PURE__*/_react.default.createElement(_CozyDialogs.DialogBackButton, {
    onClick: onBack
  }), /*#__PURE__*/_react.default.createElement(_Dialog.DialogTitle, (0, _extends2.default)({}, dialogTitleProps, {
    className: (0, _classnames.default)('u-ellipsis u-pl-3', (0, _defineProperty2.default)({}, 'u-flex u-flex-justify-between u-flex-items-center', stepper))
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h4",
    classes: {
      h4: classes.typography
    },
    className: (0, _classnames.default)({
      'u-ml-1': !isMobile
    })
  }, title), stepper && /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    classes: {
      h6: classes.typography
    },
    className: (0, _classnames.default)({
      'u-mr-2': !isMobile
    })
  }, stepper)), /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_Dialog.DialogContent, {
    classes: {
      root: classes.root
    }
  }, content));
};

StepperDialog.propTypes = {
  open: _propTypes.default.bool.isRequired,
  onClose: _propTypes.default.func,
  onBack: _propTypes.default.func,
  title: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string]),
  content: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string]),
  size: _propTypes.default.oneOf(['small', 'medium', 'large'])
};
var _default = StepperDialog;
exports.default = _default;