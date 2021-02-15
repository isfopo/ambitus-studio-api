const express = require("express");
const router = express.Router();
const Project = require("../db/models").Project;

router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      // TODO: associate user who requested to project
      name: req.body.name,
      tempo: req.body.tempo,
      time_signature: req.body.time_signature,
    });

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json(e);
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
