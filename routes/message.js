const express = require("express");
const router = express.Router();
const Message = require("./handlers/message");

router.get("/", Message.get);

module.exports = router;
