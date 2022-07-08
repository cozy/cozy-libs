"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _cozyClient = require("cozy-client");

var _SharingProvider = require("cozy-sharing/dist/SharingProvider");

var _queries = require("./queries");

var _FileViewerLoading = _interopRequireDefault(require("./FileViewerLoading"));

var _FilesViewer = _interopRequireDefault(require("./FilesViewer"));

require("cozy-sharing/dist/stylesheet.css");

var FilesViewerWithQuery = function FilesViewerWithQuery(props) {
  var _match$params$fileId, _match$params, _match$params2, _filesQuery$data;

  var history = props.history,
      match = props.match;
  var client = (0, _cozyClient.useClient)();
  var currentFileId = (_match$params$fileId = match === null || match === void 0 ? void 0 : (_match$params = match.params) === null || _match$params === void 0 ? void 0 : _match$params.fileId) !== null && _match$params$fileId !== void 0 ? _match$params$fileId : null;
  var currentFileTheme = match === null || match === void 0 ? void 0 : (_match$params2 = match.params) === null || _match$params2 === void 0 ? void 0 : _match$params2.fileTheme;
  var buildedFilesQuery = (0, _queries.buildViewerFileQuery)(currentFileId);
  var filesQuery = (0, _cozyClient.useQuery)(buildedFilesQuery.definition, buildedFilesQuery.options);

  var handleClose = function handleClose() {
    return history.length > 0 ? history.goBack() : history.push("/paper/files/".concat(currentFileTheme));
  };

  if (((_filesQuery$data = filesQuery.data) === null || _filesQuery$data === void 0 ? void 0 : _filesQuery$data.length) > 0) {
    return /*#__PURE__*/_react.default.createElement(_SharingProvider.SharingProvider, {
      client: client,
      doctype: "io.cozy.files",
      documentType: "Files"
    }, /*#__PURE__*/_react.default.createElement(_FilesViewer.default, {
      fileId: currentFileId,
      files: filesQuery.data,
      filesQuery: filesQuery,
      onClose: handleClose,
      onChange: function onChange(fileId) {
        return history.push("/paper/file/".concat(fileId));
      }
    }));
  } else {
    return /*#__PURE__*/_react.default.createElement(_FileViewerLoading.default, null);
  }
};

var _default = FilesViewerWithQuery;
exports.default = _default;