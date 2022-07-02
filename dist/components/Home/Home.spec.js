"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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
jest.mock('../ThemesFilter', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "ThemesFilter"
    });
  };
});
jest.mock('../SearchInput', function () {
  return function () {
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "SearchInput"
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
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it('should display only paperGroup in multi-selection mode', function () {
    var _setup2 = setup({
      isLoading: false,
      withData: true,
      isMultiSelectionActive: true
    }),
        queryByTestId = _setup2.queryByTestId,
        getByTestId = _setup2.getByTestId;

    expect(queryByTestId('ThemesFilter')).toBeNull();
    expect(queryByTestId('SearchInput')).toBeNull();
    expect(queryByTestId('FeaturedPlaceholdersList')).toBeNull();
    expect(getByTestId('PaperGroup'));
  });
  it('should display Spinner when all data are not loaded', function () {
    var _setup3 = setup(),
        getByRole = _setup3.getByRole;

    expect(getByRole('progressbar'));
  });
  it('should not display Spinner when all data are loaded', function () {
    var _setup4 = setup({
      isLoading: false
    }),
        queryByRole = _setup4.queryByRole;

    expect(queryByRole('progressbar')).toBeNull();
  });
  it('should display Empty when no data exists', function () {
    var _setup5 = setup({
      isLoading: false
    }),
        getByTestId = _setup5.getByTestId,
        queryByTestId = _setup5.queryByTestId;

    expect(getByTestId('Empty'));
    expect(queryByTestId('PaperGroup')).toBeNull();
  });
  it('should display PaperGroup when data exists', function () {
    var _setup6 = setup({
      isLoading: false,
      withData: true
    }),
        getByTestId = _setup6.getByTestId,
        queryByTestId = _setup6.queryByTestId;

    expect(getByTestId('PaperGroup'));
    expect(queryByTestId('Empty')).toBeNull();
  });
});