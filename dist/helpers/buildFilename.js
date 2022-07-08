"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFilename = void 0;

var _helpers = require("../components/Papers/helpers");

/**
 * Builded Paper name with qualification name & without use filename original
 * @param {string} contacts - Array of contacts
 * @param {string} qualificationName - Name of the paper qualification
 * @param {Array<string>} [filenameModel] - Array of key for build filename
 * @param {object} [metadata] - Object with data of Information input
 * @param {string} [pageName] - Name of page (eg Front)
 * @param {string} [formatedDate] - Date already formated
 * @returns {string} Paper name with PDF extension
 */
var buildFilename = function buildFilename(_ref) {
  var contacts = _ref.contacts,
      qualificationName = _ref.qualificationName,
      filenameModel = _ref.filenameModel,
      metadata = _ref.metadata,
      pageName = _ref.pageName,
      formatedDate = _ref.formatedDate,
      t = _ref.t;

  /*
    Calling the stack's file creation method would trigger a `status: "422", title: "Invalid Parameter"` error if filename contains`/`.
    So we need to remove any occurrence of this character from the filename.
  */
  var safeFileName = qualificationName.replace(/\//g, '_');
  var filename = [];
  var contactName = (0, _helpers.harmonizeContactsNames)(contacts, t);
  filename.push(safeFileName);
  if (pageName) filename.push(pageName);
  if (contactName) filename.push(contactName);
  if (formatedDate) filename.push(formatedDate);

  if ((filenameModel === null || filenameModel === void 0 ? void 0 : filenameModel.length) > 0) {
    var filenameWithModel = filenameModel.map(function (el) {
      if (el === 'label') return safeFileName;
      if (el === 'contactName') return contactName || '';
      if (el === 'featureDate') return formatedDate || '';
      return metadata !== null && metadata !== void 0 && metadata[el] ? metadata[el] : null;
    }).filter(Boolean);

    if (filenameWithModel.length > 0) {
      return "".concat(filenameWithModel.join(' - '), ".pdf");
    }
  }

  if (filename.length > 1) {
    return "".concat(filename.join(' - '), ".pdf");
  }

  return "".concat(filename.join(), ".pdf");
};

exports.buildFilename = buildFilename;