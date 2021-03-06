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

module.exports = {
  getNextIndex,
};
