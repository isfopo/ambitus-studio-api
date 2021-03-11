const express = require("express");
const router = express.Router();

const validate = require("./handlers/helpers/validate");
const Project = require("./handlers/project");
const Scene = require("./handlers/scene");

/**
 * Create a new scene in a project (Authorization Bearer Required)
 * @route POST /scene
 * @group scene - Operations about scene
 * @param {String} id.body.required - containing project's id
 * @param {String} name.body.optional - new scene's name
 * @param {integer} tempo.body.optional - new scene's tempo
 * @param {String} time_signature.body.optional - new scene's time signature
 * @returns {Object} 200 - An object of scene's info with generated scene id
 * @returns {Error}  400 - Invalid token, name, tempo or time signature
 */
router.post("/", Project.authorize, async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        await Scene.createAndPopulate(req.project, Scene.validatePost(req.body))
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Get scene information (Authorization Bearer Required)
 * @route GET /scene
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @returns {Object} 200 - An object of scene's info with generated scene id
 */
router.get("/", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    const clips = await scene.getClips();

    return res.status(200).json({ ...scene.dataValues, clips });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Change name of scene (Authorization Bearer Required)
 * @route GET /scene/name
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {String} name.body.optional - new name - if left empty, name will be null
 * @returns 204
 */
router.put("/name", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    scene.name = req.body.name ? validate.name(req.body.name) : null;
    await scene.save();
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change tempo of scene (Authorization Bearer Required)
 * @route GET /scene/tempo
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {String} tempo.body.optional - new tempo - if left empty, tempo will be null
 * @returns 204
 */
router.put("/tempo", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    scene.tempo = req.body.tempo ? validate.tempo(req.body.tempo) : null;
    await scene.save();
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change time signature of scene (Authorization Bearer Required)
 * @route GET /scene/time-signature
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {String} time_signature.body.optional - new time signature - if left empty, time signature will be null
 * @returns 204
 */
router.put("/time-signature", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    scene.time_signature = req.body.time_signature
      ? validate.timeSignature(req.body.time_signature)
      : null;
    await scene.save();
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change number of bars in scene (Authorization Bearer Required)
 * @route GET /scene/bars
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {String} bars.body.required - new number of bars
 * @returns 204
 */
router.put("/bars", Project.authorize, async (req, res) => {});

/**
 * Change number of repeats in scene (Authorization Bearer Required)
 * @route GET /scene/repeats
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {String} repeats.body.required - new number of repeats
 * @returns 204
 */
router.put("/repeats", Project.authorize, async (req, res) => {});

module.exports = router;
