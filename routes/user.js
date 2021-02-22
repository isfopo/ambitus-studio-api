const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../" + "temp") });
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
 * @returns {object} 200 - An object of user's info or an array of all users info
 * @returns {Error}  404 - User could not be found
 */
router.get("/", async (req, res) => {
  try {
    if (req.body.id) {
      const user = await UserHandler.isInDatabase(validate.id(req.body.id));
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
    return res
      .status(200)
      .json({ id: req.user.id, projects: await req.user.getProjects() });
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
router.get("/avatar", async (req, res) => {
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
});

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
    req.user.username = validate.name(req.body.newName);

    await req.user.save();

    return res
      .status(200)
      .json({ id: req.user.id, username: req.user.username });
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
    req.user.password = await UserHandler.hashValidPassword(
      validate.password(req.body.newPassword)
    );
    await user.save();

    return res.status(200).json({ id: req.user.id });
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
 * @returns {Error}  404 - Avatar image has been deleted - returns to default
 */
router.put(
  "/avatar",
  UserHandler.authorize,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await UserTable.findByPk(req.user.id);

      const avatar = validate.avatar(req.file);

      if (!user.avatar.includes("default-avatar.jpg")) {
        fs.unlink(req.user.avatar, async (error) => {
          req.user.avatar = avatar.path;
          req.user.avatar_type = avatar.mimetype;
          await req.user.save();

          res.status(200).json({
            id: req.user.id,
            username: req.user.username,
            avatar: req.user.avatar,
          });
        });
      } else {
        req.user.avatar = avatar.path;
        req.user.avatar_type = avatar.mimetype;
        await req.user.save();

        res.status(200).json({
          id: req.user.id,
          username: req.user.username,
          avatar: req.user.avatar,
        });
      }
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
});

module.exports = router;
