const validate = require("./helpers/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

/**
 * middleware that will check and parse token authentication header
 * @param {request} req express request Object
 * @param {response} res express response object
 * @param {next} next express callback function
 */
const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, userData) => {
      if (error) {
        return res.status(403).json({ error: ["token not authorized"] });
      } else {
        next();
      }
    });

    next();
  } else {
    return res.status(403).json({ error: ["token not present"] });
  }
};

module.exports = {
  validatePost,
  hashValidPassword,
  checkToken,
};
