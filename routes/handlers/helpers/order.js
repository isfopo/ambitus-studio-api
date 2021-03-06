"use strict";

/**
 * Get one more than greatest integer
 * @param {Array} objects array of objects to get next of
 * @param {String} key to get next of - must contain integers
 * @returns {Integer} one greater than greatest in object
 */
const getNextIndex = (objects, key) => {
  const errors = [];
  const indexes = objects.map((object) => {
    if (object.hasOwnProperty(key)) {
      if (typeof object[key] == "number") {
        return object[key];
      } else {
        errors.push("key is not an integer");
      }
    } else {
      errors.push("object does not contain key");
    }
  });

  const max = Math.max(...indexes);

  if (errors.length > 0) {
    throw errors;
  } else {
    return max + 1;
  }
};

/**
 * Reorders an array by removing an element and inserting at a given index
 * @param {Array} array array to reorder
 * @param {String} key to match value with
 * @param {String} value value of element to replace
 * @param {Number} index to insert element
 * @returns {Array} reordered array
 */
const reorderByProperty = (array, key, value, index) => {
  const match = array.find((element) => element[key] === value);

  let leftovers;
  if (match === undefined) {
    throw new Error("key or value is not in array");
  } else {
    leftovers = array.filter((element) => element[key] !== value);
    if (index + 1 < array.length) {
      leftovers.splice(index, 0, match);
    } else {
      leftovers.splice(array.length - 1, 0, match);
    }
  }
  return leftovers;
};

module.exports = {
  getNextIndex,
  reorderByProperty,
};
