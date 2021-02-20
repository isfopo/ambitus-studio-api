const express = require("express");
const router = express.Router();
const UserHandler = require("./handlers/user");
const ProjectHandler = require("./handlers/project");
const UserTable = require("../db/models").User;
const ProjectTable = require("../db/models").Project;

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
router.post("/", UserHandler.authorize, async (req, res) => {
  try {
    const newProject = ProjectHandler.validatePost(req.body);

    const user = await UserTable.findByPk(req.user.id);
    const project = await user.createProject({
      name: newProject.name,
      tempo: newProject.tempo,
      time_signature: newProject.time_signature,
    });

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * gets all scenes from a project (Authorization Bearer Required)
 * @route GET /project/scenes
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An array of scenes in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/scenes", ProjectHandler.authorize, async (req, res) => {
  try {
    const project = await ProjectTable.findByPk(req.body.id);
    const scenes = await project.getScenes();

    res.status(200).json(scenes);
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
