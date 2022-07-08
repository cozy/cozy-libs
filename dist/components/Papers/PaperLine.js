"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _ActionMenu = require("cozy-ui/transpiled/react/ActionMenu");

var _Filename = _interopRequireDefault(require("cozy-ui/transpiled/react/Filename"));

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _ActionsItems = require("../Actions/ActionsItems");

var _ActionMenuWrapper = _interopRequireDefault(require("../Actions/ActionMenuWrapper"));

var _PaperItem = _interopRequireDefault(require("../Papers/PaperItem"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var splitFilename = _cozyClient.models.file.splitFilename;

var PaperLine = function PaperLine(_ref) {
  var paper = _ref.paper,
      divider = _ref.divider,
      actions = _ref.actions;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var actionBtnRef = (0, _react.useRef)();

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      optionFile = _useState2[0],
      setOptionFile = _useState2[1];

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      isMultiSelectionActive = _useMultiSelection.isMultiSelectionActive;

  var hideActionsMenu = function hideActionsMenu() {
    return setOptionFile(false);
  };

  var toggleActionsMenu = function toggleActionsMenu() {
    return setOptionFile(function (prev) {
      return !prev;
    });
  };

  var _splitFilename = splitFilename({
    name: paper.name,
    type: 'file'
  }),
      filename = _splitFilename.filename,
      extension = _splitFilename.extension;

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_PaperItem.default, (0, _extends2.default)({
    paper: paper,
    divider: divider
  }, isMultiSelectionActive && {
    withCheckbox: true
  }), !isMultiSelectionActive && /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    ref: actionBtnRef,
    onClick: toggleActionsMenu
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "dots"
  }))), optionFile && /*#__PURE__*/_react.default.createElement(_ActionMenuWrapper.default, {
    onClose: hideActionsMenu,
    ref: actionBtnRef
  }, isMobile && /*#__PURE__*/_react.default.createElement(_ActionMenu.ActionMenuHeader, null, /*#__PURE__*/_react.default.createElement(_Filename.default, {
    icon: "file-type-pdf",
    filename: filename,
    extension: extension
  })), /*#__PURE__*/_react.default.createElement(_ActionsItems.ActionsItems, {
    actions: actions,
    file: paper
  })));
};

PaperLine.propTypes = {
  paper: _propTypes.default.object.isRequired,
  divider: _propTypes.default.bool,
  actions: _propTypes.default.array
};

var _default = /*#__PURE__*/(0, _react.memo)(PaperLine);

exports.default = _default;