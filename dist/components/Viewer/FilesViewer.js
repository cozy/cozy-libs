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

var _cozyClient = require("cozy-client");

var _cozyDeviceHelper = require("cozy-device-helper");

var _Overlay = _interopRequireDefault(require("cozy-ui/transpiled/react/Overlay"));

var _Viewer = _interopRequireDefault(require("cozy-ui/transpiled/react/Viewer"));

var _FooterActionButtons = _interopRequireDefault(require("cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons"));

var _ForwardOrDownloadButton = _interopRequireDefault(require("cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton"));

var _FileViewerLoading = _interopRequireDefault(require("./FileViewerLoading"));

var _SelectFileButton = _interopRequireDefault(require("./SelectFileButton"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var styleStatusBar = function styleStatusBar(switcher) {
  if (window.StatusBar && (0, _cozyDeviceHelper.isIOSApp)()) {
    if (switcher) {
      window.StatusBar.backgroundColorByHexString('var(--primaryTextColor)');
      window.StatusBar.styleLightContent();
    } else {
      window.StatusBar.backgroundColorByHexString('var(--primaryContrastTextColor)');
      window.StatusBar.styleDefault();
    }
  }
};

var FilesViewer = function FilesViewer(_ref) {
  var filesQuery = _ref.filesQuery,
      files = _ref.files,
      fileId = _ref.fileId,
      onClose = _ref.onClose,
      onChange = _ref.onChange;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      currentFile = _useState2[0],
      setCurrentFile = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      fetchingMore = _useState4[0],
      setFetchingMore = _useState4[1];

  var client = (0, _cozyClient.useClient)();
  var handleOnClose = (0, _react.useCallback)(function () {
    if (onClose) onClose();
  }, [onClose]);
  var handleOnChange = (0, _react.useCallback)(function (nextFile) {
    if (onChange) onChange(nextFile.id);
  }, [onChange]);
  var currentIndex = (0, _react.useMemo)(function () {
    return files.findIndex(function (f) {
      return f.id === fileId;
    });
  }, [files, fileId]);
  var hasCurrentIndex = (0, _react.useMemo)(function () {
    return currentIndex != -1;
  }, [currentIndex]);
  var viewerFiles = (0, _react.useMemo)(function () {
    return hasCurrentIndex ? files : [currentFile];
  }, [hasCurrentIndex, files, currentFile]);
  var viewerIndex = (0, _react.useMemo)(function () {
    return hasCurrentIndex ? currentIndex : 0;
  }, [hasCurrentIndex, currentIndex]);
  (0, _react.useEffect)(function () {
    styleStatusBar(true);
    return function () {
      styleStatusBar(false);
    };
  }, []);
  (0, _react.useEffect)(function () {
    var isMounted = true; // If we can't find the file in the loaded files, that's probably because the user
    // is trying to open a direct link to a file that wasn't in the first 50 files of
    // the containing folder (it comes from a fetchMore...) ; we load the file attributes
    // directly as a contingency measure

    var fetchFileIfNecessary = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _yield$client$query, data;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(currentIndex !== -1)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                if (currentFile && isMounted) {
                  setCurrentFile(null);
                }

                _context.prev = 3;
                _context.next = 6;
                return client.query((0, _cozyClient.Q)('io.cozy.files').getById(fileId));

              case 6:
                _yield$client$query = _context.sent;
                data = _yield$client$query.data;
                isMounted && setCurrentFile(data);
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](3);
                handleOnClose();

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 11]]);
      }));

      return function fetchFileIfNecessary() {
        return _ref2.apply(this, arguments);
      };
    }();

    fetchFileIfNecessary();
    return function () {
      isMounted = false;
    };
  }, [client, currentFile, fileId, currentIndex, handleOnClose]);
  (0, _react.useEffect)(function () {
    var isMounted = true; // If we get close of the last file fetched, but we know there are more in the folder
    // (it shouldn't happen in /recent), we fetch more files

    var fetchMoreIfNecessary = /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var fileCount, _currentIndex;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!fetchingMore) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                setFetchingMore(true);
                _context2.prev = 3;
                fileCount = filesQuery.count;
                _currentIndex = files.findIndex(function (f) {
                  return f.id === fileId;
                });

                if (!(files.length !== fileCount && files.length - _currentIndex <= 5 && isMounted)) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 9;
                return filesQuery.fetchMore();

              case 9:
                _context2.prev = 9;
                setFetchingMore(false);
                return _context2.finish(9);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3,, 9, 12]]);
      }));

      return function fetchMoreIfNecessary() {
        return _ref3.apply(this, arguments);
      };
    }();

    fetchMoreIfNecessary();
    return function () {
      isMounted = false;
    };
  }, [fetchingMore, filesQuery.count, files.length, fileId, filesQuery, files]); // If we can't find the file, we fallback to the (potentially loading)
  // direct stat made by the viewer

  if (currentIndex === -1 && !currentFile) {
    return /*#__PURE__*/_react.default.createElement(_FileViewerLoading.default, null);
  }

  return /*#__PURE__*/_react.default.createElement(_Overlay.default, null, /*#__PURE__*/_react.default.createElement(_Viewer.default, {
    files: viewerFiles,
    currentIndex: viewerIndex,
    onChangeRequest: handleOnChange,
    onCloseRequest: handleOnClose
  }, /*#__PURE__*/_react.default.createElement(_FooterActionButtons.default, null, /*#__PURE__*/_react.default.createElement(_ForwardOrDownloadButton.default, null), /*#__PURE__*/_react.default.createElement(_SelectFileButton.default, {
    file: viewerFiles[viewerIndex]
  }))));
};

var _default = FilesViewer;
exports.default = _default;