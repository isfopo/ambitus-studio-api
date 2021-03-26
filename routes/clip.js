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
const Socket = require("./handlers/socket");

router.get("/", Project.authorize, async (req, res) => {
  return res
    .status(200)
    .json(
      await Clip.getClipsFromScenesAndTracks(
        await Scene.getScenesInProject(req.project, req.query.SceneId),
        await Track.getTracksInProject(req.project, req.query.TrackId)
      )
    );
});

router.get("/name", Project.authorize, async (req, res) => {
  try {
    const clip = await Clip.findInDatabase(req.query.ClipId);
    return res.status(200).json({ name: clip.name });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/content", Project.authorize, async (req, res) => {
  try {
    const clip = await Clip.findInDatabase(req.query.ClipId);
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
  Socket.broadcastUpdate("/clip/name", {
    ProjectId: req.project.ProjectId,
    ClipId: req.body.ClipId,
  });
  res.sendStatus(204);
});

router.put("/content", upload.single("content"), async (req, res) => {
  Project.authorize(req, res, async () => {
    try {
      const clip = await Clip.findInDatabase(req.body.ClipId);
      const track = await Track.findInDatabase(clip.TrackId);

      if (req.file.mimetype === "audio/wave") {
        req.file.mimetype = "audio/wav";
      }

      if (!req.file || req.file.mimetype === track.type) {
        Clip.deleteContent(clip.content);
        Clip.saveData(clip, req.body);
        Clip.saveContent(clip, req.file);
        Socket.broadcastUpdate("/clip/content", {
          ProjectId: req.project.ProjectId,
          ClipId: req.body.ClipId,
        });
        res.sendStatus(204);
      } else {
        throw new Error("content mimetype must match track mimetype");
      }
    } catch (e) {
      if (req.file) {
        fs.unlink(req.file.path, () => {
          return res.status(400).json({ error: e.message });
        });
      } else {
        return res.status(400).json({ error: e.message });
      }
    }
  });
});

module.exports = router;
