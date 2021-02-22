const validate = require("./helpers/validate");

const Clip = require("../../db/models").Clip;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain an id");
  } else if (!body.type) {
    errors.push("body should contain a type");
  }

  try {
    validate.id(body.id);
    validate.type(body.type);
    body.name && validate.name(body.name);
    body.tempo && validate.tempo(body.tempo);
    body.time_signature && validate.timeSignature(body.time_signature);
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
