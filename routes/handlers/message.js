const validate = require("./helpers/validate");

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain an id");
  } else if (!body.content) {
    errors.push("body should contain content");
  }

  try {
    validate.id(body.id);
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

const get = async (req, res) => {
  return res.status(200).json({ msg: "you made it!" });
};

module.exports = {
  validatePost,
  get,
};
