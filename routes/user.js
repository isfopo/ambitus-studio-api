const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");
const UserHandler = require("./handlers/user.js");
const UserModel = require("../db/models").User;

router.post("/", async (req, res) => {
  try {
    const { username, password } = UserHandler.validatePost(req.body);

    const user = await UserModel.findOne({ where: { username } });

    if (user === null) {
      const newUser = await UserModel.create({ username, password }); // TODO: hash this password
      res.status(200).json(newUser);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.put("/avatar", upload.single("avatar"), async (req, res) => {
  const imageBuffer = fs.readFileSync(req.file.path);

  const user = await User.findByPk(req.body.id);

  user.avatar = imageBuffer;
  await user.save();

  res.status(200).json(user);
});

router.get("/", (res, req) => {
  req.status(200).json({ message: "you made it!" });
});

module.exports = router;
