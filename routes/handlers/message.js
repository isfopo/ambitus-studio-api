const validate = require("./helpers/validate");

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.ProjectId) {
    errors.push("body should contain a ProjectId");
  } else if (!body.content) {
    errors.push("body should contain content");
  }

  try {
    validate.id(body.ProjectId);
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
