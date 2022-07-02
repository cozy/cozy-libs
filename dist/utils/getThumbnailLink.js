"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThumbnailLink = void 0;

/**
 * @param {CozyClient} client - CozyClient instance
 * @param {IOCozyFile} file - An io.cozy.files document
 * @returns {Promise<String>} - URL of file thumbnail
 */
var getThumbnailLink = function getThumbnailLink(client, file) {
  var _client$getStackClien = client.getStackClient(),
      uri = _client$getStackClien.uri;

  var url = null; // Check if file has links attribute (If the file comes from real time, it is missing)

  if (file.links) {
    switch (file.class) {
      case 'image':
        url = "".concat(uri).concat(file.links.small);
        break;

      case 'pdf':
        url = "".concat(uri).concat(file.links.icon);
        break;

      default:
        url = null;
        break;
    }
  }

  return url;
};

exports.getThumbnailLink = getThumbnailLink;