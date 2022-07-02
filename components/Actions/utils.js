"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trashFiles = exports.removeQualification = exports.makeZipFolder = exports.makeActions = exports.makeActionVariant = exports.isAnyFileReferencedBy = exports.getOnlyNeededActions = exports.getActionName = exports.forwardFile = exports.downloadFiles = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Alerter = _interopRequireDefault(require("cozy-ui/transpiled/react/Alerter"));

var _cozyClient = require("cozy-client");

var _doctypes = require("../../doctypes");

var _getSharingLink = require("../../utils/getSharingLink");

var _forward = require("./Items/forward");

var _download = require("./Items/download");

var _handleConflictFilename = require("../../utils/handleConflictFilename");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getActionName = function getActionName(actionObject) {
  return Object.keys(actionObject)[0];
}; // We need to clean Actions since action has a displayable
// conditions and we can't know from the begining what the
// behavior will be. For instance, we can't know that
// hr will be the latest action in the sharing views for a
// folder.
// Or we can't know that we'll have two following hr if the
// display condition for the actions between are true or false


exports.getActionName = getActionName;

var getOnlyNeededActions = function getOnlyNeededActions(actions, file) {
  var previousAction = '';
  var displayableActions = actions.filter(function (actionObject) {
    var actionDefinition = Object.values(actionObject)[0];
    return !actionDefinition.displayCondition || actionDefinition.displayCondition([file]);
  });
  return displayableActions // We do not want to display the same 2 actions in a row
  .map(function (actionObject) {
    var actionName = getActionName(actionObject);

    if (previousAction === actionName) {
      previousAction = actionName;
      return null;
    } else {
      previousAction = actionName;
    }

    return actionObject;
  }).filter(Boolean) // We don't want to have an hr as the latest actions available
  .filter(function (cleanedAction, idx, cleanedActions) {
    return !(getActionName(cleanedAction) === 'hr' && idx === cleanedActions.length - 1);
  });
};
/**
 * Make array of actions for ActionsItems component
 *
 * @param {Function[]} actionCreators - Array of function to create ActionMenuItem components with associated actions and conditions
 * @param {object} actionOptions - Options that need to be passed on Actions
 * @returns {object[]} Array of actions
 */


exports.getOnlyNeededActions = getOnlyNeededActions;

var makeActions = function makeActions() {
  var actionCreators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var actionOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return actionCreators.map(function (createAction) {
    var actionMenu = createAction(actionOptions);
    var name = actionMenu.name || createAction.name;
    return (0, _defineProperty2.default)({}, name, actionMenu);
  });
};

exports.makeActions = makeActions;

var makeActionVariant = function makeActionVariant() {
  return navigator.share ? [_forward.forward, _download.download] : [_download.download];
};

exports.makeActionVariant = makeActionVariant;

var isAnyFileReferencedBy = function isAnyFileReferencedBy(files, doctype) {
  for (var i = 0, l = files.length; i < l; ++i) {
    if ((0, _cozyClient.isReferencedBy)(files[i], doctype)) return true;
  }

  return false;
};

exports.isAnyFileReferencedBy = isAnyFileReferencedBy;

var isMissingFileError = function isMissingFileError(error) {
  return error.status === 404;
};

var downloadFileError = function downloadFileError(error) {
  return isMissingFileError(error) ? 'common.downloadFile.error.missing' : 'common.downloadFile.error.offline';
};
/**
 * @typedef {object} MakeZipFolderParam
 * @property {CozyClient} client - Instance of CozyClient
 * @property {IOCozyFile[]} files - List of files to zip
 * @property {string} zipFolderName - Desired name of the Zip folder
 * @property {string} dirId - Id of the destination folder of the zip
 */

/**
 * Create a zip folder with the list of files and save it in a desired folder in Drive
 *
 * @param {MakeZipFolderParam} param0
 * @returns {Promise<string>} - Final name of the zip folder
 */


var makeZipFolder = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_ref2) {
    var client, files, zipFolderName, dirId, filename, zipData, jobCollection;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            client = _ref2.client, files = _ref2.files, zipFolderName = _ref2.zipFolderName, dirId = _ref2.dirId;
            _context.next = 3;
            return (0, _handleConflictFilename.handleConflictFilename)(client, dirId, zipFolderName);

          case 3:
            filename = _context.sent;
            zipData = {
              files: Object.fromEntries(files.map(function (file) {
                return [file.name, file._id];
              })),
              dir_id: dirId,
              filename: filename
            };
            jobCollection = client.collection(_doctypes.JOBS_DOCTYPE);
            _context.next = 8;
            return jobCollection.create('zip', zipData, {}, true);

          case 8:
            return _context.abrupt("return", filename);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function makeZipFolder(_x) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * forwardFile - Triggers the download of one or multiple files by the browser
 * @param {CozyClient} client
 * @param {array} files One or more files to download
 * @param {func} t i18n function
 */


exports.makeZipFolder = makeZipFolder;

var forwardFile = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(client, files, t) {
    var file, url, isZipFile, shareData;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            // We currently support only one file at a time
            file = files[0];
            _context2.next = 4;
            return (0, _getSharingLink.getSharingLink)(client, file, true);

          case 4:
            url = _context2.sent;
            isZipFile = file.class === 'zip';
            shareData = {
              title: t('viewer.shareData.title', {
                name: file.name,
                smart_count: isZipFile ? 2 : 1
              }),
              text: t('viewer.shareData.text', {
                name: file.name,
                smart_count: isZipFile ? 2 : 1
              }),
              url: url
            };
            navigator.share(shareData);
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);

            _Alerter.default.error('viewer.shareData.error', {
              error: _context2.t0
            });

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function forwardFile(_x2, _x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * downloadFiles - Triggers the download of one or multiple files by the browser
 *
 * @param {CozyClient} client
 * @param {array} files One or more files to download
 */


exports.forwardFile = forwardFile;

var downloadFiles = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(client, files) {
    var fileCollection, file, filename, downloadURL, ids, href, fullpath;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fileCollection = client.collection(_doctypes.FILES_DOCTYPE);

            if (!(files.length === 1)) {
              _context3.next = 16;
              break;
            }

            file = files[0];
            _context3.prev = 3;
            filename = file.name;
            _context3.next = 7;
            return fileCollection.getDownloadLinkById(file.id, filename);

          case 7:
            downloadURL = _context3.sent;
            fileCollection.forceFileDownload("".concat(downloadURL, "?Dl=1"), filename);
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](3);

            _Alerter.default.error(downloadFileError(_context3.t0));

          case 14:
            _context3.next = 22;
            break;

          case 16:
            ids = files.map(function (f) {
              return f.id;
            });
            _context3.next = 19;
            return fileCollection.getArchiveLinkByIds(ids);

          case 19:
            href = _context3.sent;
            fullpath = "".concat(client.getStackClient().uri).concat(href);
            fileCollection.forceFileDownload(fullpath, 'files.zip');

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 11]]);
  }));

  return function downloadFiles(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

exports.downloadFiles = downloadFiles;

var isAlreadyInTrash = function isAlreadyInTrash(err) {
  var reasons = err.reason !== undefined ? err.reason.errors : undefined;

  if (reasons) {
    var _iterator = _createForOfIteratorHelper(reasons),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var reason = _step.value;

        if (reason.detail === 'File or directory is already in the trash') {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return false;
};
/**
 * trashFiles - Moves a set of files to the cozy trash
 *
 * @param {CozyClient} client
 * @param {array} files  One or more files to trash
 */


var trashFiles = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(client, files) {
    var _iterator2, _step2, file;

    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _iterator2 = _createForOfIteratorHelper(files);
            _context4.prev = 2;

            _iterator2.s();

          case 4:
            if ((_step2 = _iterator2.n()).done) {
              _context4.next = 10;
              break;
            }

            file = _step2.value;
            _context4.next = 8;
            return client.destroy(file);

          case 8:
            _context4.next = 4;
            break;

          case 10:
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](2);

            _iterator2.e(_context4.t0);

          case 15:
            _context4.prev = 15;

            _iterator2.f();

            return _context4.finish(15);

          case 18:
            _Alerter.default.success('common.trashFile.success');

            _context4.next = 24;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t1 = _context4["catch"](0);

            if (!isAlreadyInTrash(_context4.t1)) {
              _Alerter.default.error('common.trashFile.error');
            }

          case 24:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 21], [2, 12, 15, 18]]);
  }));

  return function trashFiles(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * removeQualification - Remove qualification attribute
 *
 * @param {CozyClient} client
 * @param {array} files  One or more files
 */


exports.trashFiles = trashFiles;

var removeQualification = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(client, files) {
    var fileCollection, _iterator3, _step3, file;

    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            fileCollection = client.collection(_doctypes.FILES_DOCTYPE);
            _iterator3 = _createForOfIteratorHelper(files);
            _context5.prev = 3;

            _iterator3.s();

          case 5:
            if ((_step3 = _iterator3.n()).done) {
              _context5.next = 11;
              break;
            }

            file = _step3.value;
            _context5.next = 9;
            return fileCollection.updateMetadataAttribute(file._id, {
              qualification: undefined
            });

          case 9:
            _context5.next = 5;
            break;

          case 11:
            _context5.next = 16;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](3);

            _iterator3.e(_context5.t0);

          case 16:
            _context5.prev = 16;

            _iterator3.f();

            return _context5.finish(16);

          case 19:
            _Alerter.default.success('common.removeQualification.success');

            _context5.next = 25;
            break;

          case 22:
            _context5.prev = 22;
            _context5.t1 = _context5["catch"](0);

            _Alerter.default.error('common.removeQualification.error');

          case 25:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 22], [3, 13, 16, 19]]);
  }));

  return function removeQualification(_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}();

exports.removeQualification = removeQualification;