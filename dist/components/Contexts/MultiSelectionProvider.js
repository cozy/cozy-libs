"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MultiSelectionProvider = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var MultiSelectionContext = /*#__PURE__*/(0, _react.createContext)();

var MultiSelectionProvider = function MultiSelectionProvider(_ref) {
  var children = _ref.children;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isMultiSelectionActive = _useState2[0],
      setIsMultiSelectionActive = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      allMultiSelectionFiles = _useState4[0],
      setAllMultiSelectionFiles = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      currentMultiSelectionFiles = _useState6[0],
      setCurrentMultiSelectionFiles = _useState6[1];

  var confirmCurrentMultiSelectionFiles = function confirmCurrentMultiSelectionFiles() {
    removeAllCurrentMultiSelectionFiles();

    var _iterator = _createForOfIteratorHelper(currentMultiSelectionFiles),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var file = _step.value;
        addMultiSelectionFile(file);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  var changeCurrentMultiSelectionFile = function changeCurrentMultiSelectionFile(fileToAdd) {
    var fileAlreadySelected = currentMultiSelectionFiles.some(function (file) {
      return file._id === fileToAdd._id;
    });
    if (fileAlreadySelected) removeCurrentMultiSelectionFile(fileToAdd);else setCurrentMultiSelectionFiles(function (files) {
      return [].concat((0, _toConsumableArray2.default)(files), [fileToAdd]);
    });
  };

  var removeCurrentMultiSelectionFile = function removeCurrentMultiSelectionFile(fileToRemove) {
    setCurrentMultiSelectionFiles(function (files) {
      return files.filter(function (file) {
        return file._id !== fileToRemove._id;
      });
    });
  };

  var removeAllCurrentMultiSelectionFiles = function removeAllCurrentMultiSelectionFiles() {
    setCurrentMultiSelectionFiles([]);
  };

  var addMultiSelectionFile = function addMultiSelectionFile(fileToAdd) {
    setAllMultiSelectionFiles(function (files) {
      return [].concat((0, _toConsumableArray2.default)(files), [fileToAdd]);
    });
  };

  var removeMultiSelectionFile = function removeMultiSelectionFile(fileToRemoveIndex) {
    setAllMultiSelectionFiles(function (files) {
      return files.filter(function (_, idx) {
        return fileToRemoveIndex !== idx;
      });
    });
  };

  var removeAllMultiSelectionFiles = function removeAllMultiSelectionFiles() {
    setAllMultiSelectionFiles([]);
  };

  (0, _react.useEffect)(function () {
    // Resets the context by exiting the multi-selection mode
    if (!isMultiSelectionActive) {
      removeAllMultiSelectionFiles();
      removeAllCurrentMultiSelectionFiles();
    }
  }, [isMultiSelectionActive]);
  var value = {
    isMultiSelectionActive: isMultiSelectionActive,
    allMultiSelectionFiles: allMultiSelectionFiles,
    setIsMultiSelectionActive: setIsMultiSelectionActive,
    addMultiSelectionFile: addMultiSelectionFile,
    removeMultiSelectionFile: removeMultiSelectionFile,
    removeAllMultiSelectionFiles: removeAllMultiSelectionFiles,
    currentMultiSelectionFiles: currentMultiSelectionFiles,
    removeAllCurrentMultiSelectionFiles: removeAllCurrentMultiSelectionFiles,
    confirmCurrentMultiSelectionFiles: confirmCurrentMultiSelectionFiles,
    changeCurrentMultiSelectionFile: changeCurrentMultiSelectionFile,
    removeCurrentMultiSelectionFile: removeCurrentMultiSelectionFile
  };
  return /*#__PURE__*/_react.default.createElement(MultiSelectionContext.Provider, {
    value: value
  }, children);
};

exports.MultiSelectionProvider = MultiSelectionProvider;
var _default = MultiSelectionContext;
exports.default = _default;