const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");

const validate = require("./handlers/helpers/validate");
const UserHandler = require("./handlers/user.js");
const UserTable = require("../db/models").User;

require("dotenv").config();

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

router.get("/login", async (req, res) => {
  try {
    const user = await UserTable.findOne({
      where: { username: req.body.username },
    });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      jwt.sign(
        { id: user.id, username: user.username }, // TODO: maybe this can be used to store projects and authorize users to them?
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (error, token) => {
          if (error) {
            console.log(error);
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

router.put("/username", UserHandler.authorize, async (req, res) => {
  const user = await UserTable.findByPk(req.user.id);

  user.username = validate.name(req.body.newName);

  await user.save();

  return res.status(200).json({ id: user.id, username: user.username });
});

router.put("/avatar", upload.single("avatar"), async (req, res) => {
  const imageBuffer = fs.readFileSync(req.file.path);

  const user = await User.findByPk(req.body.id);

  user.avatar = imageBuffer;
  await user.save();

  res.status(200).json(user);
});

module.exports = router;
