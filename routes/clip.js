const express = require("express");
const router = express.Router();
const Readable = require("stream").Readable;
const multer = require("multer");
var FormData = require("form-data");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");
const Clip = require("../db/models").Clip;

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

    return res.status(200).json({ id: clip.id });
  } catch (e) {
    return res.status(400);
  }

  // TODO: put reference an existing scene and track
});

router.get("/content", async (req, res) => {
  const clip = await Clip.findByPk(req.body.id);
  const stream = Readable.from(clip.content);

  stream.pipe(res);
});

router.get("/meta", async (req, res) => {
  try {
    const clip = await Clip.findByPk(req.body.id);
    return res.status(200).json(clip);
  } catch (e) {
    return res.status(404).json(e);
  }
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
    return res.status(400).json({
      error: "Clip type cannot be changed. Put clip in new track instead.",
    });
  }
});

module.exports = router;
