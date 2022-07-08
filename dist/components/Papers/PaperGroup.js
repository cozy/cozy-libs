"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _cozyClient = require("cozy-client");

var _List = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/List"));

var _ListSubheader = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader"));

var _ListItem = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("cozy-ui/transpiled/react/ListItemText"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _Divider = _interopRequireDefault(require("cozy-ui/transpiled/react/MuiCozyTheme/Divider"));

var _CardMedia = _interopRequireDefault(require("cozy-ui/transpiled/react/CardMedia"));

var _FileImageLoader = require("cozy-ui/transpiled/react/FileImageLoader");

var _Typography = _interopRequireDefault(require("cozy-ui/transpiled/react/Typography"));

var _useScannerI18n = require("../Hooks/useScannerI18n");

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var _getLinksType = require("../../utils/getLinksType");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PaperGroup = function PaperGroup(_ref) {
  var allPapersByCategories = _ref.allPapersByCategories,
      setSelectedThemeLabel = _ref.setSelectedThemeLabel;
  var client = (0, _cozyClient.useClient)();
  var history = (0, _reactRouterDom.useHistory)();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var scannerT = (0, _useScannerI18n.useScannerI18n)();

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      isMultiSelectionActive = _useMultiSelection.isMultiSelectionActive;

  var goPapersList = function goPapersList(category) {
    if (isMultiSelectionActive) {
      setSelectedThemeLabel(category);
    } else {
      history.push({
        pathname: "/paper/files/".concat(category)
      });
    }
  };

  return /*#__PURE__*/_react.default.createElement(_List.default, null, /*#__PURE__*/_react.default.createElement(_ListSubheader.default, null, t('PapersList.subheader')), /*#__PURE__*/_react.default.createElement("div", {
    className: "u-pv-half"
  }, allPapersByCategories.length === 0 ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: "u-ml-1 u-mv-1",
    variant: "body2",
    color: "textSecondary"
  }, t('PapersList.empty')) : allPapersByCategories.map(function (paper, index) {
    var _paper$metadata, _paper$metadata$quali;

    var category = paper === null || paper === void 0 ? void 0 : (_paper$metadata = paper.metadata) === null || _paper$metadata === void 0 ? void 0 : (_paper$metadata$quali = _paper$metadata.qualification) === null || _paper$metadata$quali === void 0 ? void 0 : _paper$metadata$quali.label;
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: paper.id
    }, /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      button: true,
      onClick: function onClick() {
        return goPapersList(category);
      }
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_FileImageLoader.FileImageLoader, {
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
          icon: "file-type-image",
          size: 32
        });
      }
    })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: scannerT("items.".concat(category))
    }), /*#__PURE__*/_react.default.createElement(_Icon.default, {
      icon: "right",
      size: 16,
      color: "var(--secondaryTextColor)"
    })), index !== allPapersByCategories.length - 1 && /*#__PURE__*/_react.default.createElement(_Divider.default, {
      variant: "inset",
      component: "li"
    }));
  })));
};

PaperGroup.propTypes = {
  allPapersByCategories: _propTypes.default.arrayOf(_propTypes.default.object),
  setSelectedThemeLabel: _propTypes.default.func
};
var _default = PaperGroup;
exports.default = _default;