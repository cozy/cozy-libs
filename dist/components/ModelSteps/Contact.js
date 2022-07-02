"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("cozy-ui/transpiled/react/ListItemText"));

var _ListItemSecondaryAction = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction"));

var _Avatar = _interopRequireDefault(require("cozy-ui/transpiled/react/Avatar"));

var _Radios = _interopRequireDefault(require("cozy-ui/transpiled/react/Radios"));

var _Checkbox = _interopRequireDefault(require("cozy-ui/transpiled/react/Checkbox"));

var getFullname = _cozyClient.models.contact.getFullname;
var styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
};

var Contact = function Contact(_ref) {
  var contact = _ref.contact,
      multiple = _ref.multiple,
      contactIdsSelected = _ref.contactIdsSelected,
      setContactIdsSelected = _ref.setContactIdsSelected;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var onClickContactLine = function onClickContactLine(val) {
    var _val$target;

    var newValue = (val === null || val === void 0 ? void 0 : (_val$target = val.target) === null || _val$target === void 0 ? void 0 : _val$target.value) || val;

    if (multiple) {
      var newContactIdSelected = (0, _toConsumableArray2.default)(contactIdsSelected);
      var find = newContactIdSelected.indexOf(newValue);
      if (find > -1) newContactIdSelected.splice(find, 1);else newContactIdSelected.push(newValue);
      setContactIdsSelected(newContactIdSelected);
    } else {
      setContactIdsSelected([newValue]);
    }
  };

  return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    button: true,
    key: contact._id,
    onClick: function onClick() {
      return onClickContactLine(contact._id);
    }
  }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_Avatar.default, {
    size: "small",
    style: styleAvatar
  })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    primary: "".concat(getFullname(contact), " ").concat(contact.me ? "(".concat(t('ContactStep.me'), ")") : '')
  }), /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, {
    className: "u-mr-half"
  }, multiple ? /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
    checked: contactIdsSelected.includes(contact._id),
    onChange: onClickContactLine,
    value: contact._id,
    name: "checkbox-contactsList"
  }) : /*#__PURE__*/_react.default.createElement(_Radios.default, {
    checked: contactIdsSelected.includes(contact._id),
    onChange: onClickContactLine,
    value: contact._id,
    name: "radio-contactsList"
  })));
};

var _default = Contact;
exports.default = _default;