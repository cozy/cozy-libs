"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBar = exports.getValues = void 0;

var _manifest = _interopRequireDefault(require("../../manifest.webapp"));

/* global cozy */
var getDataOrDefault = function getDataOrDefault(data, defaultData) {
  return /^\{\{\..*\}\}$/.test(data) ? defaultData : data;
};
/**
 * default data will allow to display correctly the cozy-bar
 * in the standalone (without cozy-stack connexion)
 */


var getValues = function getValues(_ref) {
  var app = _ref.app,
      locale = _ref.locale;
  var defaultValues = {
    appIconDefault: require('../assets/icon.svg'),
    appNamePrefixDefault: _manifest.default.name_prefix,
    appNameDefault: _manifest.default.name,
    appLocaleDefault: 'en'
  };
  return {
    appName: getDataOrDefault(app.name, defaultValues.appNameDefault),
    appNamePrefix: getDataOrDefault(app.prefix, defaultValues.appNamePrefixDefault),
    iconPath: getDataOrDefault(app.icon, defaultValues.appIconDefault),
    lang: getDataOrDefault(locale, defaultValues.appLocaleDefault)
  };
};
/**
 * Cozy bar initialization
 * @param {object} client - cozy client
 */


exports.getValues = getValues;

var initBar = function initBar(_ref2) {
  var client = _ref2.client,
      root = _ref2.root,
      lang = _ref2.lang,
      appName = _ref2.appName;

  var _getValues = getValues(JSON.parse(root.dataset.cozy)),
      appNamePrefix = _getValues.appNamePrefix,
      iconPath = _getValues.iconPath;

  cozy.bar.init({
    appName: appName,
    appNamePrefix: appNamePrefix,
    cozyClient: client,
    iconPath: iconPath,
    lang: lang,
    replaceTitleOnMobile: false
  });
};

exports.initBar = initBar;