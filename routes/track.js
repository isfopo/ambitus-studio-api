const express = require("express");
const router = express.Router();

const validate = require("./handlers/helpers/validate");
const Project = require("./handlers/project");
const Track = require("./handlers/track");
const Socket = require("./handlers/socket");

/**
 * Create a new track in a project (Authorization Bearer Required)
 * @route POST /track
 * @group track - Operations about track
 * @param {string} id.body.required - containing project's id
 * @param {integer} name.body.required - new track's name
 * @param {string} settings.body.required - new track's settings
 * @param {string} type.body.required - new track's type
 * @returns {object} 200 - An object of track's info with generated track id
 * @returns {Error}  400 - Invalid token, name, tempo or time signature
 */
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

/**
 * Get track information (Authorization Bearer Required)
 * @route GET /track
 * @group track - Operations about track
 * @param {string} ProjectId.body.required - project's id
 * @param {string} TrackId.body.required - track's id
 * @returns {object} 200 - An object of track's info with generated track id
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Track not found
 */
router.get("/", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.body.TrackId);
    const clips = await track.getClips();
    return res.status(200).json({ ...track.dataValues, clips });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get name of track (Authorization Bearer Required)
 * @route GET /track/name
 * @group track - Operations about track
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - track's id
 * @returns {Object} 200 - name of track
 */
router.get("/name", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.body.TrackId);
    return res.status(200).json({ name: track.name });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get settings of track (Authorization Bearer Required)
 * @route GET /track/settings
 * @group track - Operations about track
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - track's id
 * @returns {Object} 200 - settings of track
 */
router.get("/settings", Project.authorize, async (req, res) => {
  try {
    const track = await Track.findInDatabase(req.body.TrackId);
    return res.status(200).json({ settings: track.settings });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Change name of track (Authorization Bearer Required)
 * @route PUT /track/name
 * @group track - Operations about track
 * @param {String} ProjectId.body.required - project's id
 * @param {String} TrackId.body.required - track's id
 * @param {String} name.body.required - new name
 * @returns 204
 */
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

/**
 * Change settings of track (Authorization Bearer Required)
 * @route PUT /track/settings
 * @group track - Operations about track
 * @param {String} ProjectId.body.required - project's id
 * @param {String} TrackId.body.required - track's id
 * @param {String} settings.body.optional - new settings - if left empty, settings will be empty object
 * @returns 204
 */
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

/**
 * Destroy track and all clips in track (Authorization Bearer Required)
 * @route DELETE /track
 * @group track - Operations about track
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - track's id
 * @returns 204
 */
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
