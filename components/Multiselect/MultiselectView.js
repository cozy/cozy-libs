"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _CozyDialogs = require("cozy-ui/transpiled/react/CozyDialogs");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _MultiselectContent = _interopRequireDefault(require("./MultiselectContent"));

var _MultiselectViewActions = _interopRequireDefault(require("./MultiselectViewActions"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MultiselectView = function MultiselectView() {
  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var history = (0, _reactRouterDom.useHistory)();
  var location = (0, _reactRouterDom.useLocation)();

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      setIsMultiSelectionActive = _useMultiSelection.setIsMultiSelectionActive;

  var backgroundPath = new URLSearchParams(location.search).get('backgroundPath');
  (0, _react.useEffect)(function () {
    setIsMultiSelectionActive(true);
  }, [setIsMultiSelectionActive, history]);

  var handleClose = function handleClose() {
    history.push(backgroundPath || '/paper');
    setIsMultiSelectionActive(false);
  };

  return /*#__PURE__*/_react.default.createElement(_CozyDialogs.FixedDialog, {
    open: true,
    transitionDuration: 0,
    onClose: handleClose,
    title: t('Multiselect.title.default'),
    content: /*#__PURE__*/_react.default.createElement(_MultiselectContent.default, null),
    actions: /*#__PURE__*/_react.default.createElement(_MultiselectViewActions.default, {
      onClose: handleClose
    })
  });
};

var _default = MultiselectView;
exports.default = _default;