const express = require("express");
const router = express.Router();

const order = require("./handlers/helpers/order");
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
    const trackParameters = Track.validatePost(req.body);
    const tracks = await req.project.getTracks();

    const trackDataValues = tracks.map((track) => track.dataValues);
    const nextIndex = order.getNextIndex(trackDataValues, "index");

    const track = await req.project.createTrack({
      name: trackParameters.name,
      settings: trackParameters.settings,
      type: trackParameters.type,
      index: nextIndex,
    });

    return res.status(200).json(track);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

/**
 * Get track information (Authorization Bearer Required)
 * @route GET /track
 * @group track - Operations about track
 * @param {string} projectId.body.required - project's id
 * @param {string} trackId.body.required - track's id
 * @returns {object} 200 - An object of track's info with generated track id
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Track not found
 */
router.get("/", Project.authorize, Track.get);

module.exports = router;
