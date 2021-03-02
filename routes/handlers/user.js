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
  let output;
  jwt.verify(token, process.env.JWT_SECRET, async (error, contents) => {
    if (error) {
      throw new Error("token not authorized");
    } else {
      if (contents.exp < Date.now()) {
        output = contents;
      } else {
        throw new Error("token has expired");
      }
    }
  });
  return output;
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
 * gets list of all of a user's projects
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const getProjects = async (req, res) => {
  try {
    return res.status(200).json({
      UserId: req.user.UserId,
      projects: await req.user.getProjects(),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

/**
 * gets a user's avatar
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const getAvatar = async (req, res) => {
  try {
    const user = await findInDatabase(req.body.UserId);
    const stream = fs.createReadStream(user.avatar);

    stream.on("error", async (err) => {
      user.avatar = path.join(
        __dirname,
        "../../assets/images/default-avatar.jpg"
      );
      user.avatar_type = "image/jpeg";
      await user.save();
      res.status(404).json({ error: ["could not find avatar"] });
    });

    res.setHeader("Content-Type", user.avatar_type);
    stream.pipe(res);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

const getInvited = async (req, res) => {
  const allProjects = await models.Project.findAll(); // TODO: this might be too expensive, maybe rethink
};

/**
 * changes a user's name in database
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const putUsername = async (req, res) => {
  try {
    req.user.username = validate.name(req.body.newName);

    await req.user.save();

    return res
      .status(200)
      .json({ UserId: req.user.UserId, username: req.user.username });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: ["username already exists"] });
    } else {
      return res.status(400).json({ error: e.message });
    }
  }
};

/**
 * changes a user's password in database
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const putPassword = async (req, res) => {
  try {
    req.user.password = await hashValidPassword(
      validate.password(req.body.newPassword)
    );
    await req.user.save();

    return res.status(200).json({ UserId: req.user.UserId });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

/**
 * changes a user's avatar in database
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const putAvatar = async (req, res) => {
  try {
    const userInDb = await models.User.findByPk(req.user.UserId);

    const avatar = validate.avatar(req.file);

    if (!userInDb.avatar.includes("default-avatar.jpg")) {
      fs.unlink(req.user.avatar, async (error) => {
        req.user.avatar = avatar.path;
        req.user.avatar_type = avatar.mimetype;
        await req.user.save();

        res.status(200).json({
          UserId: req.user.UserId,
          username: req.user.username,
          avatar: req.user.avatar,
        });
      });
    } else {
      req.user.avatar = avatar.path;
      req.user.avatar_type = avatar.mimetype;
      await req.user.save();

      res.status(200).json({
        UserId: req.user.UserId,
        username: req.user.username,
        avatar: req.user.avatar,
      });
    }
  } catch (e) {
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({ error: e.message });
    });
  }
};

/**
 * removes a user from database
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const remove = async (req, res) => {
  try {
    // delete messages of user
    const messages = await req.user.getMessages();
    messages.forEach(async (message) => {
      await message.destroy();
    });
    if (!req.user.avatar.includes("default-avatar.jpg")) {
      fs.unlink(req.user.avatar, async (error) => {
        await req.user.destroy();
        return res.sendStatus(204);
      });
    } else {
      await req.user.destroy();
      return res.sendStatus(204);
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

module.exports = {
  validatePost,
  authorize,
  findInDatabase,
  hashValidPassword,
  verifyPassword,
  signToken,
  getProjects,
  getAvatar,
  getInvited,
  putUsername,
  putPassword,
  putAvatar,
  remove,
};
