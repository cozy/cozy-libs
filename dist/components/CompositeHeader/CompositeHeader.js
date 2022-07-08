"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _isArray = _interopRequireDefault(require("lodash/isArray"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Icon = require("cozy-ui/transpiled/react/Icon");

var _CompositeHeaderImage = _interopRequireDefault(require("./CompositeHeaderImage"));

var _excluded = ["icon", "fallbackIcon", "iconSize", "title", "text", "className"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)(function () {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%',
      maxWidth: '100%',
      margin: '2rem 0 1rem',
      '&.is-focused': {
        height: 'initial'
      },
      '& img': {
        width: 'fit-content',
        margin: '0 auto'
      }
    }
  };
});

var CompositeHeader = function CompositeHeader(_ref) {
  var _cx;

  var icon = _ref.icon,
      fallbackIcon = _ref.fallbackIcon,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? 'large' : _ref$iconSize,
      Title = _ref.title,
      Text = _ref.text,
      className = _ref.className,
      restProps = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var styles = useStyles();
  return /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
    className: (0, _classnames.default)(styles.container, className)
  }, restProps), /*#__PURE__*/_react.default.createElement(_CompositeHeaderImage.default, {
    icon: icon,
    fallbackIcon: fallbackIcon,
    iconSize: iconSize
  }), Title && ( /*#__PURE__*/(0, _react.isValidElement)(Title) ? Title : /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    color: "textPrimary",
    className: "u-mh-2"
  }, Title)), Text && ( /*#__PURE__*/(0, _react.isValidElement)(Text) || (0, _isArray.default)(Text) ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)((_cx = {}, (0, _defineProperty2.default)(_cx, 'u-mt-1', !isMobile || (0, _isArray.default)(Text) && Text.length <= 1), (0, _defineProperty2.default)(_cx, 'u-mt-1 u-mah-5 u-pv-1 u-ov-scroll', isMobile && (0, _isArray.default)(Text) && Text.length > 1), _cx))
  }, Text) : /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: "u-mt-1"
  }, Text)));
};

CompositeHeader.propTypes = {
  icon: _Icon.iconPropType,
  fallbackIcon: _Icon.iconPropType,
  iconSize: _propTypes.default.oneOf(['small', 'medium', 'large']),
  title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
  text: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object, _propTypes.default.arrayOf(_propTypes.default.node)]),
  className: _propTypes.default.string
};
var _default = CompositeHeader;
exports.default = _default;