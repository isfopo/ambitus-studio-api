const validate = require("./helpers/validate");

const validatePost = (body) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain a username");
  } else if (!body.name) {
    errors.push("body should contain a password");
  } else if (!body.tempo) {
    errors.push("body should contain a password");
  } else if (!body.time_signature) {
    errors.push("body should contain a password");
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

module.exports = {
  validatePost,
};
