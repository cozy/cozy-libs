"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeImage = exports.getImageScaleRatio = exports.fileToDataUri = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * @param {HTMLImageElement} image
 * @param {number} [maxSizeInPixel=900] - Max size in pixel
 * @returns {number}
 */
var getImageScaleRatio = function getImageScaleRatio(image) {
  var maxSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 900;
  var longerSideSizeInPixel = Math.max(image.height, image.width);
  var scaleRatio = 1;

  if (maxSize < longerSideSizeInPixel) {
    scaleRatio = maxSize / longerSideSizeInPixel;
  }

  return scaleRatio;
};
/**
 * @param {string} fileDataUri
 * @param {string} fileType
 * @returns {Promise<string>}
 */


exports.getImageScaleRatio = getImageScaleRatio;

var resizeImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(fileDataUri, fileType) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var newImage = new Image();
              newImage.src = fileDataUri;
              newImage.onerror = reject;

              newImage.onload = function () {
                var canvas = document.createElement('canvas');
                var scaleRatio = getImageScaleRatio(newImage);
                var scaledWidth = scaleRatio * newImage.width;
                var scaledHeight = scaleRatio * newImage.height;
                canvas.width = scaledWidth;
                canvas.height = scaledHeight;
                canvas.getContext('2d').drawImage(newImage, 0, 0, scaledWidth, scaledHeight);
                resolve(canvas.toDataURL(fileType));
              };
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function resizeImage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {File} file
 * @returns {Promise<string>}
 */


exports.resizeImage = resizeImage;

var fileToDataUri = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(file) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;

              reader.onload = function (e) {
                return resolve(e.target.result);
              };

              reader.readAsDataURL(file);
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fileToDataUri(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.fileToDataUri = fileToDataUri;