"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListSubheader = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader"));

var _PapersList = _interopRequireDefault(require("../Papers/PapersList"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PapersListByContact = function PapersListByContact(_ref) {
  var paperslistByContact = _ref.paperslistByContact;
  return /*#__PURE__*/_react.default.createElement(_List.default, null, paperslistByContact.map(function (_ref2, idx) {
    var withHeader = _ref2.withHeader,
        contact = _ref2.contact,
        papers = _ref2.papers;
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: idx
    }, withHeader && /*#__PURE__*/_react.default.createElement(_ListSubheader.default, null, contact), /*#__PURE__*/_react.default.createElement(_PapersList.default, {
      papers: papers
    }));
  }));
};

PapersListByContact.propTypes = {
  paperslistByContact: _propTypes.default.arrayOf(_propTypes.default.object)
};
var _default = PapersListByContact;
exports.default = _default;