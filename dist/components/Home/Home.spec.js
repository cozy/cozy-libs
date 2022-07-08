"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _cozyClient = require("cozy-client");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _Home = _interopRequireDefault(require("./Home"));

var _useMultiSelection = require("../Hooks/useMultiSelection");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/* eslint-disable react/display-name */
jest.mock('./HomeToolbar', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "HomeToolbar"
    });
  };
});
jest.mock('../Papers/PaperGroup', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "PaperGroup"
    });
  };
});
jest.mock('../SearchResult/SearchResult', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "SearchResult"
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
jest.mock('../Placeholders/FeaturedPlaceholdersList', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "FeaturedPlaceholdersList"
    });
  };
});
/* eslint-enable react/display-name */

jest.mock('../Hooks/useMultiSelection');
jest.mock('cozy-client/dist/hooks', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client/dist/hooks')), {}, {
    useQueryAll: jest.fn()
  });
});
jest.mock('cozy-client/dist/utils', function () {
  return _objectSpread(_objectSpread({}, jest.requireActual('cozy-client/dist/utils')), {}, {
    isQueryLoading: jest.fn(),
    hasQueryBeenLoaded: jest.fn(),
    useQueryAll: jest.fn()
  });
});

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? true : _ref$isLoading,
      _ref$withData = _ref.withData,
      withData = _ref$withData === void 0 ? false : _ref$withData,
      _ref$isMultiSelection = _ref.isMultiSelectionActive,
      isMultiSelectionActive = _ref$isMultiSelection === void 0 ? false : _ref$isMultiSelection;

  _useMultiSelection.useMultiSelection.mockReturnValue({
    isMultiSelectionActive: isMultiSelectionActive
  });

  _cozyClient.isQueryLoading.mockReturnValue(isLoading);

  _cozyClient.useQueryAll.mockReturnValue({
    data: withData ? [{
      metadata: {
        qualification: {
          label: 'LabelQualif'
        }
      }
    }] : [],
    hasMore: false
  });

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_Home.default, null)));
};

describe('Home components:', function () {
  beforeEach(function () {
    jest.clearAllMocks();
  });
  it('should display Spinner when all data are not loaded', function () {
    var _setup = setup(),
        getByRole = _setup.getByRole;

    expect(getByRole('progressbar'));
  });
  it('should not display Spinner when all data are loaded', function () {
    var _setup2 = setup({
      isLoading: false
    }),
        queryByRole = _setup2.queryByRole;

    expect(queryByRole('progressbar')).toBeNull();
  });
  it('should display Empty when no data exists', function () {
    var _setup3 = setup({
      isLoading: false
    }),
        getByTestId = _setup3.getByTestId,
        queryByTestId = _setup3.queryByTestId;

    expect(getByTestId('Empty'));
    expect(queryByTestId('PaperGroup')).toBeNull();
  });
  it('should display PaperGroup when data exists', function () {
    var _setup4 = setup({
      isLoading: false,
      withData: true
    }),
        getByTestId = _setup4.getByTestId,
        queryByTestId = _setup4.queryByTestId;

    expect(getByTestId('PaperGroup'));
    expect(queryByTestId('Empty')).toBeNull();
  });
  it('should display PaperGroup, SearchInput, ThemesFilter & FeaturedPlaceholdersList', function () {
    var _setup5 = setup({
      isLoading: false,
      withData: true
    }),
        getByTestId = _setup5.getByTestId,
        queryAllByTestId = _setup5.queryAllByTestId;

    expect(getByTestId('PaperGroup'));
    expect(getByTestId('SearchInput'));
    expect(queryAllByTestId('ThemesFilter')).not.toHaveLength(0);
    expect(getByTestId('FeaturedPlaceholdersList'));
  });
  it('should display ThemesFilter by default', function () {
    var _setup6 = setup({
      isLoading: false,
      withData: true
    }),
        queryAllByTestId = _setup6.queryAllByTestId;

    expect(queryAllByTestId('ThemesFilter')).not.toHaveLength(0);
  });
  it('should not display SwitchButton by default', function () {
    var _setup7 = setup({
      isLoading: false,
      withData: true
    }),
        queryByTestId = _setup7.queryByTestId;

    expect(queryByTestId('SwitchButton')).toBeNull();
  });
  it('should hide ThemesFilter when SearchInput is focused', function () {
    var _setup8 = setup({
      isLoading: false,
      withData: true
    }),
        queryAllByTestId = _setup8.queryAllByTestId,
        getByTestId = _setup8.getByTestId;

    expect(queryAllByTestId('ThemesFilter')).not.toHaveLength(0);

    _react2.fireEvent.focus(getByTestId('SearchInput'));

    expect(queryAllByTestId('ThemesFilter')).toHaveLength(0);
  });
  it('should display ThemesFilter when click on SwitchButton', function () {
    var _setup9 = setup({
      isLoading: false,
      withData: true
    }),
        queryAllByTestId = _setup9.queryAllByTestId,
        getByTestId = _setup9.getByTestId;

    _react2.fireEvent.focus(getByTestId('SearchInput'));

    expect(queryAllByTestId('ThemesFilter')).toHaveLength(0);

    _react2.fireEvent.click(getByTestId('SwitchButton'));

    expect(queryAllByTestId('ThemesFilter')).not.toHaveLength(0);
  });
  it('should hide SwitchButton when click on it', function () {
    var _setup10 = setup({
      isLoading: false,
      withData: true
    }),
        queryByTestId = _setup10.queryByTestId,
        getByTestId = _setup10.getByTestId;

    _react2.fireEvent.focus(getByTestId('SearchInput'));

    expect(getByTestId('SwitchButton'));

    _react2.fireEvent.click(getByTestId('SwitchButton'));

    expect(queryByTestId('SwitchButton')).toBeNull();
  });
  it('should not display SearchResult by default', function () {
    var _setup11 = setup({
      isLoading: false,
      withData: true
    }),
        queryByTestId = _setup11.queryByTestId;

    expect(queryByTestId('SearchResult')).toBeNull();
  });
  it('should display SearchResult instead PaperGroup when ThemesFilter is clicked', function () {
    var _setup12 = setup({
      isLoading: false,
      withData: true
    }),
        queryByTestId = _setup12.queryByTestId,
        queryAllByTestId = _setup12.queryAllByTestId,
        getByTestId = _setup12.getByTestId;

    _react2.fireEvent.click(queryAllByTestId('ThemesFilter')[0]);

    expect(getByTestId('SearchResult'));
    expect(queryByTestId('PaperGroup')).toBeNull();
  });
  it('should display PaperGroup instead SearchResult when same ThemesFilter is clicked again', function () {
    var _setup13 = setup({
      isLoading: false,
      withData: true
    }),
        queryByTestId = _setup13.queryByTestId,
        queryAllByTestId = _setup13.queryAllByTestId,
        getByTestId = _setup13.getByTestId;

    _react2.fireEvent.click(queryAllByTestId('ThemesFilter')[0]);

    _react2.fireEvent.click(queryAllByTestId('ThemesFilter')[0]);

    expect(getByTestId('PaperGroup'));
    expect(queryByTestId('SearchResult')).toBeNull();
  });
  it('should display SearchResult instead PaperGroup when SearchInput is filled', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var _setup14, queryByTestId, getByTestId;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _setup14 = setup({
              isLoading: false,
              withData: true
            }), queryByTestId = _setup14.queryByTestId, getByTestId = _setup14.getByTestId;
            expect(getByTestId('PaperGroup'));
            expect(queryByTestId('SearchResult')).toBeNull();

            _react2.fireEvent.change(getByTestId('SearchInput'), {
              target: {
                value: 'cozy'
              }
            });

            _context.next = 6;
            return (0, _react2.waitFor)(function () {
              expect(getByTestId('SearchResult'));
              expect(queryByTestId('PaperGroup')).toBeNull();
            }, {
              timeout: 400
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  describe('multi-selection mode', function () {
    it('should display PaperGroup, SearchInput & SwitchButton', function () {
      var _setup15 = setup({
        isLoading: false,
        withData: true,
        isMultiSelectionActive: true
      }),
          getByTestId = _setup15.getByTestId;

      expect(getByTestId('PaperGroup'));
      expect(getByTestId('SearchInput'));
      expect(getByTestId('SwitchButton'));
    });
    it('should not display ThemesFilter by default', function () {
      var _setup16 = setup({
        isLoading: false,
        withData: true,
        isMultiSelectionActive: true
      }),
          queryAllByTestId = _setup16.queryAllByTestId;

      expect(queryAllByTestId('ThemesFilter')).toHaveLength(0);
    });
    it('should not display FeaturedPlaceholdersList', function () {
      var _setup17 = setup({
        isLoading: false,
        withData: true,
        isMultiSelectionActive: true
      }),
          queryByTestId = _setup17.queryByTestId;

      expect(queryByTestId('FeaturedPlaceholdersList')).toBeNull();
    });
  });
});