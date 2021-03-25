const validate = require("./helpers/validate");
const order = require("./helpers/order");
const Track = require("../../db/models").Track;

/**
 * checks for valid parameters for a new track
 */
const validatePost = (body = {}) => {
  const errors = [];

  if (!body.name) {
    errors.push("body should contain a name");
  } else if (!body.settings) {
    errors.push("body should contain settings");
  } else if (!body.type) {
    errors.push("body should contain a type");
  }

  try {
    validate.name(body.name);
    validate.settings(body.settings);
    validate.type(body.type);
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    throw errors;
  } else {
    return body;
  }
};

/**
 * determines if given track id is present in database
 * @param {string} id the id of the track to be found
 * @returns {track} if the track is found
 */
const findInDatabase = async (id = "") => {
  const track = await Track.findByPk(id);

  if (track === null) {
    throw new Error("Couldn't find requested track in database");
  } else {
    return track;
  }
};

/**
 * gets all tracks in project or one track with TracksId
 * @param {Object} project
 * @param {String} TrackId optional track to look up
 * @returns {Array} all tracks or specified track
 */
const getTracksInProject = async (project = {}, TrackId = null) => {
  return await project.getTracks(
    TrackId
      ? {
          where: { TrackId },
        }
      : null
  );
};

/**
 * Creates a new track in project and populates that track with clips for each track
 * @param {Object} project object from req.project
 * @param {Object} params verified track params
 * @returns new track id
 */
const createAndPopulate = async (project, params) => {
  try {
    const tracks = await project.getTracks();

    const track = await project.createTrack({
      name: params.name,
      settings: params.settings,
      type: params.type,
      index: params.index
        ? params.index
        : order.getNextIndex(
            tracks.map((track) => track.dataValues),
            "index"
          ),
    });

    const scenes = await project.getScenes();

    scenes.forEach(async (scene) => {
      const clip = await track.createClip({
        tempo: project.tempo,
        time_signature: project.time_signature,
      });
      scene.addClip(clip);
    });

    return await findInDatabase(track.TrackId);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Destroys a track and all of it's clips
 * @param {Object} track track to destroy and depopulate
 */
const destroyAndDepopulate = async (track) => {
  const clips = await track.getClips();

  clips.forEach(async (clip) => {
    await clip.destroy();
  });

  await track.destroy();
};

module.exports = {
  validatePost,
  findInDatabase,
  getTracksInProject,
  createAndPopulate,
  destroyAndDepopulate,
};
