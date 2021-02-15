const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");
const User = require("../db/models").User;

router.post("/", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (user === null) {
    const newUser = await User.create({
      username: req.body.username,
    });
    res.status(200).json(newUser);
  } else {
    res.status(200).json(user);
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
