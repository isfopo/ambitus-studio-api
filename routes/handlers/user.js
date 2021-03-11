const validate = require("./helpers/validate");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../" + "temp") });
const fs = require("fs");

const models = require("../../db/models");

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
 * parses header to get authorization token
 * @param {Object} header headers from req.headers;
 * @returns {String} token
 */
const parseHeadersForToken = (headers = {}) => {
  const authorization = headers["authorization"];

  if (typeof authorization !== "undefined") {
    const bearer = authorization.split(" ");
    return bearer[1];
  } else {
    throw new Error("token not present");
  }
};

/**
 * verifies the given json web token and returns token contents
 * @param {String} token the JWT from request
 * @returns {Object} token contents
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * middleware that will check and parse token authentication header assigning user id and name to req.user
 * @param {request} req express request Object
 * @param {response} res express response object
 * @param {next} next express callback function
 */
const authorize = async (req, res, next) => {
  try {
    const token = parseHeadersForToken(req.headers);
    const user = verifyToken(token);
    req.user = await findInDatabase(user.UserId);
    next();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

/**
 * determines if given user id is present in database
 * @param {string} UserId the UserId of the user to be found
 * @returns {boolean} if the user is found
 */
const findInDatabase = async (UserId = "") => {
  const user = await models.User.findByPk(validate.id(UserId));

  if (user === null) {
    throw new Error("Couldn't find requested user in database");
  } else {
    return user;
  }
};

/**
 * checks password password in database
 * @param {String} username given user's username
 * @param {String} password to test
 * @returns {Object} User object if correct, error if not
 */
const verifyPassword = async (username = "", password = "") => {
  const user = await models.User.findOne({
    where: { username },
  });
  if (user === null) {
    throw new Error("username does not exist");
  } else {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return user;
    } else {
      throw new Error("password does not match");
    }
  }
};

/**
 * signs json web token with UserId and username
 * @param {String} UserId to embed in token
 * @param {String} username to embed in token
 * @returns {String} json web token
 */
const signToken = async (UserId = "") => {
  return await jwt.sign({ UserId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * saves an avatar to a user in database
 * @param {Object} user object returned from database
 * @param {Object} avatar from request
 */
const saveAvatar = async (user, avatar) => {
  user.avatar = avatar.path;
  user.avatar_type = avatar.mimetype;
  await user.save();
};

/**
 * leaves all projects that a given user is in
 * @param {Object} user object from database
 */
const leaveAllProjects = async (user) => {
  const projects = await user.getProjects();
  projects.forEach(async (project) => {
    leave(user, project);
  });
};

/**
 * deletes all messages of a user
 * @params {Object} user
 */
const deleteAllMessages = async (user) => {
  const messages = await user.getMessages();
  messages.forEach(async (message) => {
    await message.destroy();
  });
};

/**
 * removes a given user from a project
 * @param {Object} user object from database
 * @param {Object} project object from database
 */
const leave = async (user, project) => {
  await project.removeUser(user);
  const usersLeftInProject = await project.getUsers();
  if (usersLeftInProject.length === 0) {
    await project.destroy();
  }
};

module.exports = {
  validatePost,
  authorize,
  findInDatabase,
  hashValidPassword,
  verifyPassword,
  signToken,
  saveAvatar,
  leaveAllProjects,
  deleteAllMessages,
  leave,
};
