const express = require("express");
const router = express.Router();
const User = require("./handlers/user");
const Project = require("./handlers/project");

/**
 * Create a new project (Authorization Bearer Required)
 * @route POST /project
 * @group project - Operations about project
 * @param {string} name.body.required - new project's name
 * @param {integer} tempo.body.required - new project's tempo
 * @param {string} time_signature.body.required - new project's time signature
 * @returns {object} 200 - An object of project's info with generated project id
 * @returns {Error}  400 - Invalid token, name, tempo or time signature
 */
router.post("/", User.authorize, async (req, res) => {
  try {
    const projectParameters = Project.validatePost(req.body);

    const project = await req.user.createProject({
      name: projectParameters.name,
      tempo: projectParameters.tempo,
      time_signature: projectParameters.time_signature,
    });

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Get project information (Authorization Bearer Required)
 * @route POST /project
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An object of project's info with generated project id
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/", Project.authorize, async (req, res) => {
  res.status(200).json(req.project);
});

/**
 * Get all scenes from a project (Authorization Bearer Required)
 * @route GET /project/scenes
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An array of scenes in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/scenes", Project.authorize, async (req, res) => {
  const scenes = await req.project.getScenes();
  res.status(200).json(scenes);
});

/**
 * Get all clips from a project (Authorization Bearer Required)
 * @route GET /project/clips
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An nested array of clips in project by scene
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/clips", Project.authorize, async (req, res) => {
  try {
    const scenes = await req.project.getScenes();

    // TODO: get clips for each scene

    const clips = scenes.map(async (scene) => {});

    res.status(200).json(clips);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.put("/invite", async (req, res) => {
  try {
    const project = findByPk(req.body.id);
    project.invited.push(req.body.invitee); // TODO: check if invitee is in db
    await project.save();

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json(e);
  }
});

module.exports = router;
