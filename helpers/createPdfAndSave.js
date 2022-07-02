"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPdfAndSave = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _pdfLib = require("pdf-lib");

var _cozyClient = require("cozy-client");

var _doctypes = require("../doctypes");

var _addFileToPdf = require("../utils/addFileToPdf");

var _buildFilename = require("../helpers/buildFilename");

var _excluded = ["multipage"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var uploadFileWithConflictStrategy = _cozyClient.models.file.uploadFileWithConflictStrategy;
/**
 * @typedef {object} AddContactReferenceToFileParam
 * @property {IOCozyFile} fileCreated
 * @property {DocumentCollection} fileCollection
 * @property {object[]} contacts - Array of object of the contacts
 */

/**
 * @typedef {object} CreateAndSavePdfParam
 * @property {{ data: object[], metadata: object }} formData
 * @property {Qualification} qualification
 * @property {Paper} currentDefinition
 * @property {string} appFolderID
 * @property {CozyClient} client
 * @property {{t: Function, f: Function, scannerT: Function}} i18n
 */

/**
 * @param {{multipage: boolean, page: string}} fileMetadata
 * @param {boolean} isMultipage
 * @returns {object}
 */

var sanitizeFileMetadata = function sanitizeFileMetadata(fileMetadata, isMultipage) {
  if (isMultipage || !fileMetadata.page) return {}; // eslint-disable-next-line no-unused-vars

  var multipage = fileMetadata.multipage,
      newFileMetadata = (0, _objectWithoutProperties2.default)(fileMetadata, _excluded);
  return newFileMetadata;
};
/**
 * @param {AddContactReferenceToFileParam} param
 */


var addContactReferenceToFile = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref) {
    var fileCreated, fileCollection, contacts, references;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileCreated = _ref.fileCreated, fileCollection = _ref.fileCollection, contacts = _ref.contacts;
            references = contacts.map(function (contact) {
              return {
                _id: contact._id,
                _type: _doctypes.CONTACTS_DOCTYPE
              };
            });
            _context.next = 4;
            return fileCollection.addReferencedBy(fileCreated, references);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function addContactReferenceToFile(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Convert image & pdf file to pdf & save it
 *
 * @param {CreateAndSavePdfParam} param
 * @returns {Promise<{ fileId: string, themeLabel: string }[]>} Return array of object with file id & theme label to find its location
 */


var createPdfAndSave = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(_ref3) {
    var formData, qualification, currentDefinition, appFolderID, client, i18n, t, f, scannerT, _formData, data, metadata, contacts, fileCollection, featureDate, label, filenameModel, date, isMultiPage, pdfDoc, createdFilesList, idx, _data$idx, file, fileMetadata, pdfBytes, paperName, newMetadata, _yield$uploadFileWith, fileCreated;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            formData = _ref3.formData, qualification = _ref3.qualification, currentDefinition = _ref3.currentDefinition, appFolderID = _ref3.appFolderID, client = _ref3.client, i18n = _ref3.i18n;
            t = i18n.t, f = i18n.f, scannerT = i18n.scannerT;
            _formData = _objectSpread({}, formData), data = _formData.data, metadata = _formData.metadata, contacts = _formData.contacts;
            fileCollection = client.collection(_doctypes.FILES_DOCTYPE);
            featureDate = currentDefinition.featureDate, label = currentDefinition.label, filenameModel = currentDefinition.filenameModel;
            date = metadata[featureDate] && f(metadata[featureDate], 'YYYY.MM.DD'); // If all files are to be considered as one.

            isMultiPage = data.some(function (_ref5) {
              var fileMetadata = _ref5.fileMetadata;
              return fileMetadata.multipage;
            }); // Created first document of PDFDocument

            _context2.next = 9;
            return _pdfLib.PDFDocument.create();

          case 9:
            pdfDoc = _context2.sent;
            createdFilesList = [];
            idx = 0;

          case 12:
            if (!(idx < data.length)) {
              _context2.next = 34;
              break;
            }

            _data$idx = data[idx], file = _data$idx.file, fileMetadata = _data$idx.fileMetadata;
            _context2.next = 16;
            return (0, _addFileToPdf.addFileToPdf)(pdfDoc, file);

          case 16:
            pdfBytes = _context2.sent;
            paperName = (0, _buildFilename.buildFilename)({
              filenameModel: filenameModel,
              metadata: metadata,
              qualificationName: scannerT("items.".concat(label)),
              pageName: fileMetadata.page ? t("PapersList.label.".concat(fileMetadata.page)) : null,
              contacts: contacts,
              formatedDate: date,
              t: t
            }); // Created metadata for pdf file

            newMetadata = _objectSpread(_objectSpread(_objectSpread({
              qualification: _objectSpread({}, qualification)
            }, sanitizeFileMetadata(fileMetadata, isMultiPage)), metadata), {}, {
              datetime: metadata[featureDate] ? metadata[featureDate] : pdfDoc.getCreationDate(),
              datetimeLabel: metadata[featureDate] ? featureDate : 'datetime'
            }); // If isn't multipage or the last of multipage, save file

            if (!(!isMultiPage || isMultiPage && idx === data.length - 1)) {
              _context2.next = 27;
              break;
            }

            _context2.next = 22;
            return uploadFileWithConflictStrategy(client, pdfBytes, {
              name: paperName,
              contentType: 'application/pdf',
              metadata: newMetadata,
              dirId: appFolderID,
              conflictStrategy: 'rename'
            });

          case 22:
            _yield$uploadFileWith = _context2.sent;
            fileCreated = _yield$uploadFileWith.data;
            _context2.next = 26;
            return addContactReferenceToFile({
              fileCreated: fileCreated,
              fileCollection: fileCollection,
              contacts: contacts
            });

          case 26:
            createdFilesList.push({
              fileId: fileCreated._id,
              themeLabel: label
            });

          case 27:
            if (!(!isMultiPage && idx !== data.length - 1)) {
              _context2.next = 31;
              break;
            }

            _context2.next = 30;
            return _pdfLib.PDFDocument.create();

          case 30:
            pdfDoc = _context2.sent;

          case 31:
            idx++;
            _context2.next = 12;
            break;

          case 34:
            return _context2.abrupt("return", createdFilesList);

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createPdfAndSave(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.createPdfAndSave = createPdfAndSave;