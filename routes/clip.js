const express = require("express");
const router = express.Router();
const Readable = require("stream").Readable;
const multer = require("multer");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");

const models = require("../db/models");
const Project = require("./handlers/project");
const Scene = require("./handlers/scene");
const Track = require("./handlers/track");
const Clip = require("./handlers/clip");

// IDEA: maybe have a way to get clip by track and scene
/**
 * Get all clips in project, scene or track (Authorization Bearer Required)
 * @route GET /clip
 * @group clip - Operations about clips
 * @param {String} ProjectId.body.required
 * @param {String} SceneId.body.optional
 * @param {String} TrackId.body.optional
 * @returns {Array} 200 - A nested array of clips in project,  organized by scene then track
 */
router.get("/", Project.authorize, async (req, res) => {
  const scenes = await req.project.getScenes(
    req.body.SceneId
      ? {
          where: { SceneId: req.body.SceneId },
        }
      : null
  );

  const tracks = await req.project.getTracks(
    req.body.TrackId
      ? {
          where: { TrackId: req.body.TrackId },
        }
      : null
  );

  const clips = [];

  for (let i = 0; i < scenes.length; i++) {
    const sceneClips = [];
    for (let j = 0; j < tracks.length; j++) {
      const trackClips = await tracks[j].getClips({
        where: { SceneId: scenes[i].SceneId },
      });
      sceneClips.push({ [tracks[j].TrackId]: trackClips[0] });
    }
    clips.push({ [scenes[i].SceneId]: sceneClips });
  }

  return res.status(200).json(clips);
});

router.get("/content", Project.authorize, async (req, res) => {
  const clip = await findInDatabase(req.body.ClipId);
  if (clip.content) {
    const stream = Readable.from(clip.content);
    stream.pipe(res);
  } else {
    return res.status(400).json({ error: e.message });
  }
});

router.put("/name", Project.authorize, async (req, res) => {
  const clip = await User.findByPk(req.body.id);

  clip.name = req.body.name;
  await clip.save();

  res.status(200).json(clip);
});

// new clip must match tracks, mimetype and have tempo and time signature
router.put(
  "/content",
  Project.authorize,
  upload.single("content"),
  async (req, res) => {
    const clip = await findInDatabase(req.body.id);

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
  }
);

module.exports = router;
