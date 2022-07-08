"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFileToPdf = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _pdfLib = require("pdf-lib");

var _pdf = require("../utils/pdf");

var _image = require("../utils/image");

/**
 * @param {PDFDocument} pdfDoc
 * @param {File} file
 * @returns {Promise<void>}
 */
var addImageToPdf = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(pdfDoc, file) {
    var fileDataUri, resizedImage, img, page, _page$getSize, pageWidth, pageHeight;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _image.fileToDataUri)(file);

          case 2:
            fileDataUri = _context.sent;
            _context.next = 5;
            return (0, _image.resizeImage)(fileDataUri, file.type);

          case 5:
            resizedImage = _context.sent;

            if (!(file.type === 'image/png')) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return pdfDoc.embedPng(resizedImage);

          case 9:
            img = _context.sent;

          case 10:
            if (!(file.type === 'image/jpeg')) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return pdfDoc.embedJpg(resizedImage);

          case 13:
            img = _context.sent;

          case 14:
            page = pdfDoc.addPage([img.width, img.height]);
            _page$getSize = page.getSize(), pageWidth = _page$getSize.width, pageHeight = _page$getSize.height;
            page.drawImage(img, {
              x: pageWidth / 2 - img.width / 2,
              y: pageHeight / 2 - img.height / 2,
              width: img.width,
              height: img.height
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function addImageToPdf(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {PDFDocument} pdfDoc
 * @param {File} file
 * @returns {Promise<void>}
 */


var addPdfToPdf = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(pdfDoc, file) {
    var pdfToAdd, document, copiedPages;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _pdf.fileToArrayBuffer)(file);

          case 2:
            pdfToAdd = _context2.sent;
            _context2.next = 5;
            return _pdfLib.PDFDocument.load(pdfToAdd);

          case 5:
            document = _context2.sent;
            _context2.next = 8;
            return pdfDoc.copyPages(document, document.getPageIndices());

          case 8:
            copiedPages = _context2.sent;
            copiedPages.forEach(function (page) {
              return pdfDoc.addPage(page);
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function addPdfToPdf(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @param {PDFDocument} pdfDoc - Instance of PDFDocument
 * @param {File} file - File to add in pdf
 * @returns {Promise<ArrayBuffer>} - Data of pdf generated
 */


var addFileToPdf = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(pdfDoc, file) {
    var pdfDocBytes;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(file.type === 'application/pdf')) {
              _context3.next = 5;
              break;
            }

            _context3.next = 3;
            return addPdfToPdf(pdfDoc, file);

          case 3:
            _context3.next = 7;
            break;

          case 5:
            _context3.next = 7;
            return addImageToPdf(pdfDoc, file);

          case 7:
            _context3.next = 9;
            return pdfDoc.save();

          case 9:
            pdfDocBytes = _context3.sent;
            return _context3.abrupt("return", pdfDocBytes);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function addFileToPdf(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addFileToPdf = addFileToPdf;