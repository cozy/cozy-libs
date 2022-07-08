"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cozyClient = require("cozy-client");

var _Buttons = _interopRequireDefault(require("cozy-ui/transpiled/react/Buttons"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _PaperLine = _interopRequireDefault(require("../Papers/PaperLine"));

var _useModal2 = require("../Hooks/useModal");

var _select = require("../Actions/Items/select");

var _hr = require("../Actions/Items/hr");

var _trash = require("../Actions/Items/trash");

var _open = require("../Actions/Items/open");

var _viewInDrive = require("../Actions/Items/viewInDrive");

var _utils = require("../Actions/utils");

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PapersList = function PapersList(_ref) {
  var papers = _ref.papers;
  var client = (0, _cozyClient.useClient)();

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var _useModal = (0, _useModal2.useModal)(),
      pushModal = _useModal.pushModal,
      popModal = _useModal.popModal;

  var _useState = (0, _react.useState)(papers.maxDisplay),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      maxDisplay = _useState2[0],
      setMaxDisplay = _useState2[1];

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      addMultiSelectionFile = _useMultiSelection.addMultiSelectionFile;

  var actionVariant = (0, _utils.makeActionVariant)();
  var actions = (0, _react.useMemo)(function () {
    return (0, _utils.makeActions)([_select.select, _hr.hr].concat((0, _toConsumableArray2.default)(actionVariant), [_open.open, _hr.hr, _viewInDrive.viewInDrive, _hr.hr, _trash.trash]), {
      client: client,
      addMultiSelectionFile: addMultiSelectionFile,
      pushModal: pushModal,
      popModal: popModal
    });
  }, [actionVariant, client, addMultiSelectionFile, popModal, pushModal]);

  var handleClick = function handleClick() {
    setMaxDisplay(papers.list.length);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "u-pv-half"
  }, papers.list.map(function (paper, idx) {
    return idx + 1 <= maxDisplay && /*#__PURE__*/_react.default.createElement(_PaperLine.default, {
      key: paper.id,
      paper: paper,
      divider: idx !== papers.list.length - 1,
      actions: actions
    });
  }), maxDisplay < papers.list.length && /*#__PURE__*/_react.default.createElement(_Buttons.default, {
    className: "u-mh-0 u-mv-half",
    variant: "text",
    label: t("PapersList.PapersListByContact.seeMore", {
      number: papers.list.length - maxDisplay
    }),
    size: "small",
    onClick: handleClick
  }));
};

PapersList.propTypes = {
  papers: _propTypes.default.shape({
    maxDisplay: _propTypes.default.number,
    list: _propTypes.default.arrayOf(_propTypes.default.object)
  })
};
var _default = PapersList;
exports.default = _default;