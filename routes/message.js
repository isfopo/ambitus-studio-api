const express = require("express");
const router = express.Router();
const Project = require("./handlers/project");
const Message = require("./handlers/message");

router.post("/", Project.authorize, async (req, res) => {
  const message = await req.project.createMessage(
    Message.validatePost(req.body)
  );
  await req.user.addMessage(message);
  return res.status(204).json(message);
});

router.get("/", async (req, res) => {
  return res.status(200).json({ msg: "you made it!" });
});

module.exports = router;
