"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("cozy-ui/transpiled/react/ListItemText"));

var _ListItemSecondaryAction = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction"));

var _Divider = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/Divider"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _CardMedia = _interopRequireDefault(require("cozy-ui/transpiled/react/CardMedia"));

var _FileImageLoader = _interopRequireDefault(require("cozy-ui/transpiled/react/FileImageLoader"));

var _Checkbox = _interopRequireDefault(require("cozy-ui/transpiled/react/Checkbox"));

var _getLinksType = require("../../utils/getLinksType");

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var validPageName = function validPageName(page) {
  return page === 'front' || page === 'back';
};

var PaperItem = function PaperItem(_ref) {
  var _paper$metadata, _paper$metadata$quali, _paper$metadata2, _paper$metadata3;

  var paper = _ref.paper,
      divider = _ref.divider,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$classes = _ref.classes,
      classes = _ref$classes === void 0 ? {} : _ref$classes,
      withoutCheckbox = _ref.withoutCheckbox,
      children = _ref.children;

  var _useI18n = (0, _I18n.useI18n)(),
      f = _useI18n.f,
      t = _useI18n.t;

  var client = (0, _cozyClient.useClient)();
  var history = (0, _reactRouterDom.useHistory)();

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      multiSelectionFiles = _useMultiSelection.multiSelectionFiles,
      isMultiSelectionActive = _useMultiSelection.isMultiSelectionActive,
      removeCurentMultiSelectionFile = _useMultiSelection.removeCurentMultiSelectionFile,
      addCurrentMultiSelectionFile = _useMultiSelection.addCurrentMultiSelectionFile,
      currentMultiSelectionFiles = _useMultiSelection.currentMultiSelectionFiles;

  var paperLabel = paper === null || paper === void 0 ? void 0 : (_paper$metadata = paper.metadata) === null || _paper$metadata === void 0 ? void 0 : (_paper$metadata$quali = _paper$metadata.qualification) === null || _paper$metadata$quali === void 0 ? void 0 : _paper$metadata$quali.page;
  var paperDate = paper !== null && paper !== void 0 && (_paper$metadata2 = paper.metadata) !== null && _paper$metadata2 !== void 0 && _paper$metadata2.datetime ? f(paper === null || paper === void 0 ? void 0 : (_paper$metadata3 = paper.metadata) === null || _paper$metadata3 === void 0 ? void 0 : _paper$metadata3.datetime, 'DD/MM/YYYY') : null;

  var handleClick = function handleClick() {
    if (isMultiSelectionActive) {
      var paperAlreadySelected = currentMultiSelectionFiles.some(function (file) {
        return file._id === paper._id;
      });
      if (paperAlreadySelected) removeCurentMultiSelectionFile(paper);else addCurrentMultiSelectionFile(paper);
    } else {
      history.push({
        pathname: "/paper/file/".concat(paper.id)
      });
    }
  };

  var isMixed = function isMixed() {
    return multiSelectionFiles.some(function (file) {
      return file._id === paper._id;
    }) && !currentMultiSelectionFiles.some(function (file) {
      return file._id === paper._id;
    });
  };

  var isChecked = function isChecked() {
    return currentMultiSelectionFiles.some(function (file) {
      return file._id === paper._id;
    });
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    button: true,
    className: className,
    classes: classes,
    onClick: handleClick
  }, !withoutCheckbox && isMultiSelectionActive && /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
    checked: isChecked(),
    mixed: isMixed(),
    value: paper._id
  }), /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_FileImageLoader.default, {
    client: client,
    file: paper,
    linkType: (0, _getLinksType.getLinksType)(paper),
    render: function render(src) {
      return /*#__PURE__*/_react.default.createElement(_CardMedia.default, {
        component: "img",
        width: 32,
        height: 32,
        image: src
      });
    },
    renderFallback: function renderFallback() {
      return /*#__PURE__*/_react.default.createElement(_Icon.default, {
        icon: "file-type-pdf",
        size: 32
      });
    }
  })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    className: "u-mr-1",
    primary: validPageName(paperLabel) ? t("PapersList.label.".concat(paperLabel)) : paper.name,
    secondary: paperDate
  }), children && /*#__PURE__*/_react.default.createElement(_ListItemSecondaryAction.default, null, children)), divider && /*#__PURE__*/_react.default.createElement(_Divider.default, {
    variant: "inset",
    component: "li"
  }));
};

PaperItem.propTypes = {
  paper: _propTypes.default.object.isRequired,
  divider: _propTypes.default.bool,
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  classes: _propTypes.default.object
};
var _default = PaperItem;
exports.default = _default;