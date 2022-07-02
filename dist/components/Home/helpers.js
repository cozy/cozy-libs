"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasItemByLabel = exports.filterPapersByThemeAndSearchValue = void 0;

var _fuse = _interopRequireDefault(require("fuse.js"));

var fuse = new _fuse.default([], {
  findAllMatches: true,
  threshold: 0.3,
  ignoreLocation: true,
  ignoreFieldNorm: true,
  keys: ['name', 'tranlatedQualificationLabel']
}); // TODO: hasItemByLabel should be in cozy-client : https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/models/document/documentTypeDataHelpers.js

var hasItemByLabel = function hasItemByLabel(theme, label) {
  if (!theme) return true;
  return theme.items.some(function (item) {
    return item.label === label;
  });
};

exports.hasItemByLabel = hasItemByLabel;

var filterPapersByThemeAndSearchValue = function filterPapersByThemeAndSearchValue(_ref) {
  var files = _ref.files,
      theme = _ref.theme,
      search = _ref.search,
      scannerT = _ref.scannerT;
  var filteredFiles = files;

  if (search || theme) {
    var simpleFiles = files.map(function (file) {
      return {
        _id: file._id,
        name: file.name,
        qualifiationLabel: file.metadata.qualification.label,
        tranlatedQualificationLabel: scannerT("items.".concat(file.metadata.qualification.label))
      };
    });
    var filteredSimplesFiles = simpleFiles;

    if (search) {
      fuse.setCollection(simpleFiles);
      filteredSimplesFiles = fuse.search(search).map(function (result) {
        return result.item;
      });
    }

    if (theme) {
      filteredSimplesFiles = filteredSimplesFiles.filter(function (simpleFile) {
        return hasItemByLabel(theme, simpleFile.qualifiationLabel);
      });
    }

    filteredFiles = files.filter(function (file) {
      return filteredSimplesFiles.some(function (simpleFile) {
        return simpleFile._id === file._id;
      });
    });
  }

  return filteredFiles;
};

exports.filterPapersByThemeAndSearchValue = filterPapersByThemeAndSearchValue;