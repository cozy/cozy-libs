"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _cozyClient = require("cozy-client");

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _CozyTheme = _interopRequireDefault(require("cozy-ui/transpiled/react/CozyTheme"));

var _utils = require("../Actions/utils");

var _select = require("../Actions/Items/select");

var _createPaper = require("../Actions/Items/createPaper");

var _ActionMenuWrapper = _interopRequireDefault(require("../Actions/ActionMenuWrapper"));

var _ActionsItems = require("../Actions/ActionsItems");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* global cozy */
var MoreOptions = function MoreOptions() {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      generalOptions = _useState2[0],
      setGeneralOptions = _useState2[1];

  var actionBtnRef = (0, _react.useRef)();
  var client = (0, _cozyClient.useClient)();
  var BarRight = cozy.bar.BarRight;

  var hideActionsMenu = function hideActionsMenu() {
    return setGeneralOptions(false);
  };

  var toggleActionsMenu = function toggleActionsMenu() {
    return setGeneralOptions(function (prev) {
      return !prev;
    });
  };

  var actions = (0, _utils.makeActions)([_createPaper.createPaper, _select.select], {
    client: client,
    hideActionsMenu: hideActionsMenu
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(BarRight, null, /*#__PURE__*/_react.default.createElement(_CozyTheme.default, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    ref: actionBtnRef,
    onClick: toggleActionsMenu
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "dots"
  })))), generalOptions && /*#__PURE__*/_react.default.createElement(_ActionMenuWrapper.default, {
    onClose: hideActionsMenu,
    ref: actionBtnRef
  }, /*#__PURE__*/_react.default.createElement(_ActionsItems.ActionsItems, {
    actions: actions
  })));
};

var _default = MoreOptions;
exports.default = _default;