"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Button = _interopRequireDefault(require("cozy-ui/transpiled/react/Button"));

var _Empty = _interopRequireDefault(require("cozy-ui/transpiled/react/Empty"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _HomeCloud = _interopRequireDefault(require("../../assets/icons/HomeCloud.svg"));

var _doctypes = require("../../doctypes");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var Onboarding = function Onboarding() {
  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var client = (0, _cozyClient.useClient)();

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isDesktop = _useBreakpoints.isDesktop;

  var onClick = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _yield$client$query, data, settings;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return client.query((0, _cozyClient.Q)(_doctypes.SETTINGS_DOCTYPE));

            case 2:
              _yield$client$query = _context.sent;
              data = _yield$client$query.data;
              settings = (data === null || data === void 0 ? void 0 : data[0]) || {};
              _context.next = 7;
              return client.save(_objectSpread(_objectSpread({}, settings), {}, {
                onboarded: true,
                _type: _doctypes.SETTINGS_DOCTYPE
              }));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function onClick() {
      return _ref.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/_react.default.createElement(_Empty.default, {
    className: (0, _classnames.default)('u-p-1 u-flex-grow-1', {
      'u-flex-justify-start': isDesktop
    }),
    icon: _HomeCloud.default,
    iconSize: "large",
    title: t('Home.Empty.title'),
    text: t('Home.Empty.text'),
    layout: false
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    theme: "primary",
    onClick: onClick,
    label: t('Onboarding.cta'),
    className: "u-mb-1"
  }));
};

var _default = Onboarding;
exports.default = _default;