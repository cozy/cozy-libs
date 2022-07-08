"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterWithRemaining = void 0;

/**
 * @typedef {object} FilterWithRemainingResponse
 * @property {Array} itemsFound - Array with the items that pass the test.
 * @property {Array} remainingItems - Array with the items that not pass the test.
 */

/**
 * Filter the elements of an array and return the found and remaining elements separately.
 *
 * @param {Array} array - The array with the items that must be tested.
 * @param {Function} callback - Function to execute on each value in the array.
 * The function is called with the following arguments:
 * - item: The current element in the array.
 * - index: The index (position) of the current element in the array.
 * @returns {FilterWithRemainingResponse} The items found and remaining.
 */
var filterWithRemaining = function filterWithRemaining(array, callback) {
  var itemsFound = [],
      remainingItems = [];
  array.forEach(function (arr, index) {
    var _arr$model;

    var currentItem = (_arr$model = arr === null || arr === void 0 ? void 0 : arr.model) !== null && _arr$model !== void 0 ? _arr$model : arr;
    if (callback(currentItem, index)) itemsFound.push(arr);else remainingItems.push(arr);
  });
  return {
    itemsFound: itemsFound,
    remainingItems: remainingItems
  };
};

exports.filterWithRemaining = filterWithRemaining;