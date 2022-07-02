"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _cozyClient = require("cozy-client");

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _Fab = _interopRequireDefault(require("cozy-ui/transpiled/react/Fab"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _withLocales = _interopRequireDefault(require("../../locales/withLocales"));

var _ActionMenuWrapper = _interopRequireDefault(require("../Actions/ActionMenuWrapper"));

var _utils = require("../Actions/utils");

var _ActionsItems = require("../Actions/ActionsItems");

var _select = require("../Actions/Items/select");

var _createPaper = require("../Actions/Items/createPaper");

var _excluded = ["t", "className"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)(function () {
  return {
    fab: {
      position: 'fixed',
      zIndex: 10,
      bottom: '1rem',
      right: function right(isDesktop) {
        return isDesktop ? '6rem' : '1rem';
      }
    }
  };
});

var PapersFab = function PapersFab(_ref) {
  var t = _ref.t,
      className = _ref.className,
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      generalOptions = _useState2[0],
      setGeneralOptions = _useState2[1];

  var actionBtnRef = (0, _react.useRef)();

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isDesktop = _useBreakpoints.isDesktop;

  var classes = useStyles(isDesktop);
  var client = (0, _cozyClient.useClient)();

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
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Fab.default, (0, _extends2.default)({
    color: "primary",
    "aria-label": t('Home.Fab.ariaLabel'),
    className: (0, _classnames.default)(classes.fab, className),
    onClick: toggleActionsMenu
  }, props), /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "plus"
  })), generalOptions && /*#__PURE__*/_react.default.createElement(_ActionMenuWrapper.default, {
    onClose: hideActionsMenu,
    ref: actionBtnRef
  }, /*#__PURE__*/_react.default.createElement(_ActionsItems.ActionsItems, {
    actions: actions
  })));
};

var _default = (0, _withLocales.default)(PapersFab);

exports.default = _default;