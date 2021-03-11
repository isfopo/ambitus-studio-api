const express = require("express");
const router = express.Router();

const Project = require("./handlers/project");
const Track = require("./handlers/track");

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
