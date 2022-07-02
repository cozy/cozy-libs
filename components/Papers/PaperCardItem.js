"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _IconButton = _interopRequireDefault(require("cozy-ui/transpiled/react/IconButton"));

var _Icon = _interopRequireDefault(require("cozy-ui/transpiled/react/Icon"));

var _Paper = _interopRequireDefault(require("cozy-ui/transpiled/react/Paper"));

var _makeStyles = _interopRequireDefault(require("cozy-ui/transpiled/react/helpers/makeStyles"));

var _PaperItem = _interopRequireDefault(require("../Papers/PaperItem"));

var _useMultiSelection2 = require("../Hooks/useMultiSelection");

var useStyles = (0, _makeStyles.default)(function (theme) {
  return {
    root: {
      // This values corresponds to the value of the property `border-radius` of the component Paper of MUI
      borderRadius: function borderRadius(square) {
        return square ? 0 : theme.shape.borderRadius;
      },
      height: '100%'
    },
    container: {
      height: '100%'
    }
  };
});

var PaperCardItem = function PaperCardItem(_ref) {
  var paper = _ref.paper,
      paperIndex = _ref.paperIndex,
      divider = _ref.divider,
      className = _ref.className,
      _ref$square = _ref.square,
      square = _ref$square === void 0 ? false : _ref$square;
  var classes = useStyles(square);

  var _useMultiSelection = (0, _useMultiSelection2.useMultiSelection)(),
      removeMultiSelectionFile = _useMultiSelection.removeMultiSelectionFile;

  return /*#__PURE__*/_react.default.createElement(_Paper.default, {
    className: "u-h-3 ".concat(className),
    square: square
  }, /*#__PURE__*/_react.default.createElement(_PaperItem.default, {
    paper: paper,
    divider: divider,
    classes: classes,
    withoutCheckbox: true
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    color: "secondary",
    onClick: function onClick() {
      return removeMultiSelectionFile(paperIndex);
    }
  }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
    icon: "cross-circle"
  }))));
};

PaperCardItem.propTypes = {
  paper: _propTypes.default.object.isRequired,
  divider: _propTypes.default.bool,
  className: _propTypes.default.string,
  square: _propTypes.default.bool
};
var _default = PaperCardItem;
exports.default = _default;