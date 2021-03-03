const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "../" + "temp") });
const { Op } = require("sequelize");

const validate = require("./handlers/helpers/validate");
const User = require("./handlers/user.js");
const Project = require("./handlers/project.js");
const models = require("../db/models");

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
    const { username, password } = validatePost(req.body);

    if ((await models.User.findOne({ where: { username } })) === null) {
      const newUser = await models.User.create({
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
    if (req.body.UserId) {
      const user = await findInDatabase(validate.id(req.body.UserId));
      if (user) {
        return res.status(200).json({
          UserId: user.UserId,
          username: user.username,
          avatar: user.avatar,
        });
      } else {
        return res.status(404).json({ error: ["UserId could not be found"] });
      }
    } else if (req.body.username) {
      const user = await models.User.findOne({
        where: { username: validate.name(req.body.username) },
      });
      if (user) {
        return res.status(200).json({
          UserId: user.UserId,
          username: user.username,
          avatar: user.avatar,
        });
      } else {
        return res.status(404).json({ error: ["username could not be found"] });
      }
    } else if (_.isEmpty(req.body)) {
      const users = await models.User.findAll();
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
    const user = await User.verifyPassword(
      req.body.username,
      req.body.password
    );
    if (user) {
      token = await User.signToken(user.UserId);
      return res.status(200).json({ token, UserId: user.UserId });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Get an array of user's current projects by id (Authorization Bearer Required)
 * @route GET /user/projects
 * @group user - Operations about user
 * @param {string} UserId.body.required - user's id
 * @returns {object} 200 - User id and an array of project ids
 * @returns {Error}  400 - Invalid id
 */
router.get("/projects", User.authorize, async (req, res) => {
  try {
    return res.status(200).json({
      UserId: req.user.UserId,
      projects: await req.user.getProjects(),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Get user's avatar
 * @route GET /user/avatar
 * @group user - Operations about user
 * @param {string} id.body.required - user's id
 * @returns {object} 200 - user's avatar
 * @returns {Error}  400 - Invalid id
 */
router.get("/avatar", async (req, res) => {
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
});

/**
 * Get an array of projects that user has been invited to (Authorization Bearer Required)
 * @route GET /user/invited
 * @group user - Operations about user
 * @returns {object} 200 - an array of projects that user has been invited to
 * @returns {Error}  400 - Invalid token or id
 */
router.get("/invites", User.authorize, async (req, res) => {
  const projects = await models.Project.findAll({
    where: { invited: { [Op.contains]: [req.user.UserId] } },
  });
  return res.status(200).json(projects);
});

/**
 * Change a user's username (Authorization Bearer Required)
 * @route PUT /user/username
 * @group user - Operations about user
 * @param {string} newName.body - user's newName
 * @returns {object} 200 - User id and changed name
 * @returns {Error}  400 - Invalid token, id or username
 */
router.put("/username", User.authorize, async (req, res) => {
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
});

/**
 * Change a user's password (Authorization Bearer Required)
 * @route PUT /user/password
 * @group user - Operations about user
 * @param {string} newPassword.body - user's new password
 * @returns {object} 200 - User id
 * @returns {Error}  400 - Invalid token, id or password
 */
router.put("/password", User.authorize, async (req, res) => {
  try {
    req.user.password = await hashValidPassword(
      validate.password(req.body.newPassword)
    );
    await req.user.save();

    return res.status(200).json({ UserId: req.user.UserId });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change a user's avatar (Authorization Bearer Required)
 * @route PUT /user/avatar
 * @group user - Operations about user
 * @param {string} avatar.multipart - user's new avatar
 * @returns {object} 204 - avatar has been changed
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  404 - Avatar image has been deleted - returns to default
 */
router.put(
  "/avatar",
  User.authorize,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const avatar = validate.avatar(req.file);

      if (!req.user.avatar.includes("default-avatar.jpg")) {
        fs.unlink(req.user.avatar, async (error) => {
          User.saveAvatar(req.user, avatar);
        });
      } else {
        User.saveAvatar(req.user, avatar);
      }
      res.status(204);
    } catch (e) {
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({ error: e.message });
      });
    }
  }
);

/**
 * Accept an invitation to a project and removes id from invited array (Authorization Bearer Required)
 * @route PUT /user/accept
 * @group user - Operations about user
 * @param {String} ProjectId.body.required - id for project to accept
 * @returns {Object} 204
 */
router.put("/accept", User.authorize, async (req, res) => {
  try {
    const project = await Project.findInDatabase(req.body.ProjectId);

    if (project.invited && project.invited.includes(req.user.UserId)) {
      project.invited = project.invited.filter((id) => id !== req.user.UserId);
      await project.save();

      await project.addUser(req.user);
      return res.sendStatus(204);
    } else {
      return res
        .status(400)
        .json({ error: ["user is not invited to this project"] });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * Delete user (Authorization Bearer Required)
 * @route DELETE /user/
 * @group user - Operations about user
 * @returns {object} 204
 * @returns {Error}  400 - Invalid token or id
 */
router.delete("/", User.authorize, async (req, res) => {
  try {
    await User.deleteAllMessages(req.user);
    await User.leaveAllProjects(req.user);

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
});

module.exports = router;
