const express = require("express");
const router = express.Router();
const Project = require("./handlers/project");
const Message = require("./handlers/message");

/**
 * Create a new message (Authorization Bearer Required)
 * @route POST /message
 * @group message - Operations about messages
 * @param {String} ProjectId.body.required - project's id
 * @param {String} content.body.required - message content to post
 * @returns {object} 204
 */
router.post("/", Project.authorize, async (req, res) => {
  try {
    await req.user.addMessage(
      await req.project.createMessage(Message.validatePost(req.body))
    );
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Gets all messages from project (Authorization Bearer Required)
 * @route GET /project
 * @group message - Operations about messages
 * @returns {Array} 200 - an array of messages in project
 */
router.get("/", Project.authorize, async (req, res) => {
  return res.status(200).json(await req.project.getMessages());
});

module.exports = router;
