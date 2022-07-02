"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _get = _interopRequireDefault(require("lodash/get"));

var _cozyClient = require("cozy-client");

var _SharingProvider = require("cozy-sharing/dist/SharingProvider");

var _queries = require("./queries");

var _FileViewerLoading = _interopRequireDefault(require("./FileViewerLoading"));

var _FilesViewer = _interopRequireDefault(require("./FilesViewer"));

require("cozy-sharing/dist/stylesheet.css");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FilesViewerWithQuery = function FilesViewerWithQuery(props) {
  var _filesQuery$data;

  var history = props.history,
      match = props.match;
  var client = (0, _cozyClient.useClient)();
  var currentFileId = (0, _react.useMemo)(function () {
    return (0, _get.default)(match, 'params.fileId', null);
  }, [match]);
  var buildedFilesQuery = (0, _react.useMemo)(function () {
    return (0, _queries.buildViewerFileQuery)(currentFileId);
  }, [currentFileId]);
  var filesQuery = (0, _cozyClient.useQuery)(buildedFilesQuery.definition, buildedFilesQuery.options);

  if (((_filesQuery$data = filesQuery.data) === null || _filesQuery$data === void 0 ? void 0 : _filesQuery$data.length) > 0) {
    return /*#__PURE__*/_react.default.createElement(_SharingProvider.SharingProvider, {
      client: client,
      doctype: "io.cozy.files",
      documentType: "Files"
    }, /*#__PURE__*/_react.default.createElement(_FilesViewer.default, {
      fileId: currentFileId,
      files: filesQuery.data,
      filesQuery: filesQuery,
      onClose: function onClose() {
        return history.goBack();
      },
      onChange: function onChange(fileId) {
        return history.push({
          pathname: "/paper/file/".concat(fileId)
        });
      }
    }));
  } else {
    return /*#__PURE__*/_react.default.createElement(_FileViewerLoading.default, null);
  }
};

var _default = FilesViewerWithQuery;
exports.default = _default;