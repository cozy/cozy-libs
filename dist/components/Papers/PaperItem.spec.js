"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

require("@testing-library/jest-dom");

var _reactRouterDom = require("react-router-dom");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _PaperItem = _interopRequireDefault(require("./PaperItem"));

var _useMultiSelection = require("../Hooks/useMultiSelection");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

jest.mock('react-router-dom', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('react-router-dom')), {}, {
    useHistory: jest.fn()
  });
});
jest.mock('../Hooks/useMultiSelection');
var mockFile = {
  _id: 'fileId01',
  name: 'file01.pdf',
  metadata: {
    datetime: '2022-01-01T09:00:00.000Z',
    qualification: {
      page: 'Front',
      label: 'file01 - Qualification label'
    }
  },
  relationships: {
    referenced_by: {
      data: [{
        id: 'contactId01',
        type: 'io.cozy.contacts'
      }]
    }
  }
};

var MockChildren = function MockChildren() {
  return /*#__PURE__*/_react.default.createElement("div", {
    "data-testid": "MockChildren"
  });
};

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$paper = _ref.paper,
      paper = _ref$paper === void 0 ? mockFile : _ref$paper,
      contactNames = _ref.contactNames,
      divider = _ref.divider,
      withCheckbox = _ref.withCheckbox,
      withChildren = _ref.withChildren,
      _ref$isMultiSelection = _ref.isMultiSelectionActive,
      isMultiSelectionActive = _ref$isMultiSelection === void 0 ? false : _ref$isMultiSelection,
      _ref$currentMultiSele = _ref.currentMultiSelectionFiles,
      currentMultiSelectionFiles = _ref$currentMultiSele === void 0 ? [] : _ref$currentMultiSele,
      _ref$changeCurrentMul = _ref.changeCurrentMultiSelectionFile,
      changeCurrentMultiSelectionFile = _ref$changeCurrentMul === void 0 ? jest.fn() : _ref$changeCurrentMul,
      _ref$historyPush = _ref.historyPush,
      historyPush = _ref$historyPush === void 0 ? jest.fn() : _ref$historyPush;

  _useMultiSelection.useMultiSelection.mockReturnValue({
    isMultiSelectionActive: isMultiSelectionActive,
    currentMultiSelectionFiles: currentMultiSelectionFiles,
    changeCurrentMultiSelectionFile: changeCurrentMultiSelectionFile
  });

  _reactRouterDom.useHistory.mockReturnValue({
    push: historyPush
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_PaperItem.default, {
    paper: paper,
    contactNames: contactNames,
    divider: divider,
    withCheckbox: withCheckbox
  }, withChildren && /*#__PURE__*/_react.default.createElement(MockChildren, null))));
};

describe('PaperItem components', function () {
  describe('ListItemSecondaryAction', function () {
    it('should not display if have not children', function () {
      var _setup = setup(),
          queryByTestId = _setup.queryByTestId;

      expect(queryByTestId('ListItemSecondaryAction')).toBeNull();
    });
    it('should display if have a children', function () {
      var _setup2 = setup({
        withChildren: true
      }),
          getByTestId = _setup2.getByTestId;

      expect(getByTestId('ListItemSecondaryAction'));
    });
  });
  describe('Divider', function () {
    it('should not display by default', function () {
      var _setup3 = setup(),
          queryByTestId = _setup3.queryByTestId;

      expect(queryByTestId('Divider')).toBeNull();
    });
    it('should display if divider prop is true', function () {
      var _setup4 = setup({
        divider: true
      }),
          getByTestId = _setup4.getByTestId;

      expect(getByTestId('Divider'));
    });
  });
  describe('Checkbox', function () {
    it('should not display by default', function () {
      var _setup5 = setup(),
          queryByTestId = _setup5.queryByTestId;

      expect(queryByTestId('Checkbox')).toBeNull();
    });
    it('should not display when is not on multiselection context & withCheckbox prop is true', function () {
      var _setup6 = setup({
        isMultiSelectionActive: false,
        withCheckbox: true
      }),
          queryByTestId = _setup6.queryByTestId;

      expect(queryByTestId('Checkbox')).toBeNull();
    });
    it('should not display when is on multiselection context & withCheckbox prop is false', function () {
      var _setup7 = setup({
        isMultiSelectionActive: true,
        withCheckbox: false
      }),
          queryByTestId = _setup7.queryByTestId;

      expect(queryByTestId('Checkbox')).toBeNull();
    });
    it('should display when is on multiselection context & withCheckbox prop is true', function () {
      var _setup8 = setup({
        isMultiSelectionActive: true,
        withCheckbox: true
      }),
          getByTestId = _setup8.getByTestId;

      expect(getByTestId('Checkbox'));
    });
    it('should already checked if is in currentMultiSelectionFiles', function () {
      var _setup9 = setup({
        isMultiSelectionActive: true,
        withCheckbox: true,
        currentMultiSelectionFiles: [{
          _id: 'fileId01'
        }]
      }),
          container = _setup9.container;

      var inputCheckbox = container.querySelector('input[type="checkbox"]');
      expect(inputCheckbox).toHaveAttribute('checked');
    });
  });
  describe('ListItemText', function () {
    it('should display only date by default', function () {
      var _setup10 = setup(),
          getByText = _setup10.getByText;

      expect(getByText('01/01/2022'));
    });
    it('should display names & date when contactNames exists', function () {
      var _setup11 = setup({
        contactNames: 'Bob, Charlie'
      }),
          getByText = _setup11.getByText;

      expect(getByText('Bob, Charlie · 01/01/2022'));
    });
  });
  describe('handleClick', function () {
    it('should call "history.push" by default', function () {
      var historyPush = jest.fn();

      var _setup12 = setup({
        historyPush: historyPush
      }),
          getByTestId = _setup12.getByTestId;

      _react2.fireEvent.click(getByTestId('ListItem'));

      expect(historyPush).toBeCalledTimes(1);
    });
    it('should call "history.push" one time when withCheckbox is true & is not on multiselection context', function () {
      var historyPush = jest.fn();
      var changeCurrentMultiSelectionFile = jest.fn();

      var _setup13 = setup({
        withCheckbox: true,
        historyPush: historyPush,
        changeCurrentMultiSelectionFile: changeCurrentMultiSelectionFile
      }),
          getByTestId = _setup13.getByTestId;

      _react2.fireEvent.click(getByTestId('ListItem'));

      expect(historyPush).toBeCalledTimes(1);
      expect(changeCurrentMultiSelectionFile).toBeCalledTimes(0);
    });
    it('should call "changeCurrentMultiSelectionFile" one time when withCheckbox is true & is on multiselection context', function () {
      var historyPush = jest.fn();
      var changeCurrentMultiSelectionFile = jest.fn();

      var _setup14 = setup({
        withCheckbox: true,
        isMultiSelectionActive: true,
        historyPush: historyPush,
        changeCurrentMultiSelectionFile: changeCurrentMultiSelectionFile
      }),
          getByTestId = _setup14.getByTestId;

      _react2.fireEvent.click(getByTestId('ListItem'));

      expect(historyPush).toBeCalledTimes(0);
      expect(changeCurrentMultiSelectionFile).toBeCalledTimes(1);
    });
  });
});