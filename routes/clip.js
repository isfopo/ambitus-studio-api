const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");
const Clip = require("../db/models").Clip;

router.get("/", (req, res) => {
  res.status(200).json({ message: "you made it!" });
});

router.post("/", upload.single("content"), async (req, res) => {
  const clipBuffer = fs.readFileSync(req.file.path);

  try {
    const clip = await Clip.create({
      name: req.body.name,
      tempo: req.body.tempo,
      time_signature: req.body.time_signature,
      type: req.file.mimetype,
      content: clipBuffer,
    });

    return res.status(200).json(clip);
  } catch (e) {
    return res.status(400);
  }

  // TODO: put reference an existing scene and track
});

router.put("/name", upload.single("content"), async (req, res) => {
  const clip = await User.findByPk(req.body.id);

  clip.name = req.body.name;
  await clip.save();

  res.status(200).json(clip);
});

router.put("/content", upload.single("content"), async (req, res) => {
  const clip = await User.findByPk(req.body.id);

  if ((clip.type = req.file.mimetype)) {
    const clipBuffer = fs.readFileSync(req.file.path);
    clip.content = clip;
    await clip.save();

    res.status(200).json(clip);
  } else {
    return res
      .status(400)
      .json({
        error: "Clip type cannot be changed. Put clip in new track instead.",
      });
  }
});

module.exports = router;
