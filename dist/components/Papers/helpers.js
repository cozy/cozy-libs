"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.harmonizeContactsNames = exports.groupFilesByContacts = exports.getContactsRefIdsByFiles = exports.buildFilesByContacts = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _groupBy = _interopRequireDefault(require("lodash/groupBy"));

var _cozyClient = require("cozy-client");

var _doctypes = require("../../doctypes");

var _filterWithRemaining2 = require("../../helpers/filterWithRemaining");

var getDisplayName = _cozyClient.models.contact.getDisplayName;

var hasContactsInFile = function hasContactsInFile(file) {
  return file.contacts.length > 0;
};
/**
 * Get all contact ids referenced on files
 *
 * @param {IOCozyFile[]} files - Array of IOCozyFile
 * @returns {string[]} - Array of contact ids
 */


var getContactsRefIdsByFiles = function getContactsRefIdsByFiles() {
  var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (0, _toConsumableArray2.default)(new Set(files.flatMap(function (file) {
    return (0, _cozyClient.getReferencedBy)(file, _doctypes.CONTACTS_DOCTYPE).map(function (contactRef) {
      return contactRef.id;
    });
  })));
};
/**
 * Harmonize contact names based on number of contacts and their last name
 * - If there are more than 2 contacts, then "..." is added after the contact names.
 * - If the names of the contacts are identical (and there are only 2 of them), then they are merged (e.g. Alice and Bob Durand)
 *
 * @property {object[]} contacts - Array of io.cozy.contacts
 * @property {Function} t - i18n function
 * @returns {string} Names of the contacts
 */


exports.getContactsRefIdsByFiles = getContactsRefIdsByFiles;

var harmonizeContactsNames = function harmonizeContactsNames(contacts, t) {
  var contactNameList = contacts.map(function (contact) {
    return getDisplayName(contact);
  });

  if (contactNameList.length === 2) {
    var firstContactName = contacts[0].name;
    var secondContactName = contacts[1].name;

    if (firstContactName.familyName === secondContactName.familyName) {
      return t('PapersList.contactMerged', {
        firstGivenName: firstContactName.givenName,
        secondGivenName: secondContactName.givenName,
        familyName: firstContactName.familyName
      });
    }
  }

  var validatedContactName = contactNameList[0];

  if (contactNameList.length > 1) {
    validatedContactName += ", ".concat(getDisplayName(contacts[1]));
    if (contactNameList.length > 2) validatedContactName += ', ... ';
  }

  return validatedContactName;
};
/**
 * Group the IOCozyFiles with their IOCozyContact
 *
 * @property {IOCozyFile[]} filesArg - Array of IOCozyFile
 * @property {IOCozyContact[]} contactsArg - Array of IOCozyContact
 * @returns {{ contacts: IOCozyContact[], files: IOCozyFile[] }}
 */


exports.harmonizeContactsNames = harmonizeContactsNames;

var groupFilesByContacts = function groupFilesByContacts(filesArg, contactsArg) {
  return Object.entries((0, _groupBy.default)(filesArg, function (file) {
    return getContactsRefIdsByFiles([file]);
  })).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        contactStringIds = _ref2[0],
        files = _ref2[1];

    var contactListFiltered = contactsArg.filter(function (contact) {
      return contactStringIds.includes(contact._id);
    });
    return {
      contacts: contactListFiltered,
      files: files
    };
  });
};
/**
 * @property {object[]} files - Array of IOCozyFile
 * @property {object[]} contacts - Array of IOCozyContact
 * @property {number} maxDisplay - Number of displayed files
 * @property {Function} t - i18n function
 * @returns {{ withHeader: boolean, contact: string, papers: { maxDisplay: number, list: IOCozyFile[] } }[]}
 */


exports.groupFilesByContacts = groupFilesByContacts;

var buildFilesByContacts = function buildFilesByContacts(_ref3) {
  var _filesWithoutContacts;

  var files = _ref3.files,
      contacts = _ref3.contacts,
      maxDisplay = _ref3.maxDisplay,
      t = _ref3.t;
  var filesByContacts = groupFilesByContacts(files, contacts);

  var _filterWithRemaining = (0, _filterWithRemaining2.filterWithRemaining)(filesByContacts, hasContactsInFile),
      filesWithContacts = _filterWithRemaining.itemsFound,
      filesWithoutContacts = _filterWithRemaining.remainingItems;

  var withHeader = !(((_filesWithoutContacts = filesWithoutContacts[0]) === null || _filesWithoutContacts === void 0 ? void 0 : _filesWithoutContacts.files.length) === files.length && files.length > 0);
  var result = filesWithContacts.map(function (fileWithContact) {
    return {
      withHeader: withHeader,
      contact: harmonizeContactsNames(fileWithContact.contacts, t),
      papers: {
        maxDisplay: maxDisplay,
        list: fileWithContact.files
      }
    };
  });
  var resultSorted = result.sort(function (a, b) {
    return a.contact.localeCompare(b.contact);
  });

  if (filesWithoutContacts.length > 0) {
    resultSorted.push({
      withHeader: withHeader,
      contact: t('PapersList.defaultName'),
      papers: {
        maxDisplay: maxDisplay,
        list: filesWithoutContacts.flatMap(function (fileWithoutContact) {
          return fileWithoutContact.files;
        })
      }
    });
  }

  return resultSorted;
};

exports.buildFilesByContacts = buildFilesByContacts;