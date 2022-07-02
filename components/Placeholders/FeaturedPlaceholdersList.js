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

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListSubheader = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Placeholder = _interopRequireDefault(require("./Placeholder"));

var _ActionMenuImportDropdown = _interopRequireDefault(require("./ActionMenuImportDropdown"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)({
  root: {
    textIndent: '1rem'
  }
});

var FeaturedPlaceholdersList = function FeaturedPlaceholdersList(_ref) {
  var featuredPlaceholders = _ref.featuredPlaceholders;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      placeholder = _useState2[0],
      setPlaceholder = _useState2[1];

  var actionBtnRefs = (0, _react.useRef)([]);
  var actionBtnRef = (0, _react.useRef)();
  var classes = useStyles();

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isImportDropdownDisplayed = _useState4[0],
      setIsImportDropdownDisplayed = _useState4[1];

  var history = (0, _reactRouterDom.useHistory)();
  var location = (0, _reactRouterDom.useLocation)();

  var hideImportDropdown = function hideImportDropdown() {
    setIsImportDropdownDisplayed(false);
    setPlaceholder(null);
  };

  var redirectPaperCreation = function redirectPaperCreation(placeholder) {
    return history.push({
      pathname: "/paper/create/".concat(placeholder.label),
      search: "backgroundPath=".concat(location.pathname)
    });
  };

  var showImportDropdown = function showImportDropdown(idx) {
    return function (placeholder) {
      if (placeholder.connectorCriteria) {
        actionBtnRef.current = actionBtnRefs.current[idx];
        setIsImportDropdownDisplayed(true);
        setPlaceholder(placeholder);
      } else {
        redirectPaperCreation(placeholder);
      }
    };
  };

  return /*#__PURE__*/_react.default.createElement(_List.default, null, featuredPlaceholders.length > 0 && /*#__PURE__*/_react.default.createElement(_ListSubheader.default, {
    classes: isMobile ? classes : undefined
  }, t('FeaturedPlaceholdersList.subheader')), /*#__PURE__*/_react.default.createElement("div", {
    className: "u-pv-half"
  }, featuredPlaceholders.map(function (placeholder, idx) {
    return /*#__PURE__*/_react.default.createElement(_Placeholder.default, {
      key: idx,
      ref: function ref(el) {
        return actionBtnRefs.current[idx] = el;
      },
      placeholder: placeholder,
      divider: idx !== featuredPlaceholders.length - 1,
      onClick: showImportDropdown(idx)
    });
  }), /*#__PURE__*/_react.default.createElement(_ActionMenuImportDropdown.default, {
    isOpened: isImportDropdownDisplayed,
    placeholder: placeholder,
    onClose: hideImportDropdown,
    anchorElRef: actionBtnRef,
    onClick: function onClick() {
      return redirectPaperCreation(placeholder);
    }
  })));
};

FeaturedPlaceholdersList.propTypes = {
  featuredPlaceholders: _propTypes.default.arrayOf(_propTypes.default.object)
};
var _default = FeaturedPlaceholdersList;
exports.default = _default;