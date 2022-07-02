"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _DialogActions = _interopRequireDefault(require("cozy-ui/transpiled/react/DialogActions"));

var _useEventListener = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useEventListener"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _useFormData2 = require("../Hooks/useFormData");

var _doctypes = require("../../doctypes");

var _const = require("../../constants/const");

var _CompositeHeader = _interopRequireDefault(require("../CompositeHeader/CompositeHeader"));

var _ConfirmReplaceFile = _interopRequireDefault(require("./widgets/ConfirmReplaceFile"));

var _ContactList = _interopRequireDefault(require("./ContactList"));

var _fetchCurrentUser = require("../../helpers/fetchCurrentUser");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ContactWrapper = function ContactWrapper(_ref) {
  var currentStep = _ref.currentStep,
      onClose = _ref.onClose;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var client = (0, _cozyClient.useClient)();
  var illustration = currentStep.illustration,
      text = currentStep.text,
      multiple = currentStep.multiple;

  var _useFormData = (0, _useFormData2.useFormData)(),
      formSubmit = _useFormData.formSubmit,
      formData = _useFormData.formData;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      onLoad = _useState2[0],
      setOnLoad = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      confirmReplaceFileModal = _useState4[0],
      setConfirmReplaceFileModal = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      currentUser = _useState6[0],
      setCurrentUser = _useState6[1];

  var _useState7 = (0, _react.useState)([]),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      contactIdsSelected = _useState8[0],
      setContactIdsSelected = _useState8[1];

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var cozyFiles = formData.data.filter(function (d) {
    return d.file.constructor === Blob;
  });

  var closeConfirmReplaceFileModal = function closeConfirmReplaceFileModal() {
    return setConfirmReplaceFileModal(false);
  };

  var openConfirmReplaceFileModal = function openConfirmReplaceFileModal() {
    return setConfirmReplaceFileModal(true);
  };

  var submit = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setOnLoad(true);
              _context.next = 3;
              return formSubmit();

            case 3:
              onClose();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function submit() {
      return _ref2.apply(this, arguments);
    };
  }();

  var onClickReplace = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(isFileReplaced) {
      var _iterator, _step, file;

      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!isFileReplaced) {
                _context2.next = 18;
                break;
              }

              _iterator = _createForOfIteratorHelper(cozyFiles);
              _context2.prev = 2;

              _iterator.s();

            case 4:
              if ((_step = _iterator.n()).done) {
                _context2.next = 10;
                break;
              }

              file = _step.value.file;
              _context2.next = 8;
              return client.destroy({
                _id: file.id,
                _type: _doctypes.FILES_DOCTYPE
              });

            case 8:
              _context2.next = 4;
              break;

            case 10:
              _context2.next = 15;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](2);

              _iterator.e(_context2.t0);

            case 15:
              _context2.prev = 15;

              _iterator.f();

              return _context2.finish(15);

            case 18:
              submit();

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 12, 15, 18]]);
    }));

    return function onClickReplace(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  var handleClick = function handleClick() {
    if (cozyFiles.length > 0) {
      if (!confirmReplaceFileModal) openConfirmReplaceFileModal();else onClickReplace(true);
    } else {
      submit();
    }
  };

  var handleKeyDown = function handleKeyDown(_ref4) {
    var key = _ref4.key;
    if (key === _const.KEYS.ENTER) handleClick();
  };

  (0, _useEventListener.default)(window, 'keydown', handleKeyDown);
  (0, _react.useEffect)(function () {
    var init = /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var myself;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _fetchCurrentUser.fetchCurrentUser)(client);

              case 2:
                myself = _context3.sent;
                setCurrentUser(myself);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function init() {
        return _ref5.apply(this, arguments);
      };
    }();

    init();
  }, [client]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_CompositeHeader.default, {
    icon: illustration,
    iconSize: "small",
    title: t(text),
    text: currentUser && /*#__PURE__*/_react.default.createElement(_ContactList.default, {
      multiple: multiple,
      currentUser: currentUser,
      contactIdsSelected: contactIdsSelected,
      setContactIdsSelected: setContactIdsSelected
    })
  }), /*#__PURE__*/_react.default.createElement(_DialogActions.default, {
    disableSpacing: true,
    className: (0, _classnames.default)('columnLayout u-mb-1-half u-mt-0 cozyDialogActions', {
      'u-mh-1': !isMobile,
      'u-mh-0': isMobile
    })
  }, /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    fullWidth: true,
    label: t(!onLoad ? 'ContactStep.save' : 'ContactStep.onLoad'),
    onClick: handleClick,
    disabled: onLoad || contactIdsSelected.length === 0,
    busy: onLoad,
    "data-testid": "ButtonSave"
  })), confirmReplaceFileModal && /*#__PURE__*/_react.default.createElement(_ConfirmReplaceFile.default, {
    onClose: closeConfirmReplaceFileModal,
    onReplace: onClickReplace,
    cozyFilesCount: cozyFiles.length
  }));
};

ContactWrapper.propTypes = {
  currentStep: _propTypes.default.shape({
    illustration: _propTypes.default.string,
    text: _propTypes.default.string
  }).isRequired,
  onClose: _propTypes.default.func.isRequired
};
var _default = ContactWrapper;
exports.default = _default;