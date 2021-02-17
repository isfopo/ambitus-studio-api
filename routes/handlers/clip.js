const validate = require("./helpers/validate");

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain an id");
  } else if (!body.type) {
    errors.push("body should contain a type");
  }

  try {
    validate.id(body.id);
    validate.type(body.type);
    body.name && validate.name(body.name);
    body.tempo && validate.tempo(body.tempo);
    body.time_signature && validate.timeSignature(body.time_signature);
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
