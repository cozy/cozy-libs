"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Empty = _interopRequireDefault(require("cozy-ui/transpiled/react/Empty"));

var _Spinner = _interopRequireDefault(require("cozy-ui/transpiled/react/Spinner"));

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListSubheader = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader"));

var _PaperItem = _interopRequireDefault(require("../Papers/PaperItem"));

var _queries = require("../../helpers/queries");

var _helpers = require("../Papers/helpers");

var _HomeCloud = _interopRequireDefault(require("../../assets/icons/HomeCloud.svg"));

var _excluded = ["data"];

var SearchResult = function SearchResult(_ref) {
  var filteredPapers = _ref.filteredPapers;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var contactIds = (0, _helpers.getContactsRefIdsByFiles)(filteredPapers);
  var contactsQueryByIds = (0, _queries.buildContactsQueryByIds)(contactIds);

  var _useQueryAll = (0, _cozyClient.useQueryAll)(contactsQueryByIds.definition, contactsQueryByIds.options),
      contacts = _useQueryAll.data,
      contactQueryResult = (0, _objectWithoutProperties2.default)(_useQueryAll, _excluded);

  var isLoadingContacts = (0, _cozyClient.isQueryLoading)(contactQueryResult) || contactQueryResult.hasMore;
  var filesWithContacts = !isLoadingContacts ? (0, _helpers.buildFilesByContacts)({
    files: filteredPapers,
    contacts: contacts,
    t: t
  }) : [];

  if (filesWithContacts.length === 0 && !isLoadingContacts) {
    return /*#__PURE__*/_react.default.createElement(_Empty.default, {
      icon: _HomeCloud.default,
      iconSize: "large",
      title: t('Home.Empty.title'),
      text: t('Home.Empty.text'),
      className: "u-ph-1"
    });
  }

  return filesWithContacts.length > 0 ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ListSubheader.default, null, t('PapersList.subheader')), /*#__PURE__*/_react.default.createElement(_List.default, null, filesWithContacts.map(function (_ref2) {
    var contact = _ref2.contact,
        papers = _ref2.papers;
    return papers.list.map(function (paper) {
      return /*#__PURE__*/_react.default.createElement(_PaperItem.default, {
        key: paper._id,
        paper: paper,
        contactNames: contact,
        withCheckbox: true
      });
    });
  }))) : /*#__PURE__*/_react.default.createElement(_Spinner.default, {
    size: "xxlarge",
    className: "u-flex u-flex-justify-center u-mt-2 u-h-5"
  });
};

SearchResult.propTypes = {
  filteredPapers: _propTypes.default.arrayOf(_propTypes.default.object)
};
var _default = SearchResult;
exports.default = _default;