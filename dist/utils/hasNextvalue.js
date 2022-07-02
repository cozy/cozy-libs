"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasNextvalue = void 0;

/**
 * Check if there is a next value
 * @param {number} curr - Current value
 * @param {object} array - Array oc current value
 */
var hasNextvalue = function hasNextvalue() {
  var curr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return curr < array.length - 1;
};

exports.hasNextvalue = hasNextvalue;