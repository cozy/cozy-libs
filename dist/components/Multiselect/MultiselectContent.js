"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _GhostButton = _interopRequireDefault(require("./GhostButton"));

var _PaperCardItem = _interopRequireDefault(require("../Papers/PaperCardItem"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var _MultiselectPaperList = _interopRequireDefault(require("./MultiselectPaperList"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MultiselectContent = function MultiselectContent() {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isActive = _useState2[0],
      setIsActive = _useState2[1];

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      allMultiSelectionFiles = _useMultiSelection.allMultiSelectionFiles;

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "u-mb-2 u-w-100"
  }, allMultiSelectionFiles.length === 0 ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: "u-mb-1"
  }, t('Multiselect.empty')) : /*#__PURE__*/_react.default.createElement(_List.default, {
    className: "u-flex u-flex-column u-flex-justify-center"
  }, allMultiSelectionFiles.map(function (file, idx) {
    return /*#__PURE__*/_react.default.createElement(_PaperCardItem.default, {
      key: "".concat(file._id).concat(idx),
      paperIndex: idx,
      paper: file,
      className: "u-mb-half u-w-100"
    });
  })), /*#__PURE__*/_react.default.createElement(_GhostButton.default, {
    label: t('Multiselect.select'),
    fullWidth: true,
    onClick: function onClick() {
      return setIsActive(true);
    }
  }), isActive && /*#__PURE__*/_react.default.createElement(_MultiselectPaperList.default, {
    setIsActive: setIsActive
  }));
};

var _default = MultiselectContent;
exports.default = _default;