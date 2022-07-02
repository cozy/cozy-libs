"use strict";

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@testing-library/react");

require("@testing-library/jest-dom");

var _MultiSelectionProvider = _interopRequireWildcard(require("./MultiSelectionProvider"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var setup = function setup(_ref) {
  var firstAdd = _ref.firstAdd,
      secondAdd = _ref.secondAdd,
      removeFile = _ref.removeFile;

  var TestComponent = function TestComponent() {
    var _useContext = (0, _react.useContext)(_MultiSelectionProvider.default),
        isMultiSelectionActive = _useContext.isMultiSelectionActive,
        setIsMultiSelectionActive = _useContext.setIsMultiSelectionActive,
        addMultiSelectionFile = _useContext.addMultiSelectionFile,
        removeMultiSelectionFile = _useContext.removeMultiSelectionFile,
        removeAllMultiSelectionFiles = _useContext.removeAllMultiSelectionFiles,
        multiSelectionFiles = _useContext.multiSelectionFiles;

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "result"
    }, JSON.stringify(multiSelectionFiles)), /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "isActive"
    }, JSON.stringify(isMultiSelectionActive)), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "setActiveBtn",
      onClick: function onClick() {
        return setIsMultiSelectionActive(function (prev) {
          return !prev;
        });
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "firstAddBtn",
      onClick: function onClick() {
        return addMultiSelectionFile(firstAdd);
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "secondAddBtn",
      onClick: function onClick() {
        return addMultiSelectionFile(secondAdd);
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "removeFileBtn",
      onClick: function onClick() {
        return removeMultiSelectionFile(removeFile);
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "removeAllBtn",
      onClick: function onClick() {
        return removeAllMultiSelectionFiles();
      }
    }));
  };

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_MultiSelectionProvider.MultiSelectionProvider, null, /*#__PURE__*/_react.default.createElement(TestComponent, null)));
};

describe('MultiSelectionProvider', function () {
  describe('isMultiSelectionActive', function () {
    it('should remove all files to its state if isMultiSelectionActive is set to false', function () {
      var fileMock01 = {
        _id: '01',
        name: 'file01'
      };
      var fileMock02 = {
        _id: '02',
        name: 'file02'
      };

      var _setup = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02
      }),
          getByTestId = _setup.getByTestId;

      var setActiveBtn = getByTestId('setActiveBtn');
      var firstAddBtn = getByTestId('firstAddBtn');
      var secondAddBtn = getByTestId('secondAddBtn');
      var result = getByTestId('result'); // isMultiSelectionActive => true

      _react2.fireEvent.click(setActiveBtn);

      _react2.fireEvent.click(firstAddBtn);

      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(secondAddBtn);

      expect(result.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'); // isMultiSelectionActive => false

      _react2.fireEvent.click(setActiveBtn);

      expect(result.textContent).toBe('[]');
    });
  });
  describe('addMultiSelectionFile', function () {
    it('should add file to its state', function () {
      var fileMock = {
        _id: '00',
        name: 'file00'
      };

      var _setup2 = setup({
        firstAdd: fileMock
      }),
          getByTestId = _setup2.getByTestId;

      var firstAddBtn = getByTestId('firstAddBtn');
      var result = getByTestId('result');

      _react2.fireEvent.click(firstAddBtn);

      expect(result.textContent).toBe('[{"_id":"00","name":"file00"}]');
    });
    it('should add a second file to its state', function () {
      var fileMock01 = {
        _id: '01',
        name: 'file01'
      };
      var fileMock02 = {
        _id: '02',
        name: 'file02'
      };

      var _setup3 = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02
      }),
          getByTestId = _setup3.getByTestId;

      var firstAddBtn = getByTestId('firstAddBtn');
      var secondAddBtn = getByTestId('secondAddBtn');
      var result = getByTestId('result');

      _react2.fireEvent.click(firstAddBtn);

      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(secondAddBtn);

      expect(result.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]');
    });
    it('should not add a second file to its state if it is the same file', function () {
      var fileMock01 = {
        _id: '01',
        name: 'file01'
      };

      var _setup4 = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock01
      }),
          getByTestId = _setup4.getByTestId;

      var firstAddBtn = getByTestId('firstAddBtn');
      var secondAddBtn = getByTestId('secondAddBtn');
      var result = getByTestId('result');

      _react2.fireEvent.click(firstAddBtn);

      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(secondAddBtn);

      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]');
    });
  });
  describe('removeMultiSelectionFile', function () {
    it('should remove specific file to its state', function () {
      var fileMock01 = {
        _id: '01',
        name: 'file01'
      };
      var fileMock02 = {
        _id: '02',
        name: 'file02'
      };

      var _setup5 = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02,
        removeFile: fileMock01
      }),
          getByTestId = _setup5.getByTestId;

      var firstAddBtn = getByTestId('firstAddBtn');
      var secondAddBtn = getByTestId('secondAddBtn');
      var removeFileBtn = getByTestId('removeFileBtn');
      var result = getByTestId('result');

      _react2.fireEvent.click(firstAddBtn);

      _react2.fireEvent.click(secondAddBtn);

      _react2.fireEvent.click(removeFileBtn);

      expect(result.textContent).toBe('[{"_id":"02","name":"file02"}]');
    });
  });
  describe('removeAllMultiSelectionFiles', function () {
    it('should remove all files to its state', function () {
      var fileMock01 = {
        _id: '01',
        name: 'file01'
      };
      var fileMock02 = {
        _id: '02',
        name: 'file02'
      };

      var _setup6 = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02,
        removeFile: fileMock01
      }),
          getByTestId = _setup6.getByTestId;

      var firstAddBtn = getByTestId('firstAddBtn');
      var secondAddBtn = getByTestId('secondAddBtn');
      var removeAllBtn = getByTestId('removeAllBtn');
      var result = getByTestId('result');

      _react2.fireEvent.click(firstAddBtn);

      _react2.fireEvent.click(secondAddBtn);

      _react2.fireEvent.click(removeAllBtn);

      expect(result.textContent).toBe('[]');
    });
  });
});