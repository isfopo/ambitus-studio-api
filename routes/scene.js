const express = require("express");
const router = express.Router();

const Project = require("./handlers/project");
const Scene = require("./handlers/scene");

/**
 * Create a new scene in a project (Authorization Bearer Required)
 * @route POST /scene
 * @group scene - Operations about scene
 * @param {string} id.body.required - containing project's id
 * @param {string} name.body.optional - new scene's name
 * @param {integer} tempo.body.optional - new scene's tempo
 * @param {string} time_signature.body.optional - new scene's time signature
 * @returns {object} 200 - An object of scene's info with generated scene id
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
 * @param {string} ProjectId.body.required - project's id
 * @param {string} SceneId.body.required - scene's id
 * @returns {object} 200 - An object of scene's info with generated scene id
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Scene not found
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

module.exports = router;
