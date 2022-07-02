"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Button = _interopRequireDefault(require("cozy-ui/transpiled/react/Button"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ConfirmReplaceFile = function ConfirmReplaceFile(_ref) {
  var onReplace = _ref.onReplace,
      onClose = _ref.onClose,
      cozyFilesCount = _ref.cozyFilesCount;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var onClickReplace = (0, _react.useCallback)(function (isReplaced) {
    return function () {
      onReplace(isReplaced);
      onClose();
    };
  }, [onClose, onReplace]);
  return /*#__PURE__*/_react.default.createElement(_CozyDialogs.ConfirmDialog, {
    open: true,
    onClose: onClose,
    title: t('ConfirmReplaceFile.title', {
      smart_count: cozyFilesCount
    }),
    content: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      dangerouslySetInnerHTML: {
        __html: t('ConfirmReplaceFile.content')
      }
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, null, t('ConfirmReplaceFile.question', {
      smart_count: cozyFilesCount
    }))),
    actions: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      theme: "secondary",
      onClick: onClickReplace(false),
      label: t('ConfirmReplaceFile.keep')
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      theme: "primary",
      onClick: onClickReplace(true),
      label: t('ConfirmReplaceFile.replace')
    }))
  });
};

ConfirmReplaceFile.propTypes = {
  onReplace: _propTypes.default.object.isRequired,
  onClose: _propTypes.default.func.isRequired,
  nbOfCozyFiles: _propTypes.default.number.isRequired
};

var _default = /*#__PURE__*/(0, _react.memo)(ConfirmReplaceFile);

exports.default = _default;