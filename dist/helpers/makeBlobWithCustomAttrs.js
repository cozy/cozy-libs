"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeBlobWithCustomAttrs = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

/**
 * @param {Blob} blobFile
 * @param {object} attrs - Object with customs attributes
 * @returns {Blob}
 */
var makeBlobWithCustomAttrs = function makeBlobWithCustomAttrs(blobFile, attrs) {
  var newBlob = new Blob([blobFile], {
    type: blobFile.type
  });

  for (var _i = 0, _Object$entries = Object.entries(attrs); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    newBlob[key] = value;
  }

  return newBlob;
};

exports.makeBlobWithCustomAttrs = makeBlobWithCustomAttrs;