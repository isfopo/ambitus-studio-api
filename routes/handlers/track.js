const validate = require("./helpers/validate");
const Track = require("../../db/models").Track;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.ProjectId) {
    errors.push("body should contain a ProjectId");
  } else if (!body.name) {
    errors.push("body should contain a name");
  } else if (!body.settings) {
    errors.push("body should contain settings");
  } else if (!body.type) {
    errors.push("body should contain a type");
  }

  try {
    validate.id(body.ProjectId);
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
const isInDatabase = async (id = "") => {
  const track = await Track.findByPk(id);

  if (track === null) {
    throw new Error("Couldn't find requested track in database");
  } else {
    return track;
  }
};

const get = async (req, res) => {
  try {
    const track = Track.isInDatabase(req.body.trackId);
    return res.status(200).json(track);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = {
  validatePost,
  isInDatabase,
  get,
};
