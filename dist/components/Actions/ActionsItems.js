"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsItems = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _I18n = require("cozy-ui/transpiled/react/I18n");

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ActionsItems = function ActionsItems(_ref) {
  var actions = _ref.actions,
      file = _ref.file,
      onClose = _ref.onClose;

  var _useI18n = (0, _I18n.useI18n)(),
      t = _useI18n.t;

  var cleanedActions = (0, _react.useMemo)(function () {
    return (0, _utils.getOnlyNeededActions)(actions, file);
  }, [actions, file]);
  return cleanedActions.map(function (actionObject, idx) {
    var actionName = (0, _utils.getActionName)(actionObject);
    var actionDefinition = Object.values(actionObject)[0];
    var Component = actionDefinition.Component,
        action = actionDefinition.action,
        isEnabled = actionDefinition.isEnabled;

    var onClick = function onClick() {
      action && action([file], t);
      onClose();
    };

    return /*#__PURE__*/_react.default.createElement(Component, {
      key: actionName + idx,
      onClick: onClick,
      isEnabled: isEnabled,
      className: (0, _classnames.default)('u-flex-items-center'),
      files: file ? [file] : []
    });
  });
};

exports.ActionsItems = ActionsItems;