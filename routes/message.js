const express = require("express");
const router = express.Router();

const Project = require("./handlers/project");
const Message = require("./handlers/message");
const Socket = require("./handlers/socket");

router.post("/", Project.authorize, async (req, res) => {
  try {
    await req.user.addMessage(
      await req.project.createMessage(Message.validatePost(req.body))
    );
    Socket.broadcastUpdate("/message", {
      ProjectId: req.project.ProjectId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/", Project.authorize, async (req, res) => {
  return res.status(200).json(await req.project.getMessages());
});

module.exports = router;
