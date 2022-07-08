"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../../test/components/AppLike"));

var _PlaceholdersList = _interopRequireDefault(require("./PlaceholdersList"));

var fakeQualificationItems = [{
  label: 'national_id_card'
}, {
  label: 'isp_invoice'
}];
/* eslint-disable react/display-name */

jest.mock('../../ImportDropdown/ImportDropdownItems', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "ImportDropdownItems"
    });
  };
});
/* eslint-enable react/display-name */

var setup = function setup() {
  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_PlaceholdersList.default, {
    currentQualifItems: fakeQualificationItems
  })));
};

describe('PlaceholdersList components:', function () {
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('should display the Placeholders corresponding to the qualification', function () {
    var _setup2 = setup(),
        getAllByTestId = _setup2.getAllByTestId,
        getByText = _setup2.getByText;

    var placeholdersLines = getAllByTestId('PlaceholdersList-ListItem');
    expect(placeholdersLines).toHaveLength(2);
    expect(getByText('ID card'));
    expect(getByText('ISP invoice'));
  });
  it('should display ActionMenu modale when clicked', function () {
    var _setup3 = setup(),
        getByText = _setup3.getByText,
        getAllByTestId = _setup3.getAllByTestId;

    var ispInvoiceLine = getAllByTestId('PlaceholdersList-ListItem')[1];

    _react2.fireEvent.click(ispInvoiceLine);

    expect(getByText('Add: ISP invoice'));
  });
  it('should not display ActionMenu modale when clicked', function () {
    var _setup4 = setup(),
        queryByText = _setup4.queryByText,
        getAllByTestId = _setup4.getAllByTestId;

    var nationalIdCardLine = getAllByTestId('PlaceholdersList-ListItem')[0];

    _react2.fireEvent.click(nationalIdCardLine);

    expect(queryByText('Add: ID card')).toBeNull();
  });
});