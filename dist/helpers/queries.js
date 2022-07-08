"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnboardingStatus = exports.buildFilesQueryByLabels = exports.buildFilesQueryByLabel = exports.buildContactsQueryByIds = void 0;

var _cozyClient = require("cozy-client");

var _doctypes = require("../doctypes");

var defaultFetchPolicy = _cozyClient.fetchPolicies.olderThan(30 * 1000);

var buildFilesQueryByLabels = function buildFilesQueryByLabels(labels) {
  return {
    definition: function definition() {
      return (0, _cozyClient.Q)(_doctypes.FILES_DOCTYPE).partialIndex({
        type: 'file',
        trashed: false,
        'metadata.qualification.label': {
          $in: labels
        }
      }).select(['name', 'metadata.datetime', 'referenced_by', 'metadata.qualification.label', 'type', 'trashed']).limitBy(1000);
    },
    options: {
      as: "".concat(_doctypes.FILES_DOCTYPE, "/").concat(JSON.stringify(labels)),
      fetchPolicy: defaultFetchPolicy
    }
  };
};

exports.buildFilesQueryByLabels = buildFilesQueryByLabels;

var buildFilesQueryByLabel = function buildFilesQueryByLabel(label) {
  return {
    definition: (0, _cozyClient.Q)(_doctypes.FILES_DOCTYPE).where({
      'metadata.qualification': {
        label: label
      }
    }).partialIndex({
      type: 'file',
      trashed: false
    }).indexFields(['created_at', 'metadata.qualification']).sortBy([{
      created_at: 'desc'
    }]),
    options: {
      as: "".concat(_doctypes.FILES_DOCTYPE, "/").concat(label),
      fetchPolicy: defaultFetchPolicy
    }
  };
};

exports.buildFilesQueryByLabel = buildFilesQueryByLabel;
var getOnboardingStatus = {
  definition: function definition() {
    return (0, _cozyClient.Q)(_doctypes.SETTINGS_DOCTYPE);
  },
  options: {
    as: "getOnboardingStatus",
    fetchPolicy: _cozyClient.fetchPolicies.noFetch()
  }
};
exports.getOnboardingStatus = getOnboardingStatus;

var buildContactsQueryByIds = function buildContactsQueryByIds() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    definition: (0, _cozyClient.Q)(_doctypes.CONTACTS_DOCTYPE).getByIds(ids),
    options: {
      as: "".concat(_doctypes.CONTACTS_DOCTYPE, "/").concat(ids.join('')),
      fetchPolicy: defaultFetchPolicy
    }
  };
};

exports.buildContactsQueryByIds = buildContactsQueryByIds;