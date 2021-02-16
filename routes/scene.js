const express = require("express");
const router = express.Router();
const Project = require("../db/models").Project;
const Scene = require("../db/models").Scene;

router.get("/", (req, res) => {
  res.status(200).json({ message: "you made it!" });
});

router.post("/", async (req, res) => {
  try {
    const project = await Project.findByPk(req.body.project);
    const scene = await project.createScene();
    return res.status(200).json(scene);
  } catch (e) {
    return res.status(400).json(e);
  }
});

module.exports = router;
