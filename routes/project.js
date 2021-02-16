const express = require("express");
const router = express.Router();
const User = require("../db/models").User;
const Project = require("../db/models").Project;

router.post("/", async (req, res) => {
  try {
    const user = await User.findByPk(req.body.userId);
    const project = await user.createProject({
      name: req.body.name,
      tempo: req.body.tempo,
      time_signature: req.body.time_signature,
    });

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.get("/scenes", async (req, res) => {
  try {
    const project = await Project.findByPk(req.body.id);
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
