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

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _Icon = _interopRequireWildcard(require("cozy-ui/transpiled/react/Icon"));

var _IlluCovidVaccineCertificate = _interopRequireDefault(require("../../assets/images/IlluCovidVaccineCertificate.png"));

var _IlluDiploma = _interopRequireDefault(require("../../assets/images/IlluDiploma.png"));

var _IlluDriverLicenseBack = _interopRequireDefault(require("../../assets/images/IlluDriverLicenseBack.png"));

var _IlluDriverLicenseFront = _interopRequireDefault(require("../../assets/images/IlluDriverLicenseFront.png"));

var _IlluDriverLicenseNumberHelp = _interopRequireDefault(require("../../assets/images/IlluDriverLicenseNumberHelp.png"));

var _IlluDriverLicenseObtentionDateHelp = _interopRequireDefault(require("../../assets/images/IlluDriverLicenseObtentionDateHelp.png"));

var _IlluIBAN = _interopRequireDefault(require("../../assets/images/IlluIBAN.png"));

var _IlluIdCardBack = _interopRequireDefault(require("../../assets/images/IlluIdCardBack.png"));

var _IlluIdCardExpirationDateHelp = _interopRequireDefault(require("../../assets/images/IlluIdCardExpirationDateHelp.png"));

var _IlluIdCardFront = _interopRequireDefault(require("../../assets/images/IlluIdCardFront.png"));

var _IlluIdCardNumberHelp = _interopRequireDefault(require("../../assets/images/IlluIdCardNumberHelp.png"));

var _IlluInvoice = _interopRequireDefault(require("../../assets/images/IlluInvoice.png"));

var _IlluResidencePermitBack = _interopRequireDefault(require("../../assets/images/IlluResidencePermitBack.png"));

var _IlluResidencePermitExpirationDateHelp = _interopRequireDefault(require("../../assets/images/IlluResidencePermitExpirationDateHelp.png"));

var _IlluResidencePermitFront = _interopRequireDefault(require("../../assets/images/IlluResidencePermitFront.png"));

var _IlluResidencePermitNumberHelp = _interopRequireDefault(require("../../assets/images/IlluResidencePermitNumberHelp.png"));

var _IlluVehicleRegistration = _interopRequireDefault(require("../../assets/images/IlluVehicleRegistration.png"));

var _IlluGenericInputDate = _interopRequireDefault(require("../../assets/icons/IlluGenericInputDate.svg"));

var _IlluGenericInputText = _interopRequireDefault(require("../../assets/icons/IlluGenericInputText.svg"));

var _IlluGenericNewPage = _interopRequireDefault(require("../../assets/icons/IlluGenericNewPage.svg"));

var _Account = _interopRequireDefault(require("../../assets/icons/Account.svg"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var images = {
  IlluCovidVaccineCertificate: _IlluCovidVaccineCertificate.default,
  IlluDiploma: _IlluDiploma.default,
  IlluDriverLicenseBack: _IlluDriverLicenseBack.default,
  IlluDriverLicenseFront: _IlluDriverLicenseFront.default,
  IlluDriverLicenseNumberHelp: _IlluDriverLicenseNumberHelp.default,
  IlluDriverLicenseObtentionDateHelp: _IlluDriverLicenseObtentionDateHelp.default,
  IlluIBAN: _IlluIBAN.default,
  IlluIdCardBack: _IlluIdCardBack.default,
  IlluIdCardExpirationDateHelp: _IlluIdCardExpirationDateHelp.default,
  IlluIdCardFront: _IlluIdCardFront.default,
  IlluIdCardNumberHelp: _IlluIdCardNumberHelp.default,
  IlluInvoice: _IlluInvoice.default,
  IlluResidencePermitBack: _IlluResidencePermitBack.default,
  IlluResidencePermitExpirationDateHelp: _IlluResidencePermitExpirationDateHelp.default,
  IlluResidencePermitFront: _IlluResidencePermitFront.default,
  IlluResidencePermitNumberHelp: _IlluResidencePermitNumberHelp.default,
  IlluVehicleRegistration: _IlluVehicleRegistration.default,
  IlluGenericInputDate: _IlluGenericInputDate.default,
  IlluGenericInputText: _IlluGenericInputText.default,
  IlluGenericNewPage: _IlluGenericNewPage.default,
  Account: _Account.default
};
var useStyles = (0, _makeStyles.default)(function () {
  return {
    image: {
      '&--small': {
        height: '4rem'
      },
      '&--medium': {
        height: '6rem'
      },
      '&--large': {
        height: '8rem'
      }
    }
  };
});

var CompositeHeaderImage = function CompositeHeaderImage(_ref) {
  var icon = _ref.icon,
      fallbackIcon = _ref.fallbackIcon,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? 'large' : _ref$iconSize;
  var styles = useStyles();

  if (!icon && !fallbackIcon) {
    return null;
  }

  var iconName = icon && icon.split('.')[0];
  var src = images[iconName] || fallbackIcon;
  var isBitmap = typeof src === 'string' && src.endsWith('.png');

  if (isBitmap) {
    return /*#__PURE__*/_react.default.createElement("img", {
      "data-testid": src,
      src: src,
      alt: "illustration"
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    "data-testid": src,
    className: (0, _classnames.default)('u-pb-1', (0, _defineProperty2.default)({}, "".concat(styles.image, "--").concat(iconSize), iconSize))
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: src,
    size: "100%"
  }));
};

CompositeHeaderImage.propTypes = {
  icon: _Icon.iconPropType,
  fallbackIcon: _Icon.iconPropType,
  iconSize: _propTypes.default.oneOf(['small', 'medium', 'large'])
};
var _default = CompositeHeaderImage;
exports.default = _default;