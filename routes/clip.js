const express = require("express");
const router = express.Router();
const Readable = require("stream").Readable;
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "../fs/clip-content") });
const fs = require("fs");

const models = require("../db/models");
const Project = require("./handlers/project");
const Scene = require("./handlers/scene");
const Track = require("./handlers/track");
const Clip = require("./handlers/clip");

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
  return res
    .status(200)
    .json(
      await Clip.getClipsFromScenesAndTracks(
        await Scene.getScenesInProject(req.project, req.body.SceneId),
        await Track.getTracksInProject(req.project, req.body.TrackId)
      )
    );
});

router.get("/content", Project.authorize, async (req, res) => {
  try {
    const clip = await Clip.findInDatabase(req.body.ClipId);
    const track = await Track.findInDatabase(clip.TrackId);

    if (clip.content) {
      const stream = fs.createReadStream(clip.content);

      res.setHeader("Content-Type", track.type);
      stream.pipe(res);
    } else {
      throw new Error("this clip has no content");
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.put("/name", Project.authorize, async (req, res) => {
  const clip = await Clip.findInDatabase(req.body.ClipId);

  clip.name = req.body.name;
  await clip.save();

  res.sendStatus(204);
});

router.put("/content", upload.single("content"), async (req, res) => {
  Project.authorize(req, res, async () => {
    try {
      const clip = await Clip.findInDatabase(req.body.ClipId);
      const track = await Track.findInDatabase(clip.TrackId);

      if (req.file.mimetype === track.type) {
        Clip.deleteContent(clip.content);
        Clip.saveData(clip, req.body);
        Clip.saveContent(clip, req.file);
        res.sendStatus(204);
      } else {
        throw new Error("content mimetype must match track mimetype");
      }
    } catch (e) {
      fs.unlink(req.file.path, () => {
        return res.status(400).json({ error: e.message });
      });
    }
  });
});

module.exports = router;
