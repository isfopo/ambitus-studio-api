const validate = require("./helpers/validate");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../" + "temp") });
const fs = require("fs");

const User = require("../../db/models").User;

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
 * middleware that will check and parse token authentication header assigning user id and name to req.user
 * @param {request} req express request Object
 * @param {response} res express response object
 * @param {next} next express callback function
 */
const authorize = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
      if (error) {
        return res.status(403).json({ error: ["token not authorized"] });
      } else {
        if (user.exp < Date.now()) {
          req.user = await isInDatabase(user.UserId);
          next();
        } else {
          return res.status(403).json({ error: ["token has expired"] });
        }
      }
    });
  } else {
    return res.status(403).json({ error: ["token not present"] });
  }
};

/**
 * determines if given user id is present in database
 * @param {string} UserId the UserId of the user to be found
 * @returns {boolean} if the user is found
 */
const isInDatabase = async (UserId = "") => {
  const user = await User.findByPk(UserId);

  if (user === null) {
    throw new Error("Couldn't find requested user in database");
  } else {
    return user;
  }
};

/**
 * creates user in database
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const post = async (req, res) => {
  try {
    const { username, password } = validatePost(req.body);

    if ((await User.findOne({ where: { username } })) === null) {
      const newUser = await User.create({
        username,
        password: await hashValidPassword(password),
      });
      res.status(200).json({
        UserId: newUser.UserId,
        username: newUser.username,
      });
    } else {
      return res.status(400).json({ error: ["username already exists"] });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

/**
 * gets a user's info from database
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const get = async (req, res) => {
  try {
    if (req.body.UserId) {
      const user = await UserHandler.isInDatabase(validate.id(req.body.UserId));
      if (user) {
        return res
          .status(200)
          .json({
            UserId: user.UserId,
            username: user.username,
            avatar: user.avatar,
          });
      } else {
        return res.status(404).json({ error: ["UserId could not be found"] });
      }
    } else if (req.body.username) {
      const user = await UserTable.findOne({
        where: { username: validate.name(req.body.username) },
      });
      if (user) {
        return res
          .status(200)
          .json({
            UserId: user.UserId,
            username: user.username,
            avatar: user.avatar,
          });
      } else {
        return res.status(404).json({ error: ["username could not be found"] });
      }
    } else if (_.isEmpty(req.body)) {
      const users = await UserTable.findAll();
      return res.status(200).json(
        users.map((user) => {
          return {
            UserId: user.UserId,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        })
      );
    } else {
      const keys = Object.keys(req.body);
      return res.status(400).json({
        error: keys.map((key) => `${key} is not a valid key`),
      });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

/**
 * authenticates user and gives a token is the response
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const getLogin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
    });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      jwt.sign(
        { UserId: user.UserId, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (error, token) => {
          if (error) {
            return res.status(400).json({ error: error.message });
          }
          return res.status(200).json({ UserId: user.UserId, token });
        }
      );
    } else {
      return res.status(400).json({ error: ["password is incorrect"] });
    }
  } catch (e) {
    return res.status(404).json({ error: ["username does not exist"] });
  }
};

/**
 * gets list of all of a user's projects
 * @param {req} request from client
 * @param {res} response to client passed from other middleware
 * @returns {res} response to client
 */
const getProjects = async (req, res) => {
  try {
    return res
      .status(200)
      .json({
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
    const stream = fs.createReadStream(req.user.avatar);

    stream.on("error", async (err) => {
      user.avatar = path.join(
        __dirname,
        "../" + "assets/images/default-avatar.jpg"
      );
      req.user.avatar_type = "image/jpeg";
      await req.user.save();
      res.status(404).json({ error: ["could not find avatar"] });
    });

    res.setHeader("Content-Type", req.user.avatar_type);
    stream.pipe(res);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
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
    req.user.password = await UserHandler.hashValidPassword(
      validate.password(req.body.newPassword)
    );
    await user.save();

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
    const userInDb = await User.findByPk(req.user.UserId);

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
    if (!user.avatar.includes("default-avatar.jpg")) {
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
  isInDatabase,
  hashValidPassword,
  post,
  get,
  getLogin,
  getProjects,
  getAvatar,
  putUsername,
  putPassword,
  putAvatar,
  remove,
};
