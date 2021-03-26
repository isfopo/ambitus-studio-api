const express = require("express");
const router = express.Router();

const validate = require("./handlers/helpers/validate");
const Project = require("./handlers/project");
const Scene = require("./handlers/scene");
const Socket = require("./handlers/socket");

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

router.get("/", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    const clips = await scene.getClips();

    return res.status(200).json({ ...scene.dataValues, clips });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/name", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ name: scene.name });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/tempo", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ tempo: scene.tempo });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/time_signature", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ time_signature: scene.time_signature });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/repeats", Project.authorize, async (req, res) => {
  try {
    const scene = await Scene.findInDatabase(req.query.SceneId);
    return res.status(200).json({ repeats: scene.repeats });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

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
