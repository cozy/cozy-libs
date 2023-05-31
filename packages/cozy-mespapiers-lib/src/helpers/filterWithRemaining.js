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
export const filterWithRemaining = (array, callback) => {
  const [itemsFound, remainingItems] = [[], []]

  array?.forEach((arr, index) => {
    const currentItem = arr?.model ?? arr

    if (callback(currentItem, index)) itemsFound.push(arr)
    else remainingItems.push(arr)
  })

  return { itemsFound, remainingItems }
}
