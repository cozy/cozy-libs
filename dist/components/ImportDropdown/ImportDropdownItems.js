"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _cozyClient = require("cozy-client");

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Icon = _interopRequireWildcard(require("cozy-ui/transpiled/react/Icon"));

var _ActionMenu = require("cozy-ui/transpiled/react/ActionMenu");

var _AppLinker = _interopRequireDefault(require("cozy-ui/transpiled/react/AppLinker"));

var _Link = _interopRequireDefault(require("cozy-ui/transpiled/react/Link"));

var _Konnectors = _interopRequireDefault(require("../../assets/icons/Konnectors.svg"));

var _getStoreWebLinkByKonnector = require("../../helpers/getStoreWebLinkByKonnector");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var useStyles = (0, _makeStyles.default)(function (theme) {
  return {
    disabledItem: {
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'initial'
      }
    },
    icon: {
      margin: '0 4px'
    },
    disabledIcon: {
      fill: theme.palette.text.disabled
    },
    disabledTypography: {
      color: theme.palette.text.disabled
    }
  };
});

var ImportDropdownItems = function ImportDropdownItems(_ref) {
  var placeholder = _ref.placeholder,
      onClick = _ref.onClick;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var client = (0, _cozyClient.useClient)();
  var styles = useStyles();
  var acquisitionStepsLength = placeholder.acquisitionSteps.length,
      _placeholder$connecto = placeholder.connectorCriteria;
  _placeholder$connecto = _placeholder$connecto === void 0 ? {} : _placeholder$connecto;
  var konnectorCategory = _placeholder$connecto.category,
      konnectorName = _placeholder$connecto.name;
  var hasSteps = acquisitionStepsLength > 0;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ActionMenu.ActionMenuItem, {
    className: (0, _classnames.default)('u-flex-items-center', (0, _defineProperty2.default)({}, styles.disabledItem, !hasSteps)),
    onClick: hasSteps ? onClick : null,
    left: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      className: (0, _classnames.default)(styles.icon, (0, _defineProperty2.default)({}, styles.disabledIcon, !hasSteps)),
      icon: "camera",
      size: 16
    })
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: (0, _classnames.default)((0, _defineProperty2.default)({}, styles.disabledTypography, !hasSteps)),
    gutterBottom: true
  }, t('ImportDropdown.scanPicture.title')), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: (0, _classnames.default)((0, _defineProperty2.default)({}, styles.disabledTypography, !hasSteps)),
    variant: "caption",
    color: "textSecondary"
  }, t('ImportDropdown.scanPicture.text'))), /*#__PURE__*/_react.default.createElement(_AppLinker.default, {
    app: {
      slug: 'store'
    },
    href: (0, _getStoreWebLinkByKonnector.getStoreWebLinkByKonnector)({
      konnectorName: konnectorName,
      konnectorCategory: konnectorCategory,
      client: client
    })
  }, function (_ref2) {
    var href = _ref2.href,
        onClick = _ref2.onClick;
    return /*#__PURE__*/_react.default.createElement(_ActionMenu.ActionMenuItem, {
      className: (0, _classnames.default)('u-flex-items-center'),
      left: /*#__PURE__*/_react.default.createElement(_Icon.default, {
        icon: _Konnectors.default,
        size: 24
      })
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      href: href,
      onClick: onClick,
      target: "_blank",
      style: {
        padding: 0,
        whiteSpace: 'normal'
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      gutterBottom: true
    }, t('ImportDropdown.importAuto.title')), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      color: "textSecondary"
    }, t('ImportDropdown.importAuto.text'))));
  }));
};

ImportDropdownItems.propTypes = {
  placeholder: _propTypes.default.shape({
    label: _propTypes.default.string,
    icon: _Icon.iconPropType,
    acquisitionSteps: _propTypes.default.array.isRequired,
    connectorCriteria: _propTypes.default.shape({
      name: _propTypes.default.string,
      category: _propTypes.default.string
    })
  }).isRequired,
  onClick: _propTypes.default.func
};
var _default = ImportDropdownItems;
exports.default = _default;