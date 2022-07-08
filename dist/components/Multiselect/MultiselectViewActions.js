"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _useRealtime2 = _interopRequireDefault(require("cozy-realtime/dist/useRealtime"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _Backdrop = _interopRequireDefault(require("cozy-ui/transpiled/react/Backdrop"));

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _Progress = require("cozy-ui/transpiled/react/Progress");

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _useBreakpoints2 = _interopRequireDefault(require("cozy-ui/transpiled/react/hooks/useBreakpoints"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _utils = require("../Actions/utils");

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var _doctypes = require("../../doctypes");

var _fetchCurrentUser = require("../../helpers/fetchCurrentUser");

var _getFolderWithReference = _interopRequireDefault(require("../../helpers/getFolderWithReference"));

var _ForwardModal = _interopRequireDefault(require("./ForwardModal"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getDisplayName = _cozyClient.models.contact.getDisplayName;
var useStyles = (0, _makeStyles.default)(function (theme) {
  return {
    backdropRoot: {
      zIndex: 'var(--zIndex-modal)'
    },
    barText: {
      color: 'var(--primaryContrastTextColor)'
    },
    bar: {
      borderRadius: theme.shape.borderRadius
    },
    barBackgroundColorPrimary: {
      backgroundColor: 'var(--secondaryTextColor)'
    },
    barBackgroundActiveColorPrimary: {
      backgroundColor: 'var(--primaryContrastTextColor)'
    }
  };
});

var MultiselectViewActions = function MultiselectViewActions(_ref) {
  var onClose = _ref.onClose;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t,
      f = _useI18n.f;

  var client = (0, _cozyClient.useClient)();
  var classes = useStyles();

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      allMultiSelectionFiles = _useMultiSelection.allMultiSelectionFiles;

  var _useBreakpoints = (0, _useBreakpoints2.default)(),
      isMobile = _useBreakpoints.isMobile;

  var _useState = (0, _react.useState)({
    name: '',
    dirId: ''
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      zipFolder = _useState2[0],
      setZipFolder = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isForwardModalOpen = _useState4[0],
      setIsForwardModalOpen = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      isBackdropOpen = _useState6[0],
      setIsBackdropOpen = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      fileToForward = _useState8[0],
      setFileToForward = _useState8[1];

  var onFileCreate = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(file) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (file && file.name === zipFolder.name && file.dir_id === zipFolder.dirId) {
                setIsBackdropOpen(false);
                setIsForwardModalOpen(true);
                setFileToForward(file);
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function onFileCreate(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  (0, _useRealtime2.default)(client, (0, _defineProperty2.default)({}, _doctypes.FILES_DOCTYPE, {
    created: onFileCreate
  }));

  var download = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _utils.downloadFiles)(client, allMultiSelectionFiles);

            case 2:
              onClose();

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function download() {
      return _ref3.apply(this, arguments);
    };
  }();

  var forward = /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
      var currentUser, defaultZipFolderName, _yield$getOrCreateApp, parentFolderId, zipName;

      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(allMultiSelectionFiles.length === 1)) {
                _context3.next = 5;
                break;
              }

              _context3.next = 3;
              return (0, _utils.forwardFile)(client, allMultiSelectionFiles, t);

            case 3:
              _context3.next = 18;
              break;

            case 5:
              setIsBackdropOpen(true);
              _context3.next = 8;
              return (0, _fetchCurrentUser.fetchCurrentUser)(client);

            case 8:
              currentUser = _context3.sent;
              defaultZipFolderName = t('Multiselect.folderZipName', {
                contactName: getDisplayName(currentUser),
                date: f(Date.now(), 'YYYY.MM.DD')
              });
              _context3.next = 12;
              return (0, _getFolderWithReference.default)(client, t);

            case 12:
              _yield$getOrCreateApp = _context3.sent;
              parentFolderId = _yield$getOrCreateApp._id;
              _context3.next = 16;
              return (0, _utils.makeZipFolder)({
                client: client,
                files: allMultiSelectionFiles,
                zipFolderName: defaultZipFolderName,
                dirId: parentFolderId
              });

            case 16:
              zipName = _context3.sent;
              setZipFolder({
                name: zipName,
                dirId: parentFolderId
              });

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function forward() {
      return _ref4.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Backdrop.default, {
    classes: {
      root: classes.backdropRoot
    },
    open: isBackdropOpen
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "u-w-100 u-mh-2 u-ta-center"
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    classes: {
      root: classes.barText
    },
    className: "u-mb-1"
  }, t('Multiselect.backdrop')), /*#__PURE__*/_react.default.createElement(_Progress.LinearProgress, {
    classes: {
      root: classes.bar,
      colorPrimary: classes.barBackgroundColorPrimary,
      barColorPrimary: classes.barBackgroundActiveColorPrimary
    }
  }))), !isMobile || isMobile && !navigator.share && /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    variant: "secondary",
    label: t('action.download'),
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "download"
    }),
    onClick: download,
    disabled: allMultiSelectionFiles.length === 0
  }), isMobile && navigator.share && /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    variant: "secondary",
    label: t('action.forward'),
    startIcon: /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "paperplane"
    }),
    onClick: forward,
    disabled: allMultiSelectionFiles.length === 0
  }), isForwardModalOpen && /*#__PURE__*/_react.default.createElement(_ForwardModal.default, {
    onClose: function onClose() {
      return setIsForwardModalOpen(false);
    },
    onForward: onClose,
    fileToForward: fileToForward
  }));
};

MultiselectViewActions.propTypes = {
  onClose: _propTypes.default.func
};
var _default = MultiselectViewActions;
exports.default = _default;