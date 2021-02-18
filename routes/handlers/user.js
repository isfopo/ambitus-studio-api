const validate = require("./helpers/validate");
const bcrypt = require("bcrypt");

const UserTable = require("../../db/models").User;

require("dotenv").config();

/**
 * validates username and password of a user post request
 * @param {object} body the req.body of a user post router request
 */
const validatePost = (body = {}) => {
  const errors = [];

  if (!body.username) {
    errors.push("body should contain a username");
  } else if (!body.password) {
    errors.push("body should contain a password");
  }

  try {
    validate.name(body.username);
    validate.password(body.password);
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
 * hashes a password using bcrypt
 * @param {string} password a password that has been validated to be hashed
 */
const hashValidPassword = async (password = "") => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));

  return await bcrypt.hash(password, salt);
};

module.exports = {
  validatePost,
  hashValidPassword,
};
