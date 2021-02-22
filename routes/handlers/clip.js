const validate = require("./helpers/validate");

const Clip = require("../../db/models").Clip;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.sceneId) {
    errors.push("body should contain an sceneId");
  } else if (!body.trackId) {
    errors.push("body should contain an trackId");
  } else if (!body.tempo) {
    errors.push("body should contain a tempo");
  } else if (!body.time_signature) {
    errors.push("body should contain a time_signature");
  } else if (!body.type) {
    errors.push("body should contain a type");
  }

  try {
    validate.id(body.sceneId);
    validate.id(body.trackId);
    validate.type(body.type);
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
const isInDatabase = async (id = "") => {
  const clip = await Clip.findByPk(id);

  if (clip === null) {
    throw new Error("Couldn't find requested clip in database");
  } else {
    return clip;
  }
};

module.exports = {
  validatePost,
  isInDatabase,
};
