"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Paper = _interopRequireDefault(require("cozy-ui/transpiled/react/Paper"));

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("cozy-ui/transpiled/react/ListItemText"));

var _Divider = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/Divider"));

var _Avatar = _interopRequireDefault(require("cozy-ui/transpiled/react/Avatar"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _ContactsListModal = _interopRequireDefault(require("cozy-ui/transpiled/react/ContactsListModal"));

var _useFormData2 = require("../Hooks/useFormData");

var _useSessionstorage3 = require("../Hooks/useSessionstorage");

var _Contact = _interopRequireDefault(require("./Contact"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
};

var ContactList = function ContactList(_ref) {
  var multiple = _ref.multiple,
      currentUser = _ref.currentUser,
      contactIdsSelected = _ref.contactIdsSelected,
      setContactIdsSelected = _ref.setContactIdsSelected;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useFormData = (0, _useFormData2.useFormData)(),
      setFormData = _useFormData.setFormData;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      contactModalOpened = _useState2[0],
      setContactModalOpened = _useState2[1];

  var _useSessionstorage = (0, _useSessionstorage3.useSessionstorage)('contactList', []),
      _useSessionstorage2 = (0, _slicedToArray2.default)(_useSessionstorage, 2),
      contactsLocalSession = _useSessionstorage2[0],
      setContactLocalSession = _useSessionstorage2[1];

  var _useState3 = (0, _react.useState)([currentUser].concat((0, _toConsumableArray2.default)(contactsLocalSession))),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      contactsList = _useState4[0],
      setContactsList = _useState4[1];

  (0, _react.useEffect)(function () {
    setContactIdsSelected(function (prev) {
      if (prev.length === 0) {
        return [currentUser._id];
      }
    });
  }, [setContactIdsSelected, currentUser._id]);
  (0, _react.useEffect)(function () {
    setFormData(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        contacts: contactsList.filter(function (contact) {
          return contactIdsSelected.includes(contact._id);
        })
      });
    });
  }, [contactIdsSelected, contactsList, setFormData]);

  var onClickContactsListModal = function onClickContactsListModal(contact) {
    var contactAlreadyListed = contactsList.some(function (cl) {
      return cl._id === contact._id;
    });

    if (!contactAlreadyListed) {
      setContactsList(function (prev) {
        return [].concat((0, _toConsumableArray2.default)(prev), [contact]);
      });
      setContactLocalSession(function (prev) {
        return [].concat((0, _toConsumableArray2.default)(prev), [contact]);
      });
    }

    setContactIdsSelected(function (prev) {
      return multiple ? [].concat((0, _toConsumableArray2.default)(prev), [contact._id]) : [contact._id];
    });
    setContactModalOpened(false);
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Paper.default, {
    elevation: 2,
    className: "u-mt-1 u-mh-half"
  }, /*#__PURE__*/_react.default.createElement(_List.default, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "u-mah-5 u-ov-auto"
  }, contactsList.map(function (contact) {
    return /*#__PURE__*/_react.default.createElement(_Contact.default, {
      key: contact._id,
      contact: contact,
      multiple: multiple,
      contactIdsSelected: contactIdsSelected,
      setContactIdsSelected: setContactIdsSelected
    });
  })), /*#__PURE__*/_react.default.createElement(_Divider.default, {
    variant: "inset",
    component: "li"
  }), /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    button: true,
    onClick: function onClick() {
      return setContactModalOpened(true);
    }
  }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_Avatar.default, {
    size: "small",
    style: styleAvatar
  })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    primary: t('ContactStep.other')
  }), /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "right",
    size: 16,
    color: "var(--secondaryTextColor)"
  })))), contactModalOpened && /*#__PURE__*/_react.default.createElement(_ContactsListModal.default, {
    placeholder: t('ContactStep.contactModal.placeholder'),
    dismissAction: function dismissAction() {
      return setContactModalOpened(false);
    },
    onItemClick: function onItemClick(contact) {
      return onClickContactsListModal(contact);
    },
    addContactLabel: t('ContactStep.contactModal.addContactLabel'),
    emptyMessage: t('ContactStep.contactModal.emptyContact')
  }));
};

var _default = ContactList;
exports.default = _default;