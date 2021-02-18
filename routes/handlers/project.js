const validate = require("./helpers/validate");

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain an id");
  } else if (!body.name) {
    errors.push("body should contain a name");
  } else if (!body.tempo) {
    errors.push("body should contain a tempo");
  } else if (!body.time_signature) {
    errors.push("body should contain a time signature");
  }

  try {
    validate.id(body.id);
    validate.name(body.name);
    validate.tempo(body.tempo);
    validate.timeSignature(body.time_signature);
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    throw errors;
  } else {
    return body;
  }
};

/**
 * determines if given user id is present in database
 * @param {string} id the id of the user to be found
 * @returns {boolean} if the user is found
 */
const isInDatabase = (id = "") => {};

module.exports = {
  validatePost,
  isInDatabase,
};
