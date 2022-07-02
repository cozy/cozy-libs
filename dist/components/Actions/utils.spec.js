"use strict";

var _utils = require("./utils");

var _download = require("./Items/download");

var _forward = require("./Items/forward");

jest.mock('./Items/download');
jest.mock('./Items/forward');
describe('Actions utils', function () {
  describe('makeActions', function () {
    it('should have empty actions array', function () {
      var actions = (0, _utils.makeActions)();
      expect(actions).toStrictEqual([]);
    });
    it('should have object with key named with name property of the object returned by the function and value is the full object returned by the function', function () {
      var mockFuncActionWithName = jest.fn(function () {
        return {
          name: 'mockFuncActionWithName name'
        };
      });
      var actions = (0, _utils.makeActions)([mockFuncActionWithName]);
      expect(actions).toStrictEqual([{
        'mockFuncActionWithName name': {
          name: 'mockFuncActionWithName name'
        }
      }]);
    });
    it('should have object with key named with name of function passed and value is the full object returned by the function', function () {
      var mockFuncActionWithoutName = jest.fn(function () {
        return {
          propA: 0,
          propB: 1
        };
      });
      var actions = (0, _utils.makeActions)([mockFuncActionWithoutName]);
      expect(actions).toStrictEqual([{
        mockConstructor: {
          propA: 0,
          propB: 1
        }
      }]);
    });
  });
  describe('makeActionVariant', function () {
    it('should have "download" action on desktop', function () {
      global.navigator.share = null;
      expect((0, _utils.makeActionVariant)()).toStrictEqual([_download.download]);
    });
    it('should have "download" & "Forward" action (in this order) on mobile', function () {
      global.navigator.share = function () {};

      expect((0, _utils.makeActionVariant)()).toStrictEqual([_forward.forward, _download.download]);
    });
  });
});