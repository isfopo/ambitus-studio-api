const express = require("express");
const router = express.Router();
const UserHandler = require("./handlers/user");
const ProjectHandler = require("./handlers/project");
const UserTable = require("../db/models").User;
const ProjectTable = require("../db/models").Project;

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

router.get("/scenes", async (req, res) => {
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
