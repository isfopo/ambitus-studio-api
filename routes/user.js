const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const _ = require("lodash");
const upload = multer({ dest: path.join(__dirname, "../fs/avatar") });
const { Op } = require("sequelize");

const validate = require("./handlers/helpers/validate");
const User = require("./handlers/user.js");
const Project = require("./handlers/project.js");
const models = require("../db/models");

require("dotenv").config();

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

router.get("/", async (req, res) => {
  try {
    if (req.query.UserId) {
      const user = await User.findInDatabase(validate.id(req.query.UserId));
      if (user) {
        return res.status(200).json({
          UserId: user.UserId,
          username: user.username,
          bio: user.bio,
        });
      } else {
        return res.status(404).json({ error: ["UserId could not be found"] });
      }
    } else if (req.query.username) {
      const user = await models.User.findOne({
        where: { username: validate.name(req.query.username) },
      });
      if (user) {
        return res.status(200).json({
          UserId: user.UserId,
          username: user.username,
          bio: user.bio,
        });
      } else {
        return res.status(404).json({ error: ["username could not be found"] });
      }
    } else if (_.isEmpty(req.query)) {
      const users = await models.User.findAll();
      return res.status(200).json(
        users.map((user) => {
          return {
            UserId: user.UserId,
            username: user.username,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        })
      );
    } else {
      const keys = Object.keys(req.query);
      return res.status(400).json({
        error: keys.map((key) => `${key} is not a valid key`),
      });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/login", async (req, res) => {
  try {
    const user = await User.verifyPassword(
      req.query.username,
      req.query.password
    );
    if (user) {
      token = await User.signToken(user.UserId);
      return res.status(200).json({ token, UserId: user.UserId });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

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

router.get("/avatar", async (req, res) => {
  try {
    const user = await User.findInDatabase(req.query.UserId);
    const stream = fs.createReadStream(user.avatar);

    stream.on("error", async (err) => {
      user.avatar = path.join(
        __dirname,
        "../assets/images/default-avatar.jpeg"
      );
      user.avatar_type = "image/jpeg";
      await user.save();
      res.status(404).json({ error: "could not find avatar" });
    });

    res.setHeader("Content-Type", user.avatar_type);
    stream.pipe(res);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/invites", User.authorize, async (req, res) => {
  const projects = await models.Project.findAll({
    where: { invited: { [Op.contains]: [req.user.UserId] } },
  });
  return res.status(200).json(projects);
});

router.put("/username", User.authorize, async (req, res) => {
  try {
    req.user.username = validate.name(req.body.newName);
    await req.user.save();
    return res.sendStatus(204);
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: ["username already exists"] });
    } else {
      return res.status(400).json({ error: e.message });
    }
  }
});

router.put("/password", User.authorize, async (req, res) => {
  try {
    req.user.password = await User.hashValidPassword(
      validate.password(req.body.newPassword)
    );
    await req.user.save();

    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.put("/bio", User.authorize, async (req, res) => {
  try {
    req.user.bio = req.body.bio ? validate.bio(req.body.bio) : null;
    await req.user.save();
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.put("/avatar", upload.single("avatar"), async (req, res) => {
  User.authorize(req, res, async () => {
    try {
      const avatar = validate.avatar(req.file);

      if (!req.user.avatar.includes("default-avatar.jpg")) {
        fs.unlink(req.user.avatar, async (error) => {
          User.saveAvatar(req.user, avatar);
        });
      } else {
        User.saveAvatar(req.user, avatar);
      }
      res.sendStatus(204);
    } catch (e) {
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({ error: e.message });
      });
    }
  });
});

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
