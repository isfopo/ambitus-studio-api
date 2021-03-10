const validate = require("./helpers/validate");
const order = require("./helpers/order");
const Scene = require("../../db/models").Scene;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.ProjectId) {
    errors.push("body should contain an ProjectId");
  }

  try {
    validate.id(body.ProjectId);
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
const findInDatabase = async (id = "") => {
  const scene = await Scene.findByPk(id);

  if (scene === null) {
    throw new Error("Couldn't find requested scene in database");
  } else {
    return scene;
  }
};

/**
 * gets all scene in project or one track with SceneId
 * @param {Object} project
 * @param {String} SceneId optional track to look up
 * @returns {Array} all scene or specified track
 */
const getScenesInProject = async (project = {}, SceneId = null) => {
  return await project.getScenes(
    SceneId
      ? {
          where: { SceneId: SceneId },
        }
      : null
  );
};

/**
 * Creates a new scene in project and populates that scene with clips for each track
 * @param {Object} project object from req.project
 * @param {Object} params verified scene params
 * @returns new scene id
 */
const createAndPopulate = async (project, params) => {
  const scenes = await project.getScenes();

  const scene = await project.createScene({
    name: params.name,
    tempo: params.tempo,
    time_signature: params.time_signature,
    index: params.index
      ? params.index
      : order.getNextIndex(
          scenes.map((scene) => scene.dataValues),
          "index"
        ),
  });

  const tracks = await project.getTracks();

  tracks.forEach(async (track) => {
    const clip = await scene.createClip({
      tempo: project.tempo,
      time_signature: project.time_signature,
    });
    await track.addClip(clip);
  });

  return await findInDatabase(scene.SceneId);
};

module.exports = {
  validatePost,
  findInDatabase,
  getScenesInProject,
  createAndPopulate,
};
