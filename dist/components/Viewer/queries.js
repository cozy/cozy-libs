"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildViewerFileQuery = void 0;

var _cozyClient = require("cozy-client");

var defaultFetchPolicy = _cozyClient.fetchPolicies.olderThan(30 * 1000);

var buildViewerFileQuery = function buildViewerFileQuery(fileId) {
  return {
    definition: function definition() {
      return (0, _cozyClient.Q)('io.cozy.files').getById(fileId);
    },
    options: {
      as: "buildViewerFileQuery/".concat(fileId),
      fetchPolicy: defaultFetchPolicy
    }
  };
};

exports.buildViewerFileQuery = buildViewerFileQuery;