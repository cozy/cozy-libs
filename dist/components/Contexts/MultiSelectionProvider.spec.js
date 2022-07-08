"use strict";

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@testing-library/react");

require("@testing-library/jest-dom");

var _MultiSelectionProvider = _interopRequireWildcard(require("./MultiSelectionProvider"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var setup = function setup(_ref) {
  var filesToAdd = _ref.filesToAdd,
      removeFile = _ref.removeFile;

  var TestComponent = function TestComponent() {
    var _useContext = (0, _react.useContext)(_MultiSelectionProvider.default),
        isMultiSelectionActive = _useContext.isMultiSelectionActive,
        setIsMultiSelectionActive = _useContext.setIsMultiSelectionActive,
        addMultiSelectionFile = _useContext.addMultiSelectionFile,
        removeMultiSelectionFile = _useContext.removeMultiSelectionFile,
        removeAllMultiSelectionFiles = _useContext.removeAllMultiSelectionFiles,
        allMultiSelectionFiles = _useContext.allMultiSelectionFiles,
        changeCurrentMultiSelectionFile = _useContext.changeCurrentMultiSelectionFile,
        removeCurrentMultiSelectionFile = _useContext.removeCurrentMultiSelectionFile,
        removeAllCurrentMultiSelectionFiles = _useContext.removeAllCurrentMultiSelectionFiles,
        confirmCurrentMultiSelectionFiles = _useContext.confirmCurrentMultiSelectionFiles,
        currentMultiSelectionFiles = _useContext.currentMultiSelectionFiles;

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "multiSelectionFilesState"
    }, JSON.stringify(allMultiSelectionFiles)), /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "currentMultiSelectionFilesState"
    }, JSON.stringify(currentMultiSelectionFiles)), /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": "isActive"
    }, JSON.stringify(isMultiSelectionActive)), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "setActiveBtn",
      onClick: function onClick() {
        return setIsMultiSelectionActive(function (prev) {
          return !prev;
        });
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "addMultiSelectionBtn",
      onClick: function onClick() {
        return addMultiSelectionFile(filesToAdd.shift());
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "removeMultiSelectionFileBtn",
      onClick: function onClick() {
        return removeMultiSelectionFile(removeFile);
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "removeAllMultiSelectionBtn",
      onClick: function onClick() {
        return removeAllMultiSelectionFiles();
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "changeCurrentMultiSelectionBtn",
      onClick: function onClick() {
        return changeCurrentMultiSelectionFile(filesToAdd.shift());
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "removeCurrentMultiSelectionFileBtn",
      onClick: function onClick() {
        return removeCurrentMultiSelectionFile(removeFile);
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "removeAllCurrentMultiSelectionBtn",
      onClick: function onClick() {
        return removeAllCurrentMultiSelectionFiles();
      }
    }), /*#__PURE__*/_react.default.createElement("button", {
      "data-testid": "confirmCurrentMultiSelectionFiles",
      onClick: function onClick() {
        return confirmCurrentMultiSelectionFiles();
      }
    }));
  };

  return (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_MultiSelectionProvider.MultiSelectionProvider, null, /*#__PURE__*/_react.default.createElement(TestComponent, null)));
};

var fileMock01 = {
  _id: '01',
  name: 'file01'
};
var fileMock02 = {
  _id: '02',
  name: 'file02'
};
describe('MultiSelectionProvider', function () {
  describe('isMultiSelectionActive', function () {
    it('should remove all files to its state if isMultiSelectionActive is set to false', function () {
      var _setup = setup({
        filesToAdd: [fileMock01, fileMock02]
      }),
          getByTestId = _setup.getByTestId;

      var setActiveBtn = getByTestId('setActiveBtn');
      var addMultiSelectionBtn = getByTestId('addMultiSelectionBtn');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState'); // isMultiSelectionActive => true

      _react2.fireEvent.click(setActiveBtn);

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'); // isMultiSelectionActive => false

      _react2.fireEvent.click(setActiveBtn);

      expect(multiSelectionFilesState.textContent).toBe('[]');
    });
  });
  describe('addMultiSelectionFile', function () {
    it('should add file to its state', function () {
      var _setup2 = setup({
        filesToAdd: [fileMock01]
      }),
          getByTestId = _setup2.getByTestId;

      var addMultiSelectionBtn = getByTestId('addMultiSelectionBtn');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState');

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');
    });
    it('should add a second file to its state', function () {
      var _setup3 = setup({
        filesToAdd: [fileMock01, fileMock02]
      }),
          getByTestId = _setup3.getByTestId;

      var addMultiSelectionBtn = getByTestId('addMultiSelectionBtn');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState');

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]');
    });
    it('should add a second file to its state even if it is the same file', function () {
      var _setup4 = setup({
        filesToAdd: [fileMock01, fileMock01]
      }),
          getByTestId = _setup4.getByTestId;

      var addMultiSelectionBtn = getByTestId('addMultiSelectionBtn');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState');

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(addMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"01","name":"file01"}]');
    });
  });
  describe('removeMultiSelectionFile', function () {
    it('should remove specific file to its state', function () {
      var _setup5 = setup({
        filesToAdd: [fileMock01, fileMock02],
        removeFile: 0
      }),
          getByTestId = _setup5.getByTestId;

      var addMultiSelectionBtn = getByTestId('addMultiSelectionBtn');
      var removeMultiSelectionFileBtn = getByTestId('removeMultiSelectionFileBtn');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState');

      _react2.fireEvent.click(addMultiSelectionBtn);

      _react2.fireEvent.click(addMultiSelectionBtn);

      _react2.fireEvent.click(removeMultiSelectionFileBtn);

      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"02","name":"file02"}]');
    });
  });
  describe('removeAllMultiSelectionFiles', function () {
    it('should remove all files to its state', function () {
      var _setup6 = setup({
        filesToAdd: [fileMock01, fileMock02]
      }),
          getByTestId = _setup6.getByTestId;

      var addMultiSelectionBtn = getByTestId('addMultiSelectionBtn');
      var removeAllMultiSelectionBtn = getByTestId('removeAllMultiSelectionBtn');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState');

      _react2.fireEvent.click(addMultiSelectionBtn);

      _react2.fireEvent.click(addMultiSelectionBtn);

      _react2.fireEvent.click(removeAllMultiSelectionBtn);

      expect(multiSelectionFilesState.textContent).toBe('[]');
    });
  });
  describe('changeCurrentMultiSelectionFile', function () {
    it('should add file to its state', function () {
      var _setup7 = setup({
        filesToAdd: [fileMock01]
      }),
          getByTestId = _setup7.getByTestId;

      var changeCurrentMultiSelectionBtn = getByTestId('changeCurrentMultiSelectionBtn');
      var currentMultiSelectionFilesState = getByTestId('currentMultiSelectionFilesState');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');
    });
    it('should add a second file to its state', function () {
      var _setup8 = setup({
        filesToAdd: [fileMock01, fileMock02]
      }),
          getByTestId = _setup8.getByTestId;

      var changeCurrentMultiSelectionBtn = getByTestId('changeCurrentMultiSelectionBtn');
      var currentMultiSelectionFilesState = getByTestId('currentMultiSelectionFilesState');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]');
    });
    it('should remove the file from its state if it was already present', function () {
      var _setup9 = setup({
        filesToAdd: [fileMock01, fileMock01]
      }),
          getByTestId = _setup9.getByTestId;

      var changeCurrentMultiSelectionBtn = getByTestId('changeCurrentMultiSelectionBtn');
      var currentMultiSelectionFilesState = getByTestId('currentMultiSelectionFilesState');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[]');
    });
  });
  describe('removeCurrentMultiSelectionFile', function () {
    it('should remove specific file to its state', function () {
      var _setup10 = setup({
        filesToAdd: [fileMock01, fileMock02],
        removeFile: fileMock01
      }),
          getByTestId = _setup10.getByTestId;

      var changeCurrentMultiSelectionBtn = getByTestId('changeCurrentMultiSelectionBtn');
      var removeCurrentMultiSelectionFileBtn = getByTestId('removeCurrentMultiSelectionFileBtn');
      var currentMultiSelectionFilesState = getByTestId('currentMultiSelectionFilesState');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      _react2.fireEvent.click(removeCurrentMultiSelectionFileBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"02","name":"file02"}]');
    });
  });
  describe('removeAllCurrentMultiSelectionFiles', function () {
    it('should remove all files to its state', function () {
      var _setup11 = setup({
        filesToAdd: [fileMock01, fileMock02]
      }),
          getByTestId = _setup11.getByTestId;

      var changeCurrentMultiSelectionBtn = getByTestId('changeCurrentMultiSelectionBtn');
      var removeAllCurrentMultiSelectionBtn = getByTestId('removeAllCurrentMultiSelectionBtn');
      var currentMultiSelectionFilesState = getByTestId('currentMultiSelectionFilesState');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      _react2.fireEvent.click(removeAllCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[]');
    });
  });
  describe('confirmCurrentMultiSelectionFiles', function () {
    it('should move all files in currentMultiSelectionFilesState to multiSelectionFilesState', function () {
      var _setup12 = setup({
        filesToAdd: [fileMock01, fileMock02]
      }),
          getByTestId = _setup12.getByTestId;

      var changeCurrentMultiSelectionBtn = getByTestId('changeCurrentMultiSelectionBtn');
      var confirmCurrentMultiSelectionBtn = getByTestId('confirmCurrentMultiSelectionFiles');
      var currentMultiSelectionFilesState = getByTestId('currentMultiSelectionFilesState');
      var multiSelectionFilesState = getByTestId('multiSelectionFilesState');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"}]');
      expect(multiSelectionFilesState.textContent).toBe('[]');

      _react2.fireEvent.click(changeCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]');
      expect(multiSelectionFilesState.textContent).toBe('[]');

      _react2.fireEvent.click(confirmCurrentMultiSelectionBtn);

      expect(currentMultiSelectionFilesState.textContent).toBe('[]');
      expect(multiSelectionFilesState.textContent).toBe('[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]');
    });
  });
});