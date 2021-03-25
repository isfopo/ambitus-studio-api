const validate = require("./helpers/validate");

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.content) {
    errors.push("body should contain content");
  }

  try {
    validate.message(body.content);
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    throw errors;
  } else {
    return body;
  }
};

module.exports = {
  validatePost,
};
