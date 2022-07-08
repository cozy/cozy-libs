"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _InputGroup = _interopRequireDefault(require("cozy-ui/transpiled/react/InputGroup"));

var _Input = _interopRequireDefault(require("cozy-ui/transpiled/react/Input"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)(function (theme) {
  return {
    input: {
      borderRadius: '25px',
      height: '40px',
      boxShadow: theme.shadows[1],
      border: '1px solid transparent',
      '&:hover, &:focus, &:active': {
        border: '1px solid transparent',
        boxShadow: theme.shadows[6]
      },
      '& input': {
        borderRadius: '25px',
        height: '38px'
      }
    }
  };
});

var SearchInput = function SearchInput(_ref) {
  var setSearchValue = _ref.setSearchValue,
      setIsSearchValueFocus = _ref.setIsSearchValueFocus;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var styles = useStyles();
  var delayedSetSearchValue = (0, _react.useMemo)(function () {
    return (0, _debounce.default)(function (searchValue) {
      return setSearchValue(searchValue);
    }, 375);
  }, [setSearchValue]);

  var handleOnChange = function handleOnChange(ev) {
    delayedSetSearchValue(ev.target.value);
  };

  return /*#__PURE__*/_react.default.createElement(_InputGroup.default, {
    className: "".concat(styles.input, " u-mr-0-s u-mr-1 u-maw-100 "),
    prepend: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      className: "u-pl-1",
      icon: "magnifier",
      color: "var(--secondaryTextColor)"
    })
  }, /*#__PURE__*/_react.default.createElement(_Input.default, {
    "data-testid": "SearchInput",
    placeholder: t('common.search'),
    onChange: handleOnChange,
    onFocus: function onFocus() {
      return setIsSearchValueFocus(true);
    }
  }));
};

SearchInput.propTypes = {
  setSearchValue: _propTypes.default.func,
  setIsSearchValueFocus: _propTypes.default.func
};
var _default = SearchInput;
exports.default = _default;