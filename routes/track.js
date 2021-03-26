const express = require("express");
const router = express.Router();

const validate = require("./handlers/helpers/validate");
const Project = require("./handlers/project");
const Track = require("./handlers/track");
const Socket = require("./handlers/socket");

router.post("/", Project.authorize, async (req, res) => {
  try {
    Socket.broadcastUpdate("/project/tracks", {
      ProjectId: req.project.ProjectId,
    });
    return res
      .status(200)
      .json(
        await Track.createAndPopulate(req.project, Track.validatePost(req.body))
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.query.TrackId);
    const clips = await track.getClips();
    return res.status(200).json({ ...track.dataValues, clips });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/name", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.query.TrackId);
    return res.status(200).json({ name: track.name });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/settings", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.query.TrackId);
    return res.status(200).json({ settings: track.settings });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/name", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.body.TrackId);
    track.name = validate.name(req.body.name);
    await track.save();
    Socket.broadcastUpdate("/track/name", {
      ProjectId: req.project.ProjectId,
      TrackId: req.body.TrackId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.put("/settings", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.body.TrackId);
    track.settings = validate.settings(req.body.settings);
    await track.save();
    Socket.broadcastUpdate("/track/settings", {
      ProjectId: req.project.ProjectId,
      TrackId: req.body.TrackId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.delete("/", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.body.TrackId);
    await Track.destroyAndDepopulate(track);
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
