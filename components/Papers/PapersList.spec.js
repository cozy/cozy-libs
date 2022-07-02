'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _AppLike = _interopRequireDefault(require("../../../test/components/AppLike"));

var _PapersList = _interopRequireDefault(require("./PapersList"));

var _templateObject;

var mockPapers = {
  maxDisplay: 2,
  list: [{
    _id: '001',
    name: 'File01'
  }, {
    _id: '002',
    name: 'File02'
  }, {
    _id: '003',
    name: 'File03'
  }, {
    _id: '004',
    name: 'File04'
  }]
};

var setup = function setup() {
  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_AppLike.default, null, /*#__PURE__*/_react.default.createElement(_PapersList.default, {
    papers: mockPapers
  })));
};

describe('PapersList components:', function () {
  it('should be rendered correctly', function () {
    var _setup = setup(),
        container = _setup.container;

    expect(container).toBeDefined();
  });
  it.each(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n    data\n    ", "\n    ", "\n    ", "\n  "])), 'File01', 'File02', 'See more (2)')("should display \"$data\"", function (_ref) {
    var data = _ref.data;

    var _setup2 = setup(),
        getByText = _setup2.getByText;

    expect(getByText(data));
  });
});