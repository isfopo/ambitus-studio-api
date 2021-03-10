const validate = require("./helpers/validate");

const Clip = require("../../db/models").Clip;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.SceneId) {
    errors.push("body should contain an SceneId");
  } else if (!body.TrackId) {
    errors.push("body should contain an TrackId");
  } else if (!body.name) {
    errors.push("body should contain a name");
  } else if (!body.tempo) {
    errors.push("body should contain a tempo");
  } else if (!body.time_signature) {
    errors.push("body should contain a time_signature");
  }

  try {
    validate.id(body.SceneId);
    validate.id(body.TrackId);
    validate.tempo(body.tempo);
    validate.timeSignature(body.time_signature);
    body.name && validate.name(body.name);
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
 * determines if given clip id is present in database
 * @param {string} id the id of the clip to be found
 * @returns {boolean} if the clip is found
 */
const findInDatabase = async (id = "") => {
  const clip = await Clip.findByPk(id);

  if (clip === null) {
    throw new Error("Couldn't find requested clip in database");
  } else {
    return clip;
  }
};

/**
 * returns a nested array of clips by scenes and tracks
 * @param {Array} scenes array of scenes in project
 * @param {Array} track array of tracks in project
 * @returns {Array} a nested array of clips by scenes and tracks
 */
const getClipsFromScenesAndTracks = async (scenes = [], tracks = []) => {
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

  return clips;
};

module.exports = {
  validatePost,
  findInDatabase,
  getClipsFromScenesAndTracks,
};
