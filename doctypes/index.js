"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SETTINGS_DOCTYPE = exports.PERMISSIONS_DOCTYPE = exports.JOBS_DOCTYPE = exports.FILES_DOCTYPE = exports.CONTACTS_DOCTYPE = exports.APPS_DOCTYPE = void 0;
var APPS_DOCTYPE = 'io.cozy.apps';
exports.APPS_DOCTYPE = APPS_DOCTYPE;
var CONTACTS_DOCTYPE = 'io.cozy.contacts';
exports.CONTACTS_DOCTYPE = CONTACTS_DOCTYPE;
var FILES_DOCTYPE = 'io.cozy.files';
exports.FILES_DOCTYPE = FILES_DOCTYPE;
var PERMISSIONS_DOCTYPE = 'io.cozy.permissions';
exports.PERMISSIONS_DOCTYPE = PERMISSIONS_DOCTYPE;
var SETTINGS_DOCTYPE = 'io.cozy.mespapiers.settings';
exports.SETTINGS_DOCTYPE = SETTINGS_DOCTYPE;
var JOBS_DOCTYPE = 'io.cozy.jobs'; // the documents schema, necessary for CozyClient

exports.JOBS_DOCTYPE = JOBS_DOCTYPE;
var _default = {
  contacts: {
    doctype: CONTACTS_DOCTYPE,
    attributes: {},
    relationships: {}
  },
  files: {
    doctype: FILES_DOCTYPE,
    attributes: {},
    relationships: {}
  }
};
exports.default = _default;