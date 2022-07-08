"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _input = require("./input");

var _templateObject, _templateObject2;

describe('Input Utils', function () {
  describe('makeInputTypeAndLength', function () {
    it.each(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n      attrs                                                                | result\n      ", "                                                | ", "\n      ", "                                 | ", "\n      ", "     | ", "\n      ", "                 | ", "\n      ", "        | ", "\n      ", "   | ", "\n      ", "   | ", "\n      ", "   | ", "\n      ", "  | ", "\n      ", "  | ", "\n      ", "  | ", "\n      ", " | ", "\n      ", "    | ", "\n      ", "  | ", "\n      ", "                                                         | ", "\n      ", "                                                  | ", "\n      ", "                                   | ", "\n      ", "       | ", "\n      ", "                   | ", "\n      ", "          | ", "\n      ", "     | ", "\n      ", "     | ", "\n      ", "     | ", "\n      ", "    | ", "\n      ", "    | ", "\n      ", "    | ", "\n      ", "   | ", "\n      ", "      | ", "\n      ", "    | ", "\n    "])), {
      type: 'number'
    }, {
      inputType: 'number',
      expectedLength: {
        min: null,
        max: null
      },
      isRequired: false
    }, {
      type: 'number',
      mask: '99999'
    }, {
      inputType: 'number',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: false
    }, {
      type: 'number',
      mask: '99999',
      minLength: 3,
      maxLength: 7
    }, {
      inputType: 'number',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: false
    }, {
      type: 'number',
      mask: '99999',
      required: true
    }, {
      inputType: 'number',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: true
    }, {
      type: 'number',
      mask: '99 99 99 99 99',
      required: true
    }, {
      inputType: 'number',
      expectedLength: {
        min: 10,
        max: 10
      },
      isRequired: true
    }, {
      type: 'number',
      mask: '99999',
      required: true,
      minLength: 3
    }, {
      inputType: 'number',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: true
    }, {
      type: 'number',
      mask: '99999',
      required: true,
      maxLength: 7
    }, {
      inputType: 'number',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: true
    }, {
      type: 'number',
      required: false,
      minLength: 0,
      maxLength: 0
    }, {
      inputType: 'number',
      expectedLength: {
        min: 0,
        max: 0
      },
      isRequired: false
    }, {
      type: 'number',
      required: false,
      minLength: 10,
      maxLength: 0
    }, {
      inputType: 'number',
      expectedLength: {
        min: 10,
        max: 0
      },
      isRequired: false
    }, {
      type: 'number',
      required: false,
      minLength: 0,
      maxLength: 10
    }, {
      inputType: 'number',
      expectedLength: {
        min: 0,
        max: 10
      },
      isRequired: false
    }, {
      type: 'number',
      required: false,
      minLength: 5,
      maxLength: 10
    }, {
      inputType: 'number',
      expectedLength: {
        min: 5,
        max: 10
      },
      isRequired: false
    }, {
      type: 'number',
      required: false,
      minLength: 10,
      maxLength: 10
    }, {
      inputType: 'number',
      expectedLength: {
        min: 10,
        max: 10
      },
      isRequired: false
    }, {
      type: 'number',
      required: true,
      minLength: 0,
      maxLength: 0
    }, {
      inputType: 'number',
      expectedLength: {
        min: 0,
        max: 0
      },
      isRequired: true
    }, {
      type: 'number',
      required: true,
      minLength: 20,
      maxLength: 10
    }, {
      inputType: 'number',
      expectedLength: {
        min: 20,
        max: 10
      },
      isRequired: true
    }, undefined, {
      inputType: 'text',
      expectedLength: {
        min: null,
        max: null
      },
      isRequired: false
    }, {
      type: 'text'
    }, {
      inputType: 'text',
      expectedLength: {
        min: null,
        max: null
      },
      isRequired: false
    }, {
      type: 'text',
      mask: 'aaaaa'
    }, {
      inputType: 'text',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: false
    }, {
      type: 'text',
      mask: 'aaaaa',
      minLength: 3,
      maxLength: 7
    }, {
      inputType: 'text',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: false
    }, {
      type: 'text',
      mask: 'aaaaa',
      required: true
    }, {
      inputType: 'text',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: true
    }, {
      type: 'text',
      mask: 'aa aa aa aa aa',
      required: true
    }, {
      inputType: 'text',
      expectedLength: {
        min: 10,
        max: 10
      },
      isRequired: true
    }, {
      type: 'text',
      mask: 'aaaaa',
      required: true,
      minLength: 3
    }, {
      inputType: 'text',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: true
    }, {
      type: 'text',
      mask: 'aaaaa',
      required: true,
      maxLength: 7
    }, {
      inputType: 'text',
      expectedLength: {
        min: 5,
        max: 5
      },
      isRequired: true
    }, {
      type: 'text',
      required: false,
      minLength: 0,
      maxLength: 0
    }, {
      inputType: 'text',
      expectedLength: {
        min: 0,
        max: 0
      },
      isRequired: false
    }, {
      type: 'text',
      required: false,
      minLength: 10,
      maxLength: 0
    }, {
      inputType: 'text',
      expectedLength: {
        min: 10,
        max: 0
      },
      isRequired: false
    }, {
      type: 'text',
      required: false,
      minLength: 0,
      maxLength: 10
    }, {
      inputType: 'text',
      expectedLength: {
        min: 0,
        max: 10
      },
      isRequired: false
    }, {
      type: 'text',
      required: false,
      minLength: 5,
      maxLength: 10
    }, {
      inputType: 'text',
      expectedLength: {
        min: 5,
        max: 10
      },
      isRequired: false
    }, {
      type: 'text',
      required: false,
      minLength: 10,
      maxLength: 10
    }, {
      inputType: 'text',
      expectedLength: {
        min: 10,
        max: 10
      },
      isRequired: false
    }, {
      type: 'text',
      required: true,
      minLength: 0,
      maxLength: 0
    }, {
      inputType: 'text',
      expectedLength: {
        min: 0,
        max: 0
      },
      isRequired: true
    }, {
      type: 'text',
      required: true,
      minLength: 20,
      maxLength: 10
    }, {
      inputType: 'text',
      expectedLength: {
        min: 20,
        max: 10
      },
      isRequired: true
    })("should return $result when passed argument: $attrs", function (_ref) {
      var attrs = _ref.attrs,
          result = _ref.result;
      expect((0, _input.makeConstraintsOfInput)(attrs)).toEqual(result);
    });
  });
  describe('checkInputConstraints', function () {
    it.each(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n      valueLength | expectedLength              | isRequired | result\n      ", "        | ", " | ", "   | ", "\n      ", "        | ", " | ", "    | ", "\n      ", "        | ", "    | ", "   | ", "\n      ", "        | ", "    | ", "    | ", "\n      ", "        | ", "    | ", "   | ", "\n      ", "        | ", "    | ", "    | ", "\n      ", "        | ", "       | ", "   | ", "\n      ", "        | ", "       | ", "    | ", "\n      ", "        | ", "   | ", "   | ", "\n      ", "        | ", "   | ", "    | ", "\n      ", "        | ", "   | ", "   | ", "\n      ", "        | ", "   | ", "    | ", "\n      ", "        | ", "     | ", "   | ", "\n      ", "        | ", "     | ", "   | ", "\n      ", "        | ", "     | ", "    | ", "\n      ", "        | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "     | ", "    | ", "\n      ", "       | ", "   | ", "   | ", "\n      ", "       | ", "   | ", "   | ", "\n      ", "       | ", "   | ", "   | ", "\n      ", "       | ", "   | ", "   | ", "\n      ", "       | ", "   | ", "   | ", "\n      ", "       | ", "   | ", "   | ", "\n    "])), 0, {
      min: null,
      max: null
    }, false, true, 0, {
      min: null,
      max: null
    }, true, false, 0, {
      min: null,
      max: 0
    }, false, true, 0, {
      min: null,
      max: 0
    }, true, false, 0, {
      min: 0,
      max: null
    }, false, true, 0, {
      min: 0,
      max: null
    }, true, false, 0, {
      min: 0,
      max: 0
    }, false, true, 0, {
      min: 0,
      max: 0
    }, true, false, 0, {
      min: null,
      max: 20
    }, false, true, 0, {
      min: null,
      max: 20
    }, true, false, 0, {
      min: 20,
      max: null
    }, false, true, 0, {
      min: 20,
      max: null
    }, true, false, 0, {
      min: 10,
      max: 30
    }, false, true, 0, {
      min: 30,
      max: 10
    }, false, true, 0, {
      min: 10,
      max: 30
    }, true, false, 0, {
      min: 30,
      max: 10
    }, true, false, 10, {
      min: 10,
      max: 30
    }, true, true, 10, {
      min: 30,
      max: 10
    }, true, false, 20, {
      min: 10,
      max: 30
    }, true, true, 20, {
      min: 30,
      max: 10
    }, true, false, 30, {
      min: 10,
      max: 30
    }, true, true, 30, {
      min: 30,
      max: 10
    }, true, false, 40, {
      min: 10,
      max: 30
    }, true, false, 40, {
      min: 30,
      max: 10
    }, true, false, 20, {
      min: null,
      max: 10
    }, false, false, 20, {
      min: null,
      max: 20
    }, false, true, 20, {
      min: null,
      max: 30
    }, false, true, 20, {
      min: 10,
      max: null
    }, false, true, 20, {
      min: 20,
      max: null
    }, false, true, 20, {
      min: 30,
      max: null
    }, false, false)("should return $result when passed argument: ($valueLength, $expectedLength, $isRequired)", function (_ref2) {
      var valueLength = _ref2.valueLength,
          expectedLength = _ref2.expectedLength,
          isRequired = _ref2.isRequired,
          result = _ref2.result;
      expect((0, _input.checkConstraintsOfIinput)(valueLength, expectedLength, isRequired)).toEqual(result);
    });
  });
});