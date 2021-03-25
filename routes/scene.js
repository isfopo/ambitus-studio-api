const express = require("express");
const router = express.Router();

const validate = require("./handlers/helpers/validate");
const Project = require("./handlers/project");
const Scene = require("./handlers/scene");
const Socket = require("./handlers/socket");

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
    Socket.broadcastUpdate("/project/scenes", {
      ProjectId: req.project.ProjectId,
    });
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
    const scene = await Scene.findInDatabase(req.query.SceneId);
    const clips = await scene.getClips();

    return res.status(200).json({ ...scene.dataValues, clips });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get name of scene (Authorization Bearer Required)
 * @route GET /scene/name
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @returns {Object} 200 - name of scene
 */
router.get("/name", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ name: scene.name });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get tempo of scene (Authorization Bearer Required)
 * @route GET /scene/tempo
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @returns {Object} 200 - tempo of scene
 */
router.get("/tempo", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ tempo: scene.tempo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get time signature of scene (Authorization Bearer Required)
 * @route GET /scene/time_signature
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @returns {Object} 200 - time signature of scene
 */
router.get("/time_signature", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ time_signature: scene.time_signature });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get repeats of scene (Authorization Bearer Required)
 * @route GET /scene/repeats
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @returns {Object} 200 - repeats of scene
 */
router.get("/repeats", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ repeats: scene.repeats });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Change name of scene (Authorization Bearer Required)
 * @route PUT /scene/name
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
    Socket.broadcastUpdate("/scene/name", {
      ProjectId: req.project.ProjectId,
      SceneId: req.body.SceneId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change tempo of scene (Authorization Bearer Required)
 * @route PUT /scene/tempo
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
    Socket.broadcastUpdate("/scene/tempo", {
      ProjectId: req.project.ProjectId,
      SceneId: req.body.SceneId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change time signature of scene (Authorization Bearer Required)
 * @route PUT /scene/time-signature
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {String} time_signature.body.optional - new time signature - if left empty, time signature will be null
 * @returns 204
 */
router.put("/time_signature", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    scene.time_signature = req.body.time_signature
      ? validate.timeSignature(req.body.time_signature)
      : null;
    await scene.save();
    Socket.broadcastUpdate("/scene/time_signature", {
      ProjectId: req.project.ProjectId,
      SceneId: req.body.SceneId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change number of repeats in scene (Authorization Bearer Required)
 * @route PUT /scene/repeats
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @param {Integer} repeats.body.required - new number of repeats
 * @returns 204
 */
router.put("/repeats", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    scene.repeats = validate.integer(req.body.repeats);
    await scene.save();
    Socket.broadcastUpdate("/scene/repeats", {
      ProjectId: req.project.ProjectId,
      SceneId: req.body.SceneId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Destroy scene and all clips in scene (Authorization Bearer Required)
 * @route DELETE /scene
 * @group scene - Operations about scene
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - scene's id
 * @returns 204
 */
router.delete("/", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.body.SceneId);
    await Scene.destroyAndDepopulate(scene);
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
