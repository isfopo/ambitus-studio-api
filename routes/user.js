const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");
const UserHandler = require("./handlers/user.js");
const UserTable = require("../db/models").User;

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

router.put("/avatar", upload.single("avatar"), async (req, res) => {
  const imageBuffer = fs.readFileSync(req.file.path);

  const user = await User.findByPk(req.body.id);

  user.avatar = imageBuffer;
  await user.save();

  res.status(200).json(user);
});

router.get("/authorize", async (req, res) => {
  try {
    const user = await UserTable.findOne({
      where: { username: req.body.username },
    });

    if (await UserHandler.authorize(user.username, req.body.password)) {
      return res.status(200).json(user); // TODO: send back and save JWT
    } else {
      return res.status(400).json({ error: ["password is incorrect"] });
    }
  } catch (e) {
    return res
      .status(404)
      .json({ error: ["the username provided could not be found"] });
  }
});

module.exports = router;
