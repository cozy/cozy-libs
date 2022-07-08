"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _Home = _interopRequireDefault(require("../Home/Home"));

var _PapersListWrapper = _interopRequireDefault(require("../Papers/PapersListWrapper"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MultiselectPaperList = function MultiselectPaperList(_ref) {
  var setIsActive = _ref.setIsActive;
  var history = (0, _reactRouterDom.useHistory)();

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      selectedThemeLabel = _useState2[0],
      setSelectedThemeLabel = _useState2[1];

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      removeAllCurrentMultiSelectionFiles = _useMultiSelection.removeAllCurrentMultiSelectionFiles,
      confirmCurrentMultiSelectionFiles = _useMultiSelection.confirmCurrentMultiSelectionFiles,
      currentMultiSelectionFiles = _useMultiSelection.currentMultiSelectionFiles;

  var title = currentMultiSelectionFiles.length > 0 ? t('Multiselect.title.nbSelected', {
    smart_count: currentMultiSelectionFiles.length
  }) : t('Multiselect.title.default');

  var closeMultiSelection = function closeMultiSelection() {
    setIsActive(false);
    setSelectedThemeLabel(null);
  };

  var cancelSelection = function cancelSelection() {
    removeAllCurrentMultiSelectionFiles();
    closeMultiSelection();
  };

  var goToCurrentSelectionList = function goToCurrentSelectionList() {
    confirmCurrentMultiSelectionFiles();
    closeMultiSelection();
  };

  var handleBack = function handleBack() {
    selectedThemeLabel ? setSelectedThemeLabel(null) : cancelSelection();
  };

  return /*#__PURE__*/_react.default.createElement(_CozyDialogs.FixedDialog, {
    open: true,
    transitionDuration: 0,
    disableGutters: true,
    onClose: function onClose() {
      return setIsActive(false);
    },
    onBack: handleBack,
    title: title,
    content: !selectedThemeLabel ? /*#__PURE__*/_react.default.createElement(_Home.default, {
      setSelectedThemeLabel: setSelectedThemeLabel
    }) : /*#__PURE__*/_react.default.createElement(_PapersListWrapper.default, {
      history: history,
      selectedThemeLabel: selectedThemeLabel
    }),
    actions: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
      label: t('common.add'),
      onClick: goToCurrentSelectionList,
      disabled: currentMultiSelectionFiles.length === 0
    }), /*#__PURE__*/_react.default.createElement(_Buttons.default, {
      label: t('common.cancel'),
      variant: "secondary",
      onClick: cancelSelection
    }))
  });
};

MultiselectPaperList.propTypes = {
  setIsActive: _propTypes.default.func
};
var _default = MultiselectPaperList;
exports.default = _default;