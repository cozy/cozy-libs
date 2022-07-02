"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _MultiselectContent = _interopRequireDefault(require("./MultiselectContent"));

var _useMultiSelection = require("../Hooks/useMultiSelection");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

/* eslint-disable react/display-name */
jest.mock('../Papers/PaperCardItem', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "PaperCardItem"
    });
  };
});
jest.mock('cozy-ui/transpiled/react/Empty', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "Empty"
    });
  };
});
/* eslint-enable react/display-name */

jest.mock('../Hooks/useMultiSelection');

var setup = function setup(_ref) {
  var multiSelectionFiles = _ref.multiSelectionFiles;

  _useMultiSelection.useMultiSelection.mockReturnValue({
    multiSelectionFiles: multiSelectionFiles
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_MultiselectContent.default, null)));
};

describe('MultiselectContent', function () {
  it('should display Empty when no files are selected', function () {
    var _setup = setup({
      multiSelectionFiles: []
    }),
        getByTestId = _setup.getByTestId,
        queryByTestId = _setup.queryByTestId;

    expect(getByTestId('Empty'));
    expect(queryByTestId('PaperCardItem')).toBeNull();
  });
  it('should display PaperCardItem when files are selected', function () {
    var _setup2 = setup({
      multiSelectionFiles: [{
        _id: '123'
      }]
    }),
        getByTestId = _setup2.getByTestId,
        queryByTestId = _setup2.queryByTestId;

    expect(getByTestId('PaperCardItem'));
    expect(queryByTestId('Empty')).toBeNull();
  });
});