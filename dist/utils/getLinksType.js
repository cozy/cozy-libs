"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinksType = void 0;

/**
 * Get type of links to display the thumbnail
 * @param {IOCozyFile} doc - An io.cozy.files document
 * @returns {'small'|'icon'}
 */
var getLinksType = function getLinksType(doc) {
  var isImage = doc.class === 'image';
  var isPdf = doc.class === 'pdf';
  return isImage ? 'small' : isPdf ? 'icon' : undefined;
};

exports.getLinksType = getLinksType;