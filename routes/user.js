const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");

const validate = require("./handlers/helpers/validate");
const UserHandler = require("./handlers/user.js");
const UserTable = require("../db/models").User;

require("dotenv").config();

/**
 * Create a new user with a username and password
 * @route POST /user/
 * @group user - Operations about user
 * @param {string} username.body.required - new user's username
 * @param {string} password.body.required - new user's password
 * @returns {object} 200 - An object of user's info with generated user id
 * @returns {Error}  400 - Invalid or taken username or password
 */
router.post("/", async (req, res) => {
  try {
    const { username, password } = UserHandler.validatePost(req.body);

    if ((await UserTable.findOne({ where: { username } })) === null) {
      const newUser = await UserTable.create({
        username,
        password: await UserHandler.hashValidPassword(password),
      });
      res.status(200).json({
        id: newUser.id,
        username: newUser.username,
        avatar: newUser.avatar,
      });
    } else {
      return res.status(400).json({ error: ["username already exists"] });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

/**
 * Gets either all users or one user based on id or username
 * @route GET /user/
 * @group user - Operations about user
 * @param {string} id.body.optional - user's id
 * @param {string} username.body.optional - user's username
 * @returns {object} 200 - An object of user's info of an array of all users info
 * @returns {Error}  404 - User could not be found
 */
router.get("/", async (req, res) => {
  try {
    if (req.body.id) {
      const user = await UserTable.findByPk(validate.id(req.body.id));
      if (user) {
        return res
          .status(200)
          .json({ id: user.id, username: user.username, avatar: user.avatar });
      } else {
        return res.status(404).json({ error: ["id could not be found"] });
      }
    } else if (req.body.username) {
      const user = await UserTable.findOne({
        where: { username: validate.name(req.body.username) },
      });
      if (user) {
        return res
          .status(200)
          .json({ id: user.id, username: user.username, avatar: user.avatar });
      } else {
        return res.status(404).json({ error: ["username could not be found"] });
      }
    } else if (_.isEmpty(req.body)) {
      const users = await UserTable.findAll();
      return res.status(200).json(
        users.map((user) => {
          return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
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
});

/**
 * Get a JWT with a username and password
 * @route GET /user/login
 * @group user - Operations about user
 * @param {string} username.body.required - new user's username
 * @param {string} password.body.required - new user's password
 * @returns {object} 200 - a valid JSON Web Token
 * @returns {Error}  400 - Invalid or taken username or password
 */
router.get("/login", async (req, res) => {
  try {
    const user = await UserTable.findOne({
      where: { username: req.body.username },
    });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (error, token) => {
          if (error) {
            return res.status(400).json({ error: error.message });
          }
          return res.status(200).json({ id: user.id, token });
        }
      );
    } else {
      return res.status(400).json({ error: ["password is incorrect"] });
    }
  } catch (e) {
    return res.status(404).json({ error: ["username does not exist"] });
  }
});

/**
 * Get an array of user's current projects by id (Authorization Bearer Required)
 * @route GET /user/projects
 * @group user - Operations about user
 * @param {string} id.body.required - user's id
 * @returns {object} 200 - User id and an array of project ids
 * @returns {Error}  400 - Invalid id
 */
router.get("/projects", UserHandler.authorize, async (req, res) => {
  try {
    const user = await UserTable.findByPk(req.body.id);

    return res
      .status(200)
      .json({ id: user.id, projects: await user.getProjects() });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Get user's avatar
 * @route GET /user/projects
 * @group user - Operations about user
 * @param {string} id.body.required - user's id
 * @returns {object} 200 - user's avatar
 * @returns {Error}  400 - Invalid id
 */
router.get("/avatar-path", async (req, res) => {});

/**
 * Change a user's username (Authorization Bearer Required)
 * @route PUT /user/username
 * @group user - Operations about user
 * @param {string} newName.body - user's newName
 * @returns {object} 200 - User id and changed name
 * @returns {Error}  400 - Invalid token, id or username
 */
router.put("/username", UserHandler.authorize, async (req, res) => {
  try {
    const user = await UserTable.findByPk(req.user.id);

    user.username = validate.name(req.body.newName);

    await user.save();

    return res.status(200).json({ id: user.id, username: user.username });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: ["username already exists"] });
    } else {
      return res.status(400).json({ error: e.message });
    }
  }
});

/**
 * Change a user's password (Authorization Bearer Required)
 * @route PUT /user/password
 * @group user - Operations about user
 * @param {string} newPassword.body - user's new password
 * @returns {object} 200 - User id
 * @returns {Error}  400 - Invalid token, id or password
 */
router.put("/password", UserHandler.authorize, async (req, res) => {
  try {
    const user = await UserTable.findByPk(req.user.id);

    user.password = await UserHandler.hashValidPassword(
      validate.password(req.body.newPassword)
    );
    await user.save();

    return res.status(200).json({ id: user.id });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change a user's avatar (Authorization Bearer Required)
 * @route PUT /user/avatar
 * @group user - Operations about user
 * @param {string} avatar.multipart - user's new avatar
 * @returns {object} 200 - User id and changed avatar path
 * @returns {Error}  400 - Invalid token or id
 */
router.put(
  "/avatar",
  UserHandler.authorize,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await UserTable.findByPk(req.user.id);

      const avatar = validate.avatar(req.file);

      fs.unlink(user.avatar, async () => {
        user.avatar = avatar.path;
        await user.save();

        res
          .status(200)
          .json({ id: user.id, username: user.username, avatar: user.avatar });
      });
    } catch (e) {
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({ error: e.message });
      });
    }
  }
);

/**
 * Delete user (Authorization Bearer Required)
 * @route DELETE /user/
 * @group user - Operations about user
 * @returns {object} 204
 * @returns {Error}  400 - Invalid token or id
 */
router.delete("/", UserHandler.authorize, async (req, res) => {
  try {
    const user = await UserTable.findByPk(req.user.id);

    if (user) {
      await user.destroy();
      return res.sendStatus(204);
    } else {
      return res.status(400).json({ error: ["user does not exist"] });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
