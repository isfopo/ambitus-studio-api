const validate = require("./helpers/validate");

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain an id");
  } else if (!body.name) {
    errors.push("body should contain a name");
  } else if (!body.settings) {
    errors.push("body should contain settings");
  } else if (!body.type) {
    errors.push("body should contain a type");
  }

  try {
    validate.id(body.id);
    validate.name(body.name);
    validate.settings(body.settings);
    validate.type(body.type);
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
