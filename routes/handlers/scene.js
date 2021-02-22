const validate = require("./helpers/validate");
const Scene = require("../../db/models").Scene;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.id) {
    errors.push("body should contain an id");
  }

  try {
    validate.id(body.id);
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
 * determines if given scene id is present in database
 * @param {string} id the id of the scene to be found
 * @returns {scene} if the scene is found
 */
const isInDatabase = async (id = "") => {
  const scene = await Scene.findByPk(id);

  if (scene === null) {
    throw new Error("Couldn't find requested scene in database");
  } else {
    return scene;
  }
};

module.exports = {
  validatePost,
  isInDatabase,
};
